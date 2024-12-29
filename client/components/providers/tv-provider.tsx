"use client";
import envs from "@/configs/envs";
import { createSocket } from "@/lib/socket";
import React from "react";
import { Socket } from "socket.io-client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { audioPath } from "@/configs/constants";
import { Department } from "@/schema/department.schema";

interface ITaskContext {
  connected: boolean;
  socket: Socket | null;
  selectedId: string | null;
  setSelectedId: (departmentId: string) => void;
  pinId: string | null;
  setPinId: (departmentId: string | null) => void;
  departmentsData: Department[];
  isAudioAllowed: boolean;
  setAccessAudio: () => void;
}
const TVContext = React.createContext<ITaskContext | null>(null);

export const useTV = () => {
  const context = React.useContext(TVContext);
  if (!context) {
    throw new Error("useTV must be used within a TVProvider.");
  }
  return context;
};

export function TVProvider({
  children,
  defaultPinId,
  departments,
}: {
  children?: React.ReactNode;
  defaultPinId?: string | null;
  departments: Department[];
}) {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [connected, setConnected] = React.useState<boolean>(false);

  const [openDialog, setOpenDialog] = React.useState(true);

  const [isAudioAllowed, setIsAudioAllowed] = React.useState(false);

  const [selectedId, setSelectedId] = React.useState<string | null>(
    defaultPinId || (departments.length == 0 ? null : departments[0].id)
  );
  const [pinId, setPinId] = React.useState<string | null>(defaultPinId ?? null);

  const [data] = React.useState<Department[]>(departments);

  function onConnect() {
    console.log("onConnect");
    setConnected(true);
  }

  function onDisconnect() {
    console.log("onDisconnect");
    setConnected(false);
  }

  React.useEffect(() => {
    if (!socket) {
      const newSocket = createSocket({
        path: "/api/v1/socket.io",
        url: envs.NEXT_PUBLIC_SERVER_URL,
        namespace: "department",
        autoConnect: false,
      });
      setSocket(newSocket);
      newSocket.connect();

      newSocket.on("connect", onConnect);
      newSocket.on("disconnect", onDisconnect);
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
      }
    };
  }, [socket]);

  React.useEffect(() => {
    if (socket && selectedId) {
      socket.emit("joinDepartment", selectedId);
    }
    return () => {
      if (socket && selectedId) {
        socket.emit("leaveDepartment", selectedId);
      }
    };
  }, [socket, selectedId]);

  const handleSelected = (departmentId: string) => {
    setSelectedId(departmentId);
  };

  const handleSetPin = (departmentId: string | null) => {
    if (departmentId) {
      document.cookie = `deparment:pin=${departmentId}; path=/;`;
    } else {
      document.cookie =
        "deparment:pin=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
    setPinId(departmentId);
  };

  const handleAccessAudio = () => {
    const audio = new Audio(audioPath);
    audio
      .play()
      .then(() => {
        audio.pause();
        setIsAudioAllowed(true);
        console.log("Quyền phát audio đã được cấp!");
      })
      .catch((err) => {
        console.error("Không thể xin quyền phát audio:", err);
      });
  };

  return (
    <TVContext.Provider
      value={{
        connected,
        socket,
        selectedId,
        setSelectedId: handleSelected,
        pinId,
        setPinId: handleSetPin,
        departmentsData: data,
        isAudioAllowed,
        setAccessAudio: handleAccessAudio,
      }}
    >
      {children}

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Trình duyệt của bạn không hỗ trợ phát âm thanh tự động
            </AlertDialogTitle>
            <AlertDialogDescription>
              {`Phát âm thanh tự động giúp cho bạn nhận được âm thanh thông báo. Bấm 'Cho phép' để nhận thông báo có âm thanh`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Từ chối</AlertDialogCancel>
            <AlertDialogAction onClick={handleAccessAudio}>
              Chấp nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TVContext.Provider>
  );
}
