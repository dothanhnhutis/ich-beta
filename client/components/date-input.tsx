"use client";
import { cn } from "@/lib/utils";
import React from "react";
type DateInputProps = {
  date?: string;
  onDateChange?: (date: string) => void;
  disabled?: boolean;
  className?: string;
};

const DateInput = ({
  date,
  onDateChange,
  disabled,
  className,
}: DateInputProps) => {
  const [day, setDay] = React.useState<string>("");
  const [month, setMonth] = React.useState<string>("");
  const [year, setYear] = React.useState<string>("");

  const dayRef = React.useRef<HTMLInputElement>(null);
  const monthRef = React.useRef<HTMLInputElement>(null);
  const yearRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const fullDateRegex =
      /^(0[1-9]|[1-2][0-9]|[3][0-1])\/(0[1-9]|1[0-2])\/(\d{4})$/;
    if (date && fullDateRegex.test(date)) {
      const [day, month, year] = date.split("/");
      setDay(day);
      setMonth(month);
      setYear(year);
    }
  }, [date]);

  const handleSetOnChange = (day: string, month: string, year: string) => {
    if (
      onDateChange &&
      day.length == 2 &&
      month.length == 2 &&
      year.length == 4
    ) {
      onDateChange(`${day}/${month}/${year}`);
    }
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const dayRegex = /^([0-3]?|0[1-9]|[1-2][0-9]|[3][0-1])$/;
    if (dayRegex.test(value)) {
      if (value.length === 2) {
        monthRef.current?.focus();
        if (month.length === 2) {
          setMonth("");
          handleSetOnChange(value, "", year);
        } else {
          handleSetOnChange(value, month, year);
        }
      }
      setDay(value);
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const monthRegex = /^([01]?|0[1-9]|1[0-2])$/;
    if (monthRegex.test(value)) {
      if (value.length === 2) {
        yearRef.current?.focus();
        if (year.length === 4) {
          setYear("");
          handleSetOnChange(day, value, "");
        } else {
          handleSetOnChange(day, value, year);
        }
      }
      setMonth(value);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const yearRegex = /^\d{0,4}$/;
    if (yearRegex.test(value)) {
      if (value.length === 4) {
        yearRef.current?.blur();
        handleSetOnChange(day, month, value);
      }
      setYear(value);
    }
  };

  return (
    <div
      className={cn(
        "flex gap-1 px-3 py-2 items-center border border-gray-300 rounded-md p-1 align-middle text-center h-10",
        disabled ? "cursor-not-allowed" : "",
        className
      )}
    >
      <input
        disabled={disabled}
        onClick={() => {
          setDay("");
          if (onDateChange) onDateChange("");
        }}
        ref={dayRef}
        type="text"
        className="w-5 outline-none placeholder:text-sm disabled:cursor-not-allowed"
        placeholder="DD"
        value={day}
        onChange={handleDayChange}
      />
      <span>/</span>
      <input
        disabled={disabled}
        onClick={() => {
          if (day == "" && month == "" && year == "") {
            dayRef.current?.focus();
          } else {
            setMonth("");
            if (onDateChange) onDateChange("");
          }
        }}
        ref={monthRef}
        type="text"
        className=" w-6 outline-none placeholder:text-sm disabled:cursor-not-allowed"
        placeholder="MM"
        value={month}
        onChange={handleMonthChange}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && e.currentTarget.value.length === 0) {
            dayRef.current?.focus();
          }
        }}
      />
      <span>/</span>
      <input
        disabled={disabled}
        onClick={() => {
          if (day == "" && month == "" && year == "") {
            dayRef.current?.focus();
          } else {
            setYear("");
            if (onDateChange) onDateChange("");
          }
        }}
        ref={yearRef}
        type="text"
        className="w-full outline-none placeholder:text-sm disabled:cursor-not-allowed"
        value={year}
        placeholder="YYYY"
        onChange={handleYearChange}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && e.currentTarget.value.length === 0) {
            monthRef.current?.focus();
          }
        }}
      />
    </div>
  );
};

export default DateInput;
