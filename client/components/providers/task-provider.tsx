"use client";
import React from "react";
import { Socket } from "socket.io-client";
import envs from "@/configs/envs";
import { createSocket } from "@/lib/socket";

interface ITaskContext {
  connected: boolean;
  socket: Socket | null;
  socketJoinPlan: (planId: string) => void;
}

const taskContext = React.createContext<ITaskContext | null>(null);

export const useTask = () => {
  const context = React.useContext(taskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider.");
  }
  return context;
};

type TTaskProvider = {
  children?: React.ReactNode;
};

const TaskProvider = ({ children }: TTaskProvider) => {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [connected, setConnected] = React.useState<boolean>(false);

  function onConnect() {
    console.log("onConnect");
    setConnected(true);
  }
  function onDisconnect() {
    console.log("onDisconnect");
    setConnected(false);
  }
  function onTaskEvent(value: string) {
    console.log(value);
  }

  React.useEffect(() => {
    function initSocket() {
      if (socket) {
        socket.disconnect();
      }
      const newSocket = createSocket({
        path: "/api/v1/socket.io",
        url: envs.NEXT_PUBLIC_SERVER_URL,
        namespace: "task",
        autoConnect: false,
      });
      setSocket(newSocket);
      newSocket.connect();

      newSocket.on("connect", onConnect);
      newSocket.on("disconnect", onDisconnect);
      newSocket.on("message", onTaskEvent);
    }
    initSocket();
    return () => {
      if (socket) {
        socket.disconnect();
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("message", onTaskEvent);
      }
    };
  }, []);

  const handleJoinPlan = (planId: string) => {
    if (!socket) return;
    socket.emit("joinPlanRoom", planId);
  };

  return (
    <taskContext.Provider
      value={{ connected, socket, socketJoinPlan: handleJoinPlan }}
    >
      {children}
    </taskContext.Provider>
  );
};

export default TaskProvider;
