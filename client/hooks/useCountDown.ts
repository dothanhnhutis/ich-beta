// "use client";
// import { useEffect, useState } from "react";
// import { useStore } from "./use-store";
// import { differenceInSeconds, getMilliseconds, isFuture } from "date-fns";
// import React from "react";

// const useCountDown = (
//   storageKey: string,
//   value: string
// ): [number, (seconds: number) => void] => {
//   const [timeAt, setTime] = useState<Date | null>(null);
//   const [storage, setStorage] = useStore(storageKey);

//   useEffect(() => {
//     if (storage) {
//       const data: { [index: string]: string } = JSON.parse(storage);
//       if (data[value] && isFuture(data[value])) {
//         setTime(new Date(data[value]));
//       } else {
//         delete data[value];
//         setStorage(JSON.stringify(data));
//       }
//     }
//   }, [value]);

//   useEffect(() => {
//     const timeOutId = setTimeout(() => {
//       const data: { [index: string]: string } = JSON.parse(storage || "{}");
//       if (isFuture(data[value])) {
//         setTime(new Date());
//       }
//     }, Math.min(1000 - getMilliseconds(new Date()), 1000));

//     return () => clearTimeout(timeOutId);
//   }, [timeAt]);

//   const timeleft = React.useMemo(() => {
//     const data: { [index: string]: string } = JSON.parse(storage || "{}");
//     return differenceInSeconds(data[value] || new Date(), new Date());
//   }, [timeAt]);

//   const handleSetTime = (seconds: number) => {
//     const newDate = new Date(Date.now() + seconds * 1000);
//     setTime(newDate);
//     if (storage) {
//       const data: { [index: string]: string } = JSON.parse(storage);
//       setStorage(JSON.stringify(data && { [value]: newDate }));
//     } else {
//       setStorage(JSON.stringify({ [value]: newDate }));
//     }
//   };

//   return [timeleft, handleSetTime];
// };

// export default useCountDown;

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
  }, [timeAt]);

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
