"use client";
import React from "react";
import { cn } from "@/lib/utils";
import TaskHeader from "./task-header";
import TaskFooter from "./task-footer";
import SubTasks, { SubTasksProps } from "./subtask";

export type TaskProps = {
  title: string;
  subTitle: string;
  startDate: string;
  dueDate: string;
  priority: "LOW" | "NORMAL" | "URGENT";
  progress: "TO_DO" | "ON_PROGRESS" | "IN_REVIEW" | "COMPLETED";
  subTasks: SubTasksProps["subtasks"];
  tags: string[];
};

const Task = ({
  title,
  subTitle,
  priority,
  subTasks,
  startDate,
  dueDate,
  progress,
  tags,
}: TaskProps) => {
  return (
    <div
      className={cn(
        "border rounded-lg p-2 bg-gradient-to-b space-y-1  bg-white"
      )}
    >
      <TaskHeader title={title} subTitle={subTitle} />
      <SubTasks subtasks={subTasks} />

      <TaskFooter
        numberSubTask={subTasks.length}
        subTaskDone={subTasks.filter((s) => s.status == "ACCEPTED").length}
        dueDate={new Date(dueDate)}
        startDate={new Date(startDate)}
        progress={progress}
        priority={priority}
        tags={tags}
      />
    </div>
  );
};

export default Task;
