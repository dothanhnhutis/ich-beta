"use client";
import React from "react";
import { CircleAlertIcon, CircleCheckBigIcon, CircleIcon } from "lucide-react";
import { SubTask } from "@/schema/task.schema";

export type SubTasksProps = {
  subtasks: SubTask[];
};

const SubTasks = ({ subtasks }: SubTasksProps) => {
  if (subtasks.length == 0) return;

  return (
    <ul className=" text-sm lg:text-base xl:text-lg 2xl:text-xl 2xl:font-semibold">
      {subtasks.map((subTask, idx) => {
        if (subTask.status == "ACCEPTED")
          return (
            <li key={idx}>
              <p className="flex items-center gap-1 text-blue-500">
                <CircleCheckBigIcon className="size-5 shrink-0" />
                <span>{subTask.title}</span>
              </p>
            </li>
          );
        if (subTask.status == "REJECTED")
          return (
            <li key={idx}>
              <p className="flex items-center gap-1 text-amber-500">
                <CircleAlertIcon className="size-5 shrink-0 " />
                <span>{subTask.title}</span>
              </p>
            </li>
          );

        return (
          <li key={idx}>
            <p className="flex items-center gap-1 text-gray-700">
              <CircleIcon className="size-5 shrink-0" />
              <span>{subTask.title}</span>
            </p>
          </li>
        );
      })}
    </ul>
  );
};

export default SubTasks;
