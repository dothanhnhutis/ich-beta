"use client";
import { useTV } from "@/components/providers/tv-provider";

import { useSidebar } from "@/components/ui/sidebar";
import { audioPath } from "@/configs/constants";
import { cn, sortByFields } from "@/lib/utils";
import { Display } from "@/schema/display.schema";
import { getDisplaysOfDepartment } from "@/services/display.service";
import { format } from "date-fns";
import { PanelLeftIcon, SettingsIcon, VolumeOffIcon } from "lucide-react";
import React from "react";

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

const DisplayRow = ({ data }: { data: DisplayRow }) => {
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

const FPS = 60;
const DisplayCol = ({ displays }: { displays: DisplayRow[] }) => {
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
        console.log("1");
        setListData((prev) => [...prev, ...prev]);
      }
    }
  }, [displays, listData]);

  React.useEffect(() => {
    if (!isOverContainer) return;
    const intervalId = setInterval(() => {
      setCurrentTranslateY((prev) => prev - 1);
    }, 1000 / FPS);
    return () => clearInterval(intervalId);
  }, [isOverContainer]);

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
      className="basis-1/3 h-[calc(100vh_-_56px)] overflow-hidden"
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
            <DisplayRow data={d} />
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

const DisplayWrapper = () => {
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

  const data = React.useMemo(() => {
    return splitBigArray(displays, 3);
  }, [displays]);

  const handleCreateDisplay = React.useCallback(
    (data: Display) => {
      setDisplays(
        sortByFields(
          [data, ...displays],
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
          setDisplays(
            sortByFields(
              displays.filter((d) => d.id != data.id),
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
              displays.map((d) => (d.id == data.id ? data : d)),
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
          if (isAudioAllowed) {
            audio.play();
          }
        }
      } else {
        // const kk = data.departments.find(d => d.id == selectedId)
        if (data.enable) {
          setDisplays(
            sortByFields(
              [data, ...displays],
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
      setDisplays(
        sortByFields(
          displays.filter((d) => d.id != data.id),
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

  return (
    <div className="flex gap-2 relative h-screen overflow-hidden">
      <div className="basis-full">
        <div className="bg-white p-2 rounded-md">
          <div className="flex items-center gap-2 w-full">
            <button type="button" onClick={toggleSidebar} className="p-2">
              <PanelLeftIcon className="size-6 shrink-0 text-muted-foreground" />
            </button>

            <h4 className="text-lg font-semibold text-back line-clamp-2 w-full">
              {departmentName?.name ?? "error"}
            </h4>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!isAudioAllowed && (
                <button
                  onClick={setAccessAudio}
                  type="button"
                  className="rounded-full p-2 shadow-md"
                >
                  <VolumeOffIcon className="shrink-0 size-6 text-muted-foreground" />
                </button>
              )}

              <button className="text-muted-foreground p-2">
                <SettingsIcon className="shrink-0 size-6" />
              </button>

              <div
                className={cn(
                  "size-2 rounded-full shrink-0",
                  connected ? "bg-green-300" : "bg-red-300"
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex w-full gap-2">
          {data.map((displays, col) => (
            <DisplayCol key={col} displays={displays} />
          ))}
          {/* <DisplayCol displays={data[0]} /> */}
        </div>
      </div>
    </div>
  );
};

export default DisplayWrapper;
