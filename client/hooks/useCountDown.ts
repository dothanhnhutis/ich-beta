"use client";
import React from "react";
import { useStore } from "./use-store";
import { differenceInSeconds, getMilliseconds, isFuture } from "date-fns";

const useCountDown = (
  storageKey: string,
  value: string
): [number, (seconds: number) => void] => {
  const [timeAt, setTime] = React.useState<Date | null>(null);
  const [storage, setStorage] = useStore(storageKey);

  React.useEffect(() => {
    const data: { [index: string]: string | undefined } = JSON.parse(
      storage || "{}"
    );
    const time = data[value];
    if (time && isFuture(new Date(time))) {
      setTime(new Date(time));
    }
  }, [value, storage]);

  React.useEffect(() => {
    const updateTimer = () => {
      const data: { [index: string]: string | undefined } = JSON.parse(
        storage || `{}`
      );
      const time = data[value];
      if (time && isFuture(new Date(time))) {
        setTime(new Date());
      } else {
        setTime(null);
      }
    };
    const timeOutId = setTimeout(
      updateTimer,
      Math.max(1000 - getMilliseconds(new Date()), 1000)
    );
    return () => clearTimeout(timeOutId);
  }, [storage, timeAt, value]);

  const timeLeft = React.useMemo(() => {
    if (!timeAt) return 0;
    const data = JSON.parse(storage || `{}`) as Record<string, string>;
    const time = data[value];
    if (!time || !isFuture(new Date(time))) return 0;

    return Math.max(0, differenceInSeconds(new Date(data[value]), new Date()));
  }, [timeAt]);

  const handleSetTime = (seconds: number) => {
    const newTime = new Date(Date.now() + seconds * 1000);
    setTime(newTime);
    const data = storage ? JSON.parse(storage) : {};
    data[value] = newTime.toISOString();
    setStorage(JSON.stringify(data));
  };

  return [timeLeft, handleSetTime];
};

export default useCountDown;
