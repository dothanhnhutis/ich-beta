"use client";
import React from "react";
import {
  CalendarDaysIcon,
  CircleArrowDownIcon,
  CircleArrowUpIcon,
  CircleCheckIcon,
  CircleFadingArrowUpIcon,
  CircleHelpIcon,
  CircleIcon,
  CircleMinusIcon,
  ListChecksIcon,
  ListIcon,
  ListTodoIcon,
  LoaderCircleIcon,
  TagsIcon,
} from "lucide-react";
import { format } from "date-fns";

type TaskFooterProps = {
  numberSubTask: number;
  subTaskDone: number;
  startDate: Date;
  dueDate: Date;
  progress: "TO_DO" | "ON_PROGRESS" | "IN_REVIEW" | "COMPLETED";
  priority: "URGENT" | "NORMAL" | "LOW";
  tags: string[];
};

const TaskFooter = ({
  numberSubTask,
  subTaskDone,
  dueDate,
  startDate,
  priority,
  progress,
  tags,
}: TaskFooterProps) => {
  return (
    <div className="flex items-center gap-x-10 flex-wrap">
      {numberSubTask > 0 &&
        (subTaskDone == 0 ? (
          <div className="flex items-center gap-1 text-muted-foreground">
            <ListIcon className="shrink-0 size-4 lg:size-5 xl:size-6" />
            <p className="text-xs lg:text-sm xl:text-base">
              {subTaskDone}/{numberSubTask}
            </p>
          </div>
        ) : subTaskDone == numberSubTask ? (
          <div className="flex items-center gap-1 text-green-500">
            <ListChecksIcon className="shrink-0 size-4 lg:size-5 xl:size-6" />
            <p className="text-xs lg:text-sm xl:text-base">
              {subTaskDone}/{numberSubTask}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-muted-foreground">
            <ListTodoIcon className="shrink-0 size-4 lg:size-5 xl:size-6" />
            <p className="text-xs lg:text-sm xl:text-base">
              {subTaskDone}/{numberSubTask}
            </p>
          </div>
        ))}

      <div className="flex items-center gap-1 text-muted-foreground">
        <CalendarDaysIcon className="shrink-0 size-4 xl:size-5" />
        <p className="text-xs lg:text-sm xl:text-base text-muted-foreground">
          {`${format(startDate, "dd/MM/yy HH:mm")} - ${format(
            dueDate,
            "dd/MM/yy HH:mm"
          )}`}
        </p>
      </div>

      {progress == "TO_DO" ? (
        <div className="flex items-center gap-1 text-muted-foreground">
          <CircleIcon className="shrink-0 size-4 xl:size-5" />
          <p className="text-xs lg:text-sm xl:text-base">To do</p>
        </div>
      ) : progress == "ON_PROGRESS" ? (
        <div className="flex items-center gap-1 text-muted-foreground">
          <LoaderCircleIcon className="shrink-0 size-4 xl:size-5 text-orange-600 animate-spin" />
          <p className="text-xs lg:text-sm xl:text-base">On Progress</p>
        </div>
      ) : progress == "IN_REVIEW" ? (
        <div className="flex items-center gap-1 text-muted-foreground">
          <CircleHelpIcon className="shrink-0 size-4 xl:size-5 text-blue-600" />
          <p className="text-xs lg:text-sm xl:text-base">In Review</p>
        </div>
      ) : (
        <div className="flex items-center gap-1 text-muted-foreground">
          <CircleCheckIcon className="shrink-0 size-4 xl:size-5 text-green-600" />
          <p className="text-xs lg:text-sm xl:text-base">Done</p>
        </div>
      )}

      {priority == "URGENT" ? (
        <div className="flex items-center gap-1 text-muted-foreground">
          <CircleArrowUpIcon className="shrink-0 size-4 xl:size-5 text-red-500" />
          <p className="text-xs lg:text-sm xl:text-base">Urgent</p>
        </div>
      ) : priority == "NORMAL" ? (
        <div className="flex items-center gap-1 text-muted-foreground">
          <CircleMinusIcon className="shrink-0 size-4 xl:size-5 text-cyan-500" />
          <p className="text-xs lg:text-sm xl:text-base">Normal</p>
        </div>
      ) : (
        <div className="flex items-center gap-1 text-muted-foreground">
          <CircleArrowDownIcon className="shrink-0 size-4 xl:size-5 text-slate-500" />
          <p className="text-xs lg:text-sm xl:text-base">Low</p>
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex items-center gap-1 text-muted-foreground">
          <TagsIcon className="shrink-0 size-4 xl:size-5 " />
          <p className="text-xs lg:text-sm xl:text-base">{tags.join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default TaskFooter;
