"use client";
import React from "react";
import { Socket } from "socket.io-client";
import envs from "@/configs/envs";
import { createSocket } from "@/lib/socket";
import { CreateTask } from "@/schema/task.schema";

interface ITaskContext {
  connected: boolean;
  tasks: CreateTask[];
}

const initTaskContext: ITaskContext = {
  connected: false,
  tasks: [],
};

const taskContext = React.createContext<ITaskContext>(initTaskContext);

export const useTask = () => {
  const task = React.useContext(taskContext);
  return task;
};

type TTaskProvider = {
  children?: React.ReactNode;
};

const TaskProvider = ({ children }: TTaskProvider) => {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [taskData, setTaskData] = React.useState<ITaskContext>({
    connected: false,
    tasks: [],
  });

  function onConnect() {
    setTaskData((prev) => ({ ...prev, connected: true }));
  }
  function onDisconnect() {
    setTaskData((prev) => ({ ...prev, connected: false }));
  }
  function onTaskEvent(value: string) {
    console.log(value);
  }

  function onCreateTask(value: CreateTask) {
    console.log(value);
    setTaskData((prev) => ({ ...prev, tasks: [value, ...prev.tasks] }));
  }

  function onClearTask() {
    setTaskData((prev) => ({ ...prev, tasks: [] }));
  }

  const initSocket = () => {
    if (socket) {
      socket.disconnect();
    }
    const newSocket = createSocket({
      url: envs.NEXT_PUBLIC_SERVER_URL,
      namespace: "task",
      autoConnect: false,
    });
    setSocket(newSocket);
    newSocket.connect();
    newSocket.emit("joinPlanRoom", "nha_may");

    newSocket.on("connect", onConnect);
    newSocket.on("disconnect", onDisconnect);
    newSocket.on("message", onTaskEvent);
    newSocket.on("createTask", onCreateTask);
    newSocket.on("emptyTask", onClearTask);
  };

  React.useEffect(() => {
    initSocket();
    return () => {
      if (socket) {
        socket.disconnect();
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("message", onTaskEvent);
        socket.off("createTask", onCreateTask);
        socket.off("emptyTask", onClearTask);
      }
    };
  }, []);

  return (
    <taskContext.Provider value={taskData}>{children}</taskContext.Provider>
  );
};

export default TaskProvider;
