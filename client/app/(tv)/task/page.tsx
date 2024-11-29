"use client";
import React from "react";
import {
  ClipboardMinusIcon,
  ClipboardPlusIcon,
  PanelLeftIcon,
  PlusIcon,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import Clock from "./clock";
import Task, { TaskProps } from "./task";
import TaskFilter from "./task-filter";
import { useTask } from "@/components/providers/task-provider";
import { Button } from "@/components/ui/button";

const tasks1: TaskProps[] = [
  {
    title:
      "3 Thùng Khóm Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows:",
    subTitle:
      "Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows. Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows. Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows:",
    dueDate: new Date("2024/11/24").toISOString(),
    startDate: new Date("2024/11/24").toISOString(),
    priority: "LOW",
    progress: "TO_DO",
    subTasks: [
      {
        name: "5 cups chopped Porcini mushrooms",
        status: "ACCEPTED",
      },
      {
        name: "5 cups chopped Porcini mushrooms",
        status: "REJECTED",
      },
      {
        name: "5 cups chopped Porcini mushrooms",
        status: "ASSIGNED",
      },
    ],
    tags: [],
  },
  {
    title:
      "3 Thùng Khóm Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows:",
    subTitle:
      "Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows. Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows. Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows:",
    dueDate: new Date("2024/11/24").toISOString(),
    startDate: new Date("2024/11/24").toISOString(),
    priority: "NORMAL",
    progress: "COMPLETED",
    subTasks: [
      {
        name: "5 cups chopped Porcini mushrooms",
        status: "ACCEPTED",
      },
      {
        name: "5 cups chopped Porcini mushrooms",
        status: "REJECTED",
      },
      {
        name: "5 cups chopped Porcini mushrooms",
        status: "ASSIGNED",
      },
    ],
    tags: [],
  },
  {
    title:
      "3 Thùng Khóm Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows:",
    subTitle:
      "Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows. Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows. Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows:",
    dueDate: new Date("2024/11/24").toISOString(),
    startDate: new Date("2024/11/24").toISOString(),
    priority: "URGENT",
    progress: "IN_REVIEW",
    subTasks: [
      {
        name: "5 cups chopped Porcini mushrooms",
        status: "ACCEPTED",
      },
      {
        name: "5 cups chopped Porcini mushrooms",
        status: "REJECTED",
      },
      {
        name: "5 cups chopped Porcini mushrooms",
        status: "ASSIGNED",
      },
    ],
    tags: [],
  },
  {
    title:
      "3 Thùng Khóm Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows:",
    subTitle:
      "Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows. Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows. Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows:",
    dueDate: new Date("2024/11/24").toISOString(),
    startDate: new Date("2024/11/24").toISOString(),
    priority: "LOW",
    progress: "ON_PROGRESS",
    subTasks: [
      {
        name: "5 cups chopped Porcini mushrooms",
        status: "ACCEPTED",
      },
      {
        name: "5 cups chopped Porcini mushrooms",
        status: "REJECTED",
      },
      {
        name: "5 cups chopped Porcini mushrooms",
        status: "ASSIGNED",
      },
    ],
    tags: ["Factory", "asdsa"],
  },
];

const TaskPage1 = () => {
  const { toggleSidebar } = useSidebar();
  const { connected, tasks } = useTask();
  return (
    <React.Fragment>
      <div className="sticky top-0 right-0 left-0 p-2 bg-white z-50">
        <div className="flex items-center gap-2 lg:gap-20">
          <div className="flex items-center gap-2 w-full">
            <button type="button" onClick={toggleSidebar} className="p-2">
              <PanelLeftIcon className="size-6 shrink-0 text-muted-foreground" />
            </button>
            {/* <Clock /> */}
            <h4 className="text-lg font-semibold text-back line-clamp-2 ">
              [Plan]:Hôm nay sản xuất gì ?
            </h4>
          </div>
        </div>

        <TaskFilter />
      </div>
      <main className="flex flex-col gap-2 p-2">
        {tasks.length > 0 ? (
          tasks.map((task, idx) => <Task key={idx} {...task} />)
        ) : (
          <div className="text-center text-xl">Đang chờ lịch sản xuất ...</div>
        )}
      </main>
    </React.Fragment>
  );
};

const max = 4;
const TaskPage = () => {
  const { toggleSidebar } = useSidebar();
  const { connected, tasks } = useTask();
  const [numberOfPlan, setNumberOfPlan] = React.useState<number>(2);

  const handleAdd = () => {
    if (max > numberOfPlan) setNumberOfPlan(numberOfPlan + 1);
  };
  const handleRemove = () => {
    setNumberOfPlan(numberOfPlan - 1);
  };

  return (
    <div
      className={`grid gap-2 `}
      style={{ gridTemplateColumns: `repeat(${numberOfPlan}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: numberOfPlan }).map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col relative h-screen overflow-hidden"
        >
          <div>
            <div className="flex items-center gap-2 w-full">
              {idx == 0 ? (
                <button type="button" onClick={toggleSidebar} className="p-2">
                  <PanelLeftIcon className="size-6 shrink-0 text-muted-foreground" />
                </button>
              ) : (
                <button type="button" onClick={handleRemove} className="p-2">
                  <ClipboardMinusIcon className="size-6 shrink-0 text-muted-foreground" />
                </button>
              )}

              {/* <Clock /> */}
              <h4 className="text-lg font-semibold text-back line-clamp-2 w-full">
                [Plan]:Hôm nay sản xuất gì ?
              </h4>

              <button
                type="button"
                onClick={handleAdd}
                className="p-2 disabled:bg-green-500"
                disabled={numberOfPlan == max}
              >
                <ClipboardPlusIcon className="size-6 shrink-0 text-muted-foreground " />
              </button>
            </div>
            <TaskFilter />
          </div>

          <div className="h-full overflow-y-scroll">
            <div className="h-[500px] bg-green-100">1</div>
            <div className="h-[500px] bg-blue-100">2</div>
            <div className="h-[500px] bg-red-100">3</div>
            <div className="h-[500px] bg-sky-100">4</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskPage;
