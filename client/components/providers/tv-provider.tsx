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
import { audioPath, DISPLAY_SETTING } from "@/configs/constants";
import { Department } from "@/schema/department.schema";

interface ITaskContext {
  connected: boolean;
  socket: Socket | null;
  data: TVData;
  setData: (newData: Partial<TVData>) => void;
}
const TVContext = React.createContext<ITaskContext | null>(null);

export const useTV = () => {
  const context = React.useContext(TVContext);
  if (!context) {
    throw new Error("useTV must be used within a TVProvider.");
  }
  return context;
};

export type TVSettings = {
  col: number;
  speed: number;
  pinDepartmentId: string | null;
};

type TVData = TVSettings & {
  selectedDepartment: Department | null;
  isAudioAllowed: boolean;
};

export function TVProvider({
  children,
  defaultSettings,
}: {
  children?: React.ReactNode;
  defaultSettings?: TVData;
}) {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [connected, setConnected] = React.useState<boolean>(false);
  const [openDialog, setOpenDialog] = React.useState(true);

  const [tvData, setTVData] = React.useState<TVData>({
    col: 3,
    speed: 60,
    pinDepartmentId: null,
    selectedDepartment: null,
    isAudioAllowed: false,
    ...defaultSettings,
  });

  const handleSetData = (newData: Partial<TVData>) => {
    console.log(
      "pinDepartmentId",
      newData.pinDepartmentId ?? tvData.pinDepartmentId
    );
    // console.log({
    //   pinDepartmentId: newData.pinDepartmentId || tvData.pinDepartmentId,
    //   col: newData.col || tvData.col,
    //   speed: newData.speed || tvData.speed,
    // });
    document.cookie = `${DISPLAY_SETTING}=${JSON.stringify({
      pinDepartmentId: newData.pinDepartmentId ?? tvData.pinDepartmentId,
      col: newData.col ?? tvData.col,
      speed: newData.speed ?? tvData.speed,
    })}; path=/;`;
    setTVData((prev) => ({ ...prev, ...newData }));
  };

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
    if (socket && tvData.selectedDepartment) {
      socket.emit("joinDepartment", tvData.selectedDepartment.id);
    }
    return () => {
      if (socket && tvData.selectedDepartment) {
        socket.emit("leaveDepartment", tvData.selectedDepartment.id);
      }
    };
  }, [socket, tvData.selectedDepartment]);

  const handleAccessAudio = () => {
    const audio = new Audio(audioPath);
    audio.muted = true;
    audio
      .play()
      .then(() => {
        audio.pause();
        setTVData((prev) => ({ ...prev, isAudioAllowed: true }));
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
        data: tvData,
        setData: handleSetData,
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
