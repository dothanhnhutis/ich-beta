"use client";
import { useTV } from "@/components/providers/tv-provider";

import { useSidebar } from "@/components/ui/sidebar";
import { audioPath } from "@/configs/constants";
import { cn, sortByFields } from "@/lib/utils";
import { Display } from "@/schema/display.schema";
import { getDisplaysOfDepartment } from "@/services/display.service";
import { format } from "date-fns";
import { PanelLeftIcon, SettingsIcon, XIcon } from "lucide-react";
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// const DisplayItem = ({ data }: { data: Display }) => {
//   const [isNew, setIsNew] = React.useState<boolean>(false);

//   React.useEffect(() => {
//     let id: NodeJS.Timeout;
//     if (Date.now() - new Date(data.updatedAt).getTime() < 60000) {
//       setIsNew(true);
//       id = setTimeout(() => {
//         setIsNew(false);
//       }, 60000 - (Date.now() - new Date(data.updatedAt).getTime()));
//     }
//     return () => clearTimeout(id);
//   }, [data]);

//   return (
//     <div
//       className={cn(
//         "p-2 border bg-white rounded-[10px]",
//         isNew ? "animation-border" : ""
//       )}
//     >
//       <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
//       <div className="flex justify-end gap-4 items-center mt-2">
//         <p className="text-xs text-muted-foreground">
//           {`Ưu tiên: ${data.priority}`}
//         </p>
//         <p className="text-xs text-muted-foreground">
//           {`Ngày tạo: ${format(data.createdAt, "dd/MM/yy HH:mm")}`}
//         </p>
//         <p className="text-xs text-muted-foreground">
//           {`Ngày cập nhật: ${format(data.updatedAt, "dd/MM/yy HH:mm")}`}
//         </p>
//       </div>
//     </div>
//   );
// };

// const DisplayList = ({
//   displays,
//   col,
// }: {
//   displays: Display[];
//   col: number;
// }) => {
//   const displaysRef = React.useRef<HTMLDivElement | null>(null);

//   return (
//     <div
//       ref={displaysRef}
//       className="flex flex-col gap-2 basis-1/3 p-1 py-2  relative z-0 h-[calc(100vh_-_56px)] overflow-y-scroll"
//     >
//       {displays.length > 0 ? (
//         displays.map((d, idx) => (
//           <DisplayItem key={d.id} data={d} idx={idx * 3 + col + 1} />
//         ))
//       ) : (
//         <p className="text-center text-xl"></p>
//       )}
//     </div>
//   );
// };

const DisplayItem = ({ data }: { data: DisplayRow }) => {
  const [isNew, setIsNew] = React.useState<boolean>(false);

  React.useEffect(() => {
    let timeId: NodeJS.Timeout;
    setIsNew(Date.now() - new Date(data.updatedAt).getTime() < 60000);
    if (Date.now() - new Date(data.updatedAt).getTime() < 60000) {
      timeId = setTimeout(() => {
        setIsNew(false);
      }, 60000 - (Date.now() - new Date(data.updatedAt).getTime()));
    }
    return () => {
      clearTimeout(timeId);
    };
  }, [data]);

  return (
    <div className="bg-sky-200 rounded-md p-2 relative">
      <div className="flex gap-2 items-center justify-between ">
        <h4
          className={cn(
            "text-4xl font-bold text-blue-600",
            isNew ? "animate-bounce" : ""
          )}
        >
          {data.index}
        </h4>
        <div className="flex justify-end gap-4 items-center ">
          <p className="text-xs text-black">{`Ưu tiên: ${data.priority}`}</p>
          <p className="text-xs text-black">
            {`Ngày tạo: ${format(data.createdAt, "dd/MM/yy HH:mm")}`}
          </p>
          <p className="text-xs text-black">
            {`Ngày cập nhật: ${format(data.updatedAt, "dd/MM/yy HH:mm")}`}
          </p>
        </div>
      </div>
      <div className="p-2 rounded-md bg-white">
        <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
      </div>
    </div>
  );
};

