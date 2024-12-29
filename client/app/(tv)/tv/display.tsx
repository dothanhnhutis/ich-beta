"use client";
import React from "react";
import { useTV } from "@/components/providers/tv-provider";
import { cn } from "@/lib/utils";
import { PanelLeftIcon, VolumeOffIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { audioPath } from "@/configs/constants";
import { Display } from "@/schema/display.schema";
import { getDisplaysOfDepartment } from "@/services/display.service";

const DisplayItem = ({ data }: { data: Display }) => {
  const [isNew, setIsNew] = React.useState<boolean>(false);

  React.useEffect(() => {
    let id: NodeJS.Timeout;
    if (Date.now() - new Date(data.updatedAt).getTime() < 60000) {
      setIsNew(true);
      id = setTimeout(() => {
        setIsNew(false);
      }, 60000 - (Date.now() - new Date(data.updatedAt).getTime()));
    }
    return () => clearTimeout(id);
  }, [data]);

  return (
    <div
      className={cn(
        "p-2 border bg-white rounded-[10px]",
        isNew ? "animation-border" : ""
      )}
    >
      <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
      <div className="flex justify-end gap-4 items-center">
        <p className="text-xs text-muted-foreground">
          {`Priority: ${data.priority}`}
        </p>
        <p className="text-xs text-muted-foreground">
          {`CreateAt: ${format(data.createdAt, "dd/MM/yy HH:mm")}`}
        </p>
        <p className="text-xs text-muted-foreground">
          {`UpdatedAt: ${format(data.updatedAt, "dd/MM/yy HH:mm")}`}
        </p>
      </div>
    </div>
  );
};

const DisplayContainer = () => {
  const {
    connected,
    departmentsData,
    selectedId,
    isAudioAllowed,
    setAccessAudio,
    socket,
  } = useTV();
  const { toggleSidebar } = useSidebar();

  const departmentName = React.useMemo(() => {
    return departmentsData.find(({ id }) => id == selectedId);
  }, [departmentsData, selectedId]);

  const [displays, setDisplays] = React.useState<Display[]>([]);

  React.useEffect(() => {
    const handleFetch = async () => {
      setDisplays(selectedId ? await getDisplaysOfDepartment(selectedId) : []);
    };
    handleFetch();
  }, [selectedId]);

  const sortDisplays = (array: Display[]) => {
    return array.sort((a, b) => {
      if (a.priority > b.priority) {
        return -1;
      } else if (a.priority < b.priority) {
        return 1;
      } else {
        if (new Date(a.updatedAt).getTime() > new Date(b.updatedAt).getTime()) {
          return -1;
        } else if (
          new Date(a.updatedAt).getTime() > new Date(b.updatedAt).getTime()
        ) {
          return 1;
        } else {
          return 0;
        }
      }
    });
  };

  const handleCreateDisplay = React.useCallback(
    (data: Display) => {
      setDisplays(sortDisplays([data, ...displays]));
      if (isAudioAllowed) {
        const audio = new Audio(audioPath);
        audio.play();
      }
    },
    [displays, isAudioAllowed]
  );

  const handleUpdateDisplay = React.useCallback(
    (data: Display) => {
      const existsDisplay = displays.find((d) => d.id == data.id);
      const audio = new Audio(audioPath);
      if (existsDisplay) {
        const inDepartment = data.departments.find((d) => d.id == selectedId);
        console.log("handleUpdateDisplay ", inDepartment);

        if (!data.enable || !inDepartment) {
          setDisplays(sortDisplays(displays.filter((d) => d.id != data.id)));
        } else {
          setDisplays(
            sortDisplays(displays.map((d) => (d.id == data.id ? data : d)))
          );
          if (isAudioAllowed) {
            audio.play();
          }
        }
      } else {
        // const kk = data.departments.find(d => d.id == selectedId)
        if (data.enable) {
          setDisplays(sortDisplays([data, ...displays]));
          if (isAudioAllowed) {
            audio.play();
          }
        }
      }
    },
    [displays, isAudioAllowed, selectedId]
  );

  const handleDeleteDisplay = React.useCallback(
    (data: Display) => {
      setDisplays(sortDisplays(displays.filter((d) => d.id != data.id)));
      console.log("handleDeleteDisplay");
      console.log(data);
      if (isAudioAllowed) {
        const audio = new Audio(audioPath);
        audio.play();
      }
    },
    [displays, isAudioAllowed]
  );

  React.useEffect(() => {
    if (socket) {
      socket.on("createDisplay", handleCreateDisplay);
      socket.on("updateDisplay", handleUpdateDisplay);
      socket.on("deleteDisplay", handleDeleteDisplay);
    }

    return () => {
      if (socket) {
        socket.off("createDisplay", handleCreateDisplay);
        socket.off("updateDisplay", handleUpdateDisplay);
        socket.off("deleteDisplay", handleDeleteDisplay);
      }
    };
  }, [socket, handleCreateDisplay, handleUpdateDisplay, handleDeleteDisplay]);

  if (!selectedId)
    return (
      <div className="flex flex-col relative h-screen overflow-hidden">
        <div className="bg-white p-2">
          <div className="flex items-center gap-2 w-full">
            <button type="button" onClick={toggleSidebar} className="p-2">
              <PanelLeftIcon className="size-6 shrink-0 text-muted-foreground" />
            </button>
          </div>
        </div>
        <div className="h-full flex w-full items-center justify-center">
          <p>Không có phòng ban nào</p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col relative h-screen overflow-hidden">
      <div className="bg-white p-2">
        <div className="flex items-center gap-2 w-full">
          <button type="button" onClick={toggleSidebar} className="p-2">
            <PanelLeftIcon className="size-6 shrink-0 text-muted-foreground" />
          </button>

          <h4 className="text-lg font-semibold text-back line-clamp-2 w-full">
            {departmentName?.name ?? "error"}
          </h4>
          <div className="flex items-center gap-2">
            {!isAudioAllowed && (
              <button
                onClick={setAccessAudio}
                type="button"
                className="rounded-full p-2 shadow-md"
              >
                <VolumeOffIcon className="shrink-0 size-6 text-muted-foreground" />
              </button>
            )}

            <div
              className={cn(
                "size-2 rounded-full shrink-0",
                connected ? "bg-green-300" : "bg-red-300"
              )}
            />
          </div>
        </div>
      </div>

      <ScrollArea className="h-full">
        <main className="flex flex-col gap-1 p-1 h-full relative z-0">
          {displays.length > 0 ? (
            displays.map((d) => <DisplayItem key={d.id} data={d} />)
          ) : (
            <p className="text-center text-xl">Chưa có đơn hàng</p>
          )}
        </main>
      </ScrollArea>
    </div>
  );
};

export default DisplayContainer;
