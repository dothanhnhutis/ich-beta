"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import * as z from "zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import DateInput from "@/components/date-input";
import IntInput from "@/components/int-input";

const prioritySchema = (type: "min" | "max") =>
  z
    .string()
    .refine((v) => parseInt(v) >= 0, {
      message: `Ưu tiên (${type}) phải lớn hơn hoặc bằng 0`,
    })
    .refine((v) => parseInt(v) <= 99, {
      message: `Ưu tiên (${type}) phải nhỏ hơn hoặc bằng 99`,
    });

const DisplayFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState<boolean>(false);

  const [createdAt, setCreatedAt] = React.useState(() => {
    const newDate = new Date();
    return {
      include: true,
      value: [format(newDate, "dd/MM/yyyy"), format(newDate, "dd/MM/yyyy")],
    };
  });

  const [enable, setEnable] = React.useState({
    include: true,
    value: "true",
  });

  const [priority, setPriority] = React.useState({
    include: true,
    value: ["0", "99"],
  });

  const priorityMinError = React.useMemo(() => {
    const { success, error } = prioritySchema("min").safeParse(
      priority.value[0]
    );
    return {
      success: success || !priority.include,
      error: success ? "" : error.issues[0].message,
    };
  }, [priority.include, priority.value]);

  const priorityMaxError = React.useMemo(() => {
    const { success, error } = prioritySchema("max").safeParse(
      priority.value[1]
    );
    return {
      success: success || !priority.include,
      error: success ? "" : error.issues[0].message,
    };
  }, [priority.include, priority.value]);

  const filter = React.useMemo(() => {
    const newSearchParams = new URLSearchParams();

    if (enable.include) {
      newSearchParams.append("enable", enable.value);
    }
    if (priority.include) {
      if (priorityMinError.success && priorityMaxError.success) {
        newSearchParams.append("minPriority", priority.value[0]);
        newSearchParams.append("maxPriority", priority.value[1]);
      }
    }
    if (createdAt.include) {
      if (createdAt.value[0] != "" && createdAt.value[1] != "") {
        newSearchParams.append("createdAtFrom", createdAt.value[0]);
        newSearchParams.append("createdAtTo", createdAt.value[1]);
      }
    }
    return newSearchParams.toString();
  }, [createdAt, enable, priority, priorityMaxError, priorityMinError]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newSearchParams = new URLSearchParams(filter);
    if (searchParams.has("orderBy")) {
      for (const orderBy of searchParams.getAll("orderBy")) {
        newSearchParams.append("orderBy", orderBy);
      }
    }

    if (searchParams.has("limit")) {
      newSearchParams.append("limit", searchParams.get("limit")!);
    }

    if (searchParams.has("page")) {
      newSearchParams.append("page", searchParams.get("page")!);
    }

    router.push(pathname + "?" + newSearchParams.toString());
    setOpen(false);
  };

  const handleReset = () => {
    const searchParams = new URLSearchParams(
      typeof window != "undefined" ? window.location.search : ""
    );
    const enable = searchParams.get("enable");
    const minPriority = searchParams.get("minPriority");
    const maxPriority = searchParams.get("maxPriority");
    const createdAtFrom = searchParams.get("createdAtFrom");
    const createdAtTo = searchParams.get("createdAtTo");

    if (enable) {
      setEnable((prev) => ({ ...prev, value: enable, include: true }));
    } else {
      setEnable((prev) => ({ ...prev, include: false }));
    }
    if (minPriority && maxPriority) {
      setPriority(() => ({
        include: true,
        value: [minPriority, maxPriority],
        valuetype: "range",
      }));
    } else {
      setPriority(() => ({
        include: false,
        value: ["0", "99"],
        valuetype: "range",
      }));
    }
    if (createdAtFrom && createdAtTo) {
      setCreatedAt(() => ({
        include: true,
        value: [createdAtFrom, createdAtTo],
      }));
    } else {
      const currentDate = new Date();
      setCreatedAt(() => ({
        include: false,
        value: [
          format(currentDate, "dd/MM/yyyy"),
          format(currentDate, "dd/MM/yyyy"),
        ],
      }));
    }
  };

  const isCreatedAtError = React.useMemo(() => {
    return (
      createdAt.value[0] != "" &&
      createdAt.value[1] != "" &&
      new Date(
        `${createdAt.value[0].split("/")[2]!}-${createdAt.value[0].split(
          "/"
        )[1]!}-${createdAt.value[0].split("/")[0]!}`
      ).getTime() >
        new Date(
          `${createdAt.value[1].split("/")[2]!}-${createdAt.value[1].split(
            "/"
          )[1]!}-${createdAt.value[1].split("/")[0]!}`
        ).getTime()
    );
  }, [createdAt.value]);

  React.useEffect(() => {
    if (open) handleReset();
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className="border rounded-md p-1 hover:bg-accent">
          <FilterIcon className="shrink-0 size-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-80 p-0">
        <form onSubmit={handleSubmit}>
          <h4 className="font-medium leading-none p-2">Bộ lọc</h4>
          <Separator className="my-2" />
          <div className={cn("grid gap-2 px-2")}>
            <div className="flex justify-between gap-2 items-center ">
              <p className="font-medium text-sm">Ngày tạo</p>
              <Switch
                checked={createdAt.include}
                onCheckedChange={(v) =>
                  setCreatedAt((prev) => ({ ...prev, include: v }))
                }
              />
            </div>
            <div
              className={cn(
                "grid gap-2 grid-cols-2",
                createdAt.include ? "" : "opacity-50"
              )}
            >
              <div className="flex flex-col gap-1">
                <p className="text-xs font-normal text-muted-foreground">Từ:</p>
                <DateInput
                  disabled={!createdAt.include}
                  date={createdAt.value[0]}
                  className={cn(
                    createdAt.include && isCreatedAtError
                      ? "border-destructive"
                      : ""
                  )}
                  onDateChange={(e) =>
                    setCreatedAt((prev) => ({
                      ...prev,
                      value: [e, prev.value[1]],
                    }))
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-xs font-normal text-muted-foreground">
                  Đến:
                </p>
                <DateInput
                  disabled={!createdAt.include}
                  className={cn(
                    createdAt.include && isCreatedAtError
                      ? "border-destructive"
                      : ""
                  )}
                  date={createdAt.value[1]}
                  onDateChange={(e) =>
                    setCreatedAt((prev) => ({
                      ...prev,
                      value: [prev.value[0], e],
                    }))
                  }
                />
                {/* <p className="text-destructive text-xs">adas</p> */}
              </div>
              {createdAt.include && isCreatedAtError && (
                <p className="col-span-2 text-destructive text-xs">
                  Ngày tạo (Từ) phải nhỏ hơn hoặc bằng Ngày tạo (Đến)
                </p>
              )}
            </div>
          </div>
          <Separator className="my-2" />
          <div className="grid gap-2 px-2">
            <div className="flex justify-between gap-2 items-center">
              <p className="font-medium text-sm">Hiện / Ẩn</p>
              <Switch
                checked={enable.include}
                onCheckedChange={(v) =>
                  setEnable((prev) => ({ ...prev, include: v }))
                }
              />
            </div>
            <div
              className={cn(
                "flex justify-between gap-2 items-center",
                enable.include ? "" : "opacity-50"
              )}
            >
              <p className="text-xs font-normal text-muted-foreground">
                Chọn những hiện thị đang bật hay đã tắt
              </p>
              <Switch
                disabled={!enable.include}
                checked={enable.value === "true"}
                onCheckedChange={(v) =>
                  setEnable((prev) => ({
                    ...prev,
                    value: v ? "true" : "false",
                  }))
                }
              />
            </div>
          </div>
          <Separator className="my-2" />
          <div className="grid gap-2 px-2">
            <div className="flex justify-between gap-2 items-center">
              <p className="font-medium text-sm">Ưu tiên</p>
              <Switch
                checked={priority.include}
                onCheckedChange={(v) =>
                  setPriority((prev) => ({ ...prev, include: v }))
                }
              />
            </div>
            <div
              className={cn(
                "grid gap-2 grid-cols-2",
                priority.include ? "" : "opacity-50"
              )}
            >
              <div className="flex flex-col gap-1">
                <p className="text-xs font-normal text-muted-foreground">Từ:</p>
                <IntInput
                  disabled={!priority.include}
                  className={cn(
                    "flex w-full border rounded-md h-10 px-3 py-2",
                    priorityMinError.success ? "" : "border-destructive"
                  )}
                  placeholder="Nhập số"
                  value={priority.value[0]}
                  onChange={(v) =>
                    setPriority((prev) => ({
                      ...prev,
                      value: [v, prev.value[1]],
                    }))
                  }
                />
                {!priorityMinError.success && (
                  <p className="text-destructive text-xs">
                    {priorityMinError.error}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-xs font-normal text-muted-foreground">
                  Đến:
                </p>
                <IntInput
                  disabled={!priority.include}
                  className={cn(
                    "flex w-full border rounded-md h-10 px-3 py-2",
                    priorityMaxError.success ? "" : "border-destructive"
                  )}
                  placeholder="Nhập số"
                  value={priority.value[1]}
                  onChange={(v) =>
                    setPriority((prev) => ({
                      ...prev,
                      value: [prev.value[0], v],
                    }))
                  }
                />
                {!priorityMaxError.success && (
                  <p className="text-destructive text-xs">
                    {priorityMaxError.error}
                  </p>
                )}
              </div>
              {priority.include &&
                priorityMinError.success &&
                priorityMaxError.success &&
                parseInt(priority.value[0]) > parseInt(priority.value[1]) && (
                  <p className="col-span-2 text-destructive text-xs">
                    Ưu tiên (Từ) phải nhỏ hơn hoặc bằng Ưu tiên (Đến)
                  </p>
                )}
            </div>
          </div>

          <Separator className="my-2" />
          <div className="flex justify-between gap-2 items-center px-2 pb-4">
            <Button type="button" variant="outline" onClick={handleReset}>
              Đặt lại
            </Button>
            <Button
              disabled={
                (!priorityMinError.success && priority.include) ||
                (!priorityMaxError.success && priority.include) ||
                (priority.value[0] > priority.value[1] && priority.include) ||
                (createdAt.include && isCreatedAtError)
              }
            >
              Áp dụng
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default DisplayFilter;
