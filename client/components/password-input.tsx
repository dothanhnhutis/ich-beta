"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";

const PasswordInput = ({
  className,
  defaultOpen = true,
  open,
  onOpenChange,
  disabled,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [isPassword, setIsPassword] = React.useState<boolean>(() => {
    return open || defaultOpen || false;
  });
  const handleToggleBtn = () => {
    if (open != undefined && typeof onOpenChange == "function") {
      onOpenChange(!open);
    } else {
      setIsPassword(!isPassword);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center py-2 px-3 border rounded-md h-10",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        className
      )}
    >
      <input
        disabled={disabled}
        type={
          (
            open != undefined && typeof onOpenChange == "function"
              ? open
              : isPassword
          )
            ? "password"
            : "text"
        }
        className={cn(
          "bg-transparent w-full outline-0 text-sm",
          disabled ? "opacity-50 cursor-not-allowed" : ""
        )}
        {...props}
      />
      {(
        open != undefined && typeof onOpenChange == "function"
          ? open
          : isPassword
      ) ? (
        <PiEyeClosedBold
          onClick={handleToggleBtn}
          className={cn(
            "flex flex-shrink-0 size-5 cursor-pointer ml-3",
            disabled ? "opacity-50 cursor-not-allowed" : ""
          )}
        />
      ) : (
        <PiEyeBold
          onClick={handleToggleBtn}
          className={cn(
            "flex flex-shrink-0 size-5 cursor-pointer ml-3",
            disabled ? "opacity-50 cursor-not-allowed" : ""
          )}
        />
      )}
    </div>
  );
};

export default PasswordInput;
