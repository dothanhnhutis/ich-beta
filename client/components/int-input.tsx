"use client";
import { cn } from "@/lib/utils";

const IntInput = ({
  value,
  onChange,
  className,
  ...props
}: {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}) => {
  return (
    <input
      {...props}
      className={cn(
        "focus-visible:outline-none disabled:cursor-not-allowed",
        className
      )}
      value={value || ""}
      onChange={(e) => {
        const regex = /^-?\d*$/;
        let value = e.target.value;

        if (!regex.test(value)) return;

        if (value == "-0") {
          value = "0";
        }
        if (value.length > 1 && value[0] === "0") {
          value = value.slice(1);
        }

        if (onChange) {
          onChange(value);
        }
      }}
    />
  );
};

export default IntInput;
