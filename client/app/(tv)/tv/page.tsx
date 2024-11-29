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
import { useplan } from "@/components/providers/plan-provider";
import Plan from "./plan";
import TaskProvider from "@/components/providers/task-provider";

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

// const TaskPage1 = () => {
//   const { toggleSidebar } = useSidebar();
//   return (
//     <React.Fragment>
//       <div className="sticky top-0 right-0 left-0 p-2 bg-white z-50">
//         <div className="flex items-center gap-2 lg:gap-20">
//           <div className="flex items-center gap-2 w-full">
//             <button type="button" onClick={toggleSidebar} className="p-2">
//               <PanelLeftIcon className="size-6 shrink-0 text-muted-foreground" />
//             </button>
//             {/* <Clock /> */}
//             <h4 className="text-lg font-semibold text-back line-clamp-2 ">
//               [Plan]:Hôm nay sản xuất gì ?
//             </h4>
//           </div>
//         </div>

//         <TaskFilter />
//       </div>
//       <main className="flex flex-col gap-2 p-2">
//         {tasks.length > 0 ? (
//           tasks.map((task, idx) => <Task key={idx} {...task} />)
//         ) : (
//           <div className="text-center text-xl">Đang chờ lịch sản xuất ...</div>
//         )}
//       </main>
//     </React.Fragment>
//   );
// };

const TaskPage = () => {
  const { selected } = useplan();

  return (
    <div
      className={`grid gap-2 `}
      style={{
        gridTemplateColumns: `repeat(${selected.length}, minmax(0, 1fr))`,
      }}
    >
      {selected.map((plan) => (
        <TaskProvider key={plan.id}>
          <Plan {...plan} />
        </TaskProvider>
      ))}
    </div>
  );
};

export default TaskPage;
