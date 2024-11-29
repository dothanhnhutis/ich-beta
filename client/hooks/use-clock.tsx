"use client";
import React from "react";
import { format, FormatOptions } from "date-fns";

export const useClock = (formatStr?: string, options?: FormatOptions) => {
  const [time, setTime] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setTime(new Date());

    const intervalId = setInterval(() => {
      setTime(new Date());
    });

    return () => clearInterval(intervalId);
  }, []);

  return time ? format(time, formatStr || "dd/MM/yy HH:mm:ss", options) : null;
};
