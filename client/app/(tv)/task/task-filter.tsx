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
  LoaderCircleIcon,
  SlidersHorizontalIcon,
} from "lucide-react";

const TaskFilter = () => {
  return (
    <div className="flex items-center flex-wrap gap-2 ">
      <div className="flex items-center gap-1 text-muted-foreground border rounded-lg px-2 py-1 bg-white">
        <SlidersHorizontalIcon className="shrink-0 size-4 xl:size-5" />
        <p className="text-xs lg:text-sm xl:text-base ">Filter</p>
      </div>

      <div className="flex items-center gap-1 text-muted-foreground border rounded-lg px-2 py-1 bg-white">
        <CalendarDaysIcon className="shrink-0 size-4 xl:size-5" />
        <p className="text-xs lg:text-sm xl:text-base ">
          24/09/24 11:17 - 24/09/24 11:17
        </p>
      </div>
      <div className="flex items-center gap-1 border rounded-lg px-2 py-1 text-red-500 bg-red-50">
        <CircleArrowUpIcon className="shrink-0 size-4 xl:size-5" />
        <p className="text-xs lg:text-sm xl:text-base ">Urgent</p>
      </div>
      <div className="flex items-center gap-1 border rounded-lg px-2 py-1 text-orange-500 bg-orange-50">
        <CircleFadingArrowUpIcon className="shrink-0 size-4 xl:size-5" />
        <p className="text-xs lg:text-sm xl:text-base">High</p>
      </div>
      <div className="flex items-center gap-1 border rounded-lg px-2 py-1 text-cyan-500 bg-cyan-50">
        <CircleMinusIcon className="shrink-0 size-4 xl:size-5" />
        <p className="text-xs lg:text-sm xl:text-base">Normal</p>
      </div>
      <div className="flex items-center gap-1 border rounded-lg px-2 py-1 text-slate-500 bg-slate-100">
        <CircleArrowDownIcon className="shrink-0 size-4 xl:size-5" />
        <p className="text-xs lg:text-sm xl:text-base">Low</p>
      </div>
      <div className="flex items-center gap-1 text-muted-foreground border rounded-lg px-2 py-1 bg-slate-50">
        <CircleIcon className="shrink-0 size-4 xl:size-5 text-gray-500 animate-spin " />
        <p className="text-xs lg:text-sm xl:text-base">To do</p>
      </div>
      <div className="flex items-center gap-1 text-muted-foreground border rounded-lg px-2 py-1 bg-orange-50">
        <LoaderCircleIcon className="shrink-0 size-4 xl:size-5 text-orange-600 animate-spin " />
        <p className="text-xs lg:text-sm xl:text-base">On Progress</p>
      </div>

      <div className="flex items-center gap-1 text-muted-foreground border rounded-lg px-2 py-1 bg-blue-50">
        <CircleHelpIcon className="shrink-0 size-4 xl:size-5 text-blue-500" />
        <p className="text-xs lg:text-sm xl:text-base">In Review</p>
      </div>
      <div className="flex items-center gap-1 text-muted-foreground border rounded-lg px-2 py-1 bg-green-50">
        <CircleCheckIcon className="shrink-0 size-4 xl:size-5 text-green-500" />
        <p className="text-xs lg:text-sm xl:text-base">Done</p>
      </div>
    </div>
  );
};

export default TaskFilter;
