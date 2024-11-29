"use client";
import { useSidebar } from "@/components/ui/sidebar";
import { useClock } from "@/hooks/use-clock";
import { AlarmClockIcon } from "lucide-react";
import React from "react";

const Clock = () => {
  const time = useClock();
  const { toggleSidebar } = useSidebar();
  return (
    <div className="flex gap-2 items-center flex-shrink-0">
      <AlarmClockIcon className="shrink-0 size-8" onClick={toggleSidebar} />
      <p>{time}</p>
    </div>
  );
};

export default Clock;
