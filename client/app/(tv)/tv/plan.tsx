"use client";
import React from "react";
import TaskFilter from "./task-filter";
import { useplan } from "@/components/providers/plan-provider";
import { useSidebar } from "@/components/ui/sidebar";
import {
  FilterIcon,
  PanelLeftIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react";
import { Plan } from "@/schema/plan.schema";
import Task, { TaskProps } from "./task";
import { useQuery } from "@tanstack/react-query";
import { getTaskOfPlan } from "@/services/plan.service";

// const tasks1: TaskProps[] = [
//   {
//     title:
//       "3 Thùng Khóm Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows:",
//     subTitle:
//       "Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows. Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows. Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows:",
//     dueDate: new Date("2024/11/24").toISOString(),
//     startDate: new Date("2024/11/24").toISOString(),
//     priority: "LOW",
//     progress: "TO_DO",
//     subTasks: [
//       {
//         name: "5 cups chopped Porcini mushrooms",
//         status: "ACCEPTED",
//       },
//       {
//         name: "5 cups chopped Porcini mushrooms",
//         status: "REJECTED",
//       },
//       {
//         name: "5 cups chopped Porcini mushrooms",
//         status: "ASSIGNED",
//       },
//     ],
//     tags: [],
//   },
//   {
//     title:
//       "3 Thùng Khóm Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows:",
//     subTitle:
//       "Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows. Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows. Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows:",
//     dueDate: new Date("2024/11/24").toISOString(),
//     startDate: new Date("2024/11/24").toISOString(),
//     priority: "NORMAL",
//     progress: "COMPLETED",
//     subTasks: [
//       {
//         name: "5 cups chopped Porcini mushrooms",
//         status: "ACCEPTED",
//       },
//       {
//         name: "5 cups chopped Porcini mushrooms",
//         status: "REJECTED",
//       },
//       {
//         name: "5 cups chopped Porcini mushrooms",
//         status: "ASSIGNED",
//       },
//     ],
//     tags: [],
//   },
//   {
//     title:
//       "3 Thùng Khóm Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows:",
//     subTitle:
//       "Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows. Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows. Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows:",
//     dueDate: new Date("2024/11/24").toISOString(),
//     startDate: new Date("2024/11/24").toISOString(),
//     priority: "URGENT",
//     progress: "IN_REVIEW",
//     subTasks: [
//       {
//         name: "5 cups chopped Porcini mushrooms",
//         status: "ACCEPTED",
//       },
//       {
//         name: "5 cups chopped Porcini mushrooms",
//         status: "REJECTED",
//       },
//       {
//         name: "5 cups chopped Porcini mushrooms",
//         status: "ASSIGNED",
//       },
//     ],
//     tags: [],
//   },
//   {
//     title:
//       "3 Thùng Khóm Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows:",
//     subTitle:
//       "Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows. Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows. Specifies the offset length of the shadow. This parameter accepts two, three, or four values. Third and fourth values are optional. They are interpreted as follows:",
//     dueDate: new Date("2024/11/24").toISOString(),
//     startDate: new Date("2024/11/24").toISOString(),
//     priority: "LOW",
//     progress: "ON_PROGRESS",
//     subTasks: [
//       {
//         name: "5 cups chopped Porcini mushrooms",
//         status: "ACCEPTED",
//       },
//       {
//         name: "5 cups chopped Porcini mushrooms",
//         status: "REJECTED",
//       },
//       {
//         name: "5 cups chopped Porcini mushrooms",
//         status: "ASSIGNED",
//       },
//     ],
//     tags: ["Factory", "asdsa"],
//   },
// ];

const PlanContainer = (props: Plan) => {
  const { selected, removePlan } = useplan();
  const { toggleSidebar } = useSidebar();

  const planQuery = useQuery({
    queryKey: ["plan", props.id],
    queryFn: async () => {
      return await getTaskOfPlan(props.id);
    },
  });

  return (
    <div className="flex flex-col relative h-screen overflow-hidden">
      <div className="bg-white p-2 rounded-md">
        <div className="flex items-center gap-2 w-full">
          {selected.map((p) => p.id).indexOf(props.id) == 0 ? (
            <button type="button" onClick={toggleSidebar} className="p-2">
              <PanelLeftIcon className="size-6 shrink-0 text-muted-foreground" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => removePlan(props.id)}
              className="p-2"
            >
              <XIcon className="size-6 shrink-0 text-muted-foreground" />
            </button>
          )}

          <h4 className="text-lg font-semibold text-back line-clamp-2 w-full">
            {props.name}
          </h4>
          <button type="button" className="p-2">
            <FilterIcon className="size-6 shrink-0 text-muted-foreground" />
          </button>
        </div>
        {/* <TaskFilter /> */}
      </div>

      <main className="flex flex-col gap-2 p-1 h-full overflow-y-scroll">
        {planQuery.data && planQuery.data.length > 0 ? (
          planQuery.data.map((task, idx) => (
            <Task
              key={idx}
              title={task.title}
              subTitle={task.subTitle}
              tags={["Factory"]}
              dueDate={task.createdAt}
              startDate={task.createdAt}
              priority={task.priority}
              progress={task.progress}
              subTasks={task.subTasks}
            />
          ))
        ) : (
          <div className="text-center text-xl">Đang chờ lịch sản xuất ...</div>
        )}
      </main>
    </div>
  );
};

export default PlanContainer;