const DisplayCol = ({ displays }: { displays: DisplayRow[] }) => {
  const { data } = useTV();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const [listData, setListData] = React.useState<DisplayRow[]>([]);

  const firstChildRef = React.useRef<HTMLDivElement | null>(null);
  const [isOverContainer, setOverContainer] = React.useState<boolean>(false);
  const [currentTranslateY, setCurrentTranslateY] = React.useState<number>(0);

  React.useEffect(() => {
    setListData(displays);
  }, [displays]);

  React.useLayoutEffect(() => {
    setCurrentTranslateY(0);
    if (containerRef.current && listRef.current) {
      const containerHeight = containerRef.current.offsetHeight;
      const listHeight = listRef.current.offsetHeight;
      setOverContainer(listHeight > containerHeight);
      if (
        listHeight / containerHeight < 2 &&
        listHeight / containerHeight >= 1
      ) {
        setListData((prev) => [...prev, ...prev]);
      }
    }
  }, [displays, listData]);

  React.useEffect(() => {
    if (!isOverContainer) return;
    const intervalId = setInterval(() => {
      setCurrentTranslateY((prev) => prev - 1);
    }, 1000 / data.speed);
    return () => clearInterval(intervalId);
  }, [isOverContainer, data.speed]);

  React.useEffect(() => {
    if (!firstChildRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const firstChilRect = firstChildRef.current.getBoundingClientRect();

    if (firstChilRect.bottom <= containerRect.top) {
      setListData((prev) => {
        const firstChild = prev[0];
        const newList = prev.filter((_, idx) => idx > 0);
        return [...newList, firstChild];
      });
      setCurrentTranslateY(-1);
    }
  }, [currentTranslateY]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[calc(100vh_-_56px)] overflow-hidden"
    >
      <div
        ref={listRef}
        className="flex flex-col gap-2 py-2"
        style={{ transform: `translate3d(0px, ${currentTranslateY}px, 0px)` }}
      >
        {listData.map((d, idx) => (
          <div
            key={idx}
            ref={(el) => {
              if (idx == 0) {
                firstChildRef.current = el;
              }
            }}
            className={`bg-sky-200 rounded-md shrink-0`}
          >
            <DisplayItem data={d} />
          </div>
        ))}
      </div>
    </div>
  );
};

function splitBigArray<T extends object>(
  bigArray: T[],
  part: number
): (T & { index: number })[][] {
  const ketQua: (T & { index: number })[][] = Array.from(
    { length: part },
    () => []
  );
  for (let index = 0; index < bigArray.length; index++) {
    ketQua[index % part].push({ index: index + 1, ...bigArray[index] });
  }
  return ketQua;
}

type DisplayRow = Display & {
  index: number;
};

const DisplayContainer = () => {
  const { connected, data, socket, setData } = useTV();
  const { toggleSidebar } = useSidebar();

  const [openSettings, setOpenSettings] = React.useState<boolean>(false);

  const [displays, setDisplays] = React.useState<Display[]>([]);
  React.useEffect(() => {
    const handleFetch = async () => {
      setDisplays(
        data.selectedDepartment
          ? await getDisplaysOfDepartment(data.selectedDepartment.id)
          : []
      );
    };
    handleFetch();
  }, [data.selectedDepartment]);

  const displaysColData = React.useMemo(() => {
    return splitBigArray(displays, data.col);
  }, [displays, data.col]);

  const handleCreateDisplay = React.useCallback(
    (newDisplay: Display) => {
      setDisplays(
        sortByFields(
          [newDisplay, ...displays],
          [
            {
              key: "priority",
              order: "desc",
            },
            {
              key: "createdAt",
              order: "desc",
            },
          ]
        )
      );
      if (data.isAudioAllowed) {
        const audio = new Audio(audioPath);
        audio.play();
      }
    },
    [displays, data.isAudioAllowed]
  );

  const handleUpdateDisplay = React.useCallback(
    (newData: Display) => {
      const existsDisplay = displays.find((d) => d.id == newData.id);
      const audio = new Audio(audioPath);

      if (existsDisplay) {
        const inDepartment = newData.departments.find(
          (d) => d.id == data.selectedDepartment?.id
        );

        if (!newData.enable || !inDepartment) {
          setDisplays(
            sortByFields(
              displays.filter((d) => d.id != newData.id),
              [
                {
                  key: "priority",
                  order: "desc",
                },
                {
                  key: "createdAt",
                  order: "desc",
                },
              ]
            )
          );
        } else {
          setDisplays(
            sortByFields(
              displays.map((d) => (d.id == newData.id ? newData : d)),
              [
                {
                  key: "priority",
                  order: "desc",
                },
                {
                  key: "createdAt",
                  order: "desc",
                },
              ]
            )
          );
          if (data.isAudioAllowed) {
            audio.play();
          }
        }
      } else {
        if (newData.enable) {
          setDisplays(
            sortByFields(
              [newData, ...displays],
              [
                {
                  key: "priority",
                  order: "desc",
                },
                {
                  key: "createdAt",
                  order: "desc",
                },
              ]
            )
          );
          if (data.isAudioAllowed) {
            audio.play();
          }
        }
      }
    },
    [displays, data.isAudioAllowed, data.selectedDepartment]
  );

  const handleDeleteDisplay = React.useCallback(
    (displayDeleted: Display) => {
      setDisplays(
        sortByFields(
          displays.filter((d) => d.id != displayDeleted.id),
          [
            {
              key: "priority",
              order: "desc",
            },
            {
              key: "createdAt",
              order: "desc",
            },
          ]
        )
      );
      if (data.isAudioAllowed) {
        const audio = new Audio(audioPath);
        audio.play();
      }
    },
    [displays, data.isAudioAllowed]
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

  return (
    <div className="flex gap-2 relative h-screen overflow-hidden">
      <div className="basis-full">
        <div className="bg-gray-50 p-2 rounded-md">
          <div className="flex items-center gap-2 w-full">
            <button type="button" onClick={toggleSidebar} className="p-2">
              <PanelLeftIcon className="size-6 shrink-0 text-muted-foreground" />
            </button>

            <h4 className="text-lg font-semibold text-black line-clamp-2 w-full">
              {data.selectedDepartment?.name ?? "error"}
            </h4>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Popover open={openSettings} onOpenChange={setOpenSettings}>
                <PopoverTrigger asChild>
                  <button className="text-muted-foreground p-2">
                    <SettingsIcon className="shrink-0 size-6" />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  side="bottom"
                  align="end"
                  className="w-80 relative"
                >
                  <button
                    onClick={() => setOpenSettings(false)}
                    type="button"
                    className="absolute top-3 right-3"
                  >
                    <XIcon className="shrink-0 size-4" />
                  </button>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-bold text-lg">Cài đặt</h4>
                    <div className="flex justify-between gap-1">
                      <p className="text-muted-foreground">
                        Thông báo âm thanh
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setData({ isAudioAllowed: !data.isAudioAllowed })
                        }
                      >
                        {data.isAudioAllowed ? (
                          <p className="text-destructive">tắt tiếng</p>
                        ) : (
                          <p className="text-green-500">bật tiếng</p>
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-muted-foreground">Tốc độ cuộn</p>
                      <ToggleGroup
                        type="single"
                        value={
                          data.speed == 240
                            ? "x4"
                            : data.speed == 120
                            ? "x2"
                            : "x1"
                        }
                        onValueChange={(v) => {
                          setData({
                            speed: v == "x4" ? 240 : v == "x2" ? 120 : 60,
                          });
                        }}
                      >
                        <ToggleGroupItem size="sm" value="x1" aria-label="x1">
                          <p>x1</p>
                        </ToggleGroupItem>
                        <ToggleGroupItem size="sm" value="x2" aria-label="x2">
                          <p>x2</p>
                        </ToggleGroupItem>
                        <ToggleGroupItem size="sm" value="x4" aria-label="x4">
                          <p>x4</p>
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-muted-foreground">Số cột hiển thị</p>
                      <ToggleGroup
                        type="single"
                        value={data.col == 1 ? "1" : data.col == 2 ? "2" : "3"}
                        onValueChange={(v) => {
                          setData({
                            col: v == "1" ? 1 : v == "2" ? 2 : 3,
                          });
                        }}
                      >
                        <ToggleGroupItem size="sm" value="1" aria-label="x1">
                          <p>1</p>
                        </ToggleGroupItem>
                        <ToggleGroupItem size="sm" value="2" aria-label="x2">
                          <p>2</p>
                        </ToggleGroupItem>
                        <ToggleGroupItem size="sm" value="3" aria-label="x4">
                          <p>3</p>
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <div
                className={cn(
                  "size-2 rounded-full shrink-0",
                  connected ? "bg-green-300" : "bg-red-300"
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex w-full gap-2 px-1">
          {displaysColData.map((displays, col) => (
            <DisplayCol key={col} displays={displays} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayContainer;
