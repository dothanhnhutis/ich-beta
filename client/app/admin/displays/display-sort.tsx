"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SlidersHorizontalIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type SortData = {
  [index: string]: {
    include: boolean;
    sort: "asc" | "desc";
  };
};
const DisplaySort = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState<boolean>(false);

  const [sortData, setSortData] = React.useState<SortData>({
    priority: {
      include: false,
      sort: "asc",
    },
    enable: {
      include: false,
      sort: "asc",
    },
    createdAt: {
      include: false,
      sort: "asc",
    },
    updatedAt: {
      include: false,
      sort: "asc",
    },
  });

  const sort = React.useMemo(() => {
    const newSearchParams = new URLSearchParams();
    const searchParams = new URLSearchParams(
      typeof window != "undefined" ? window.location.search : ""
    );
    const enable = searchParams.get("enable");
    const minPriority = searchParams.get("minPriority");
    const maxPriority = searchParams.get("maxPriority");
    const createdAtFrom = searchParams.get("createdAtFrom");
    const createdAtTo = searchParams.get("createdAtTo");

    if (enable) {
      newSearchParams.append("enable", enable);
    }

    if (minPriority && maxPriority) {
      newSearchParams.append("minPriority", minPriority);
      newSearchParams.append("maxPriority", maxPriority);
    }

    if (createdAtFrom && createdAtTo) {
      newSearchParams.append("createdAtFrom", createdAtFrom);
      newSearchParams.append("createdAtTo", createdAtTo);
    }

    for (const p in sortData) {
      const data = sortData[p as keyof typeof sortData];
      if (!data.include) continue;
      newSearchParams.append("orderBy", p + "." + data.sort);
    }

    if (searchParams.has("limit")) {
      newSearchParams.append("limit", searchParams.get("limit")!);
    }

    if (searchParams.has("page")) {
      newSearchParams.append("page", searchParams.get("page")!);
    }

    return newSearchParams.toString();
  }, [sortData]);

  const handleReset = () => {
    const keys = ["priority", "enable", "createdAt", "updatedAt"];
    const searchParams = new URLSearchParams(
      typeof window != "undefined" ? window.location.search : ""
    );
    const defaultData = searchParams.getAll("orderBy");
    const newData: SortData = {};

    for (const k of keys) {
      const has = defaultData.find((v) => v.startsWith(k));
      if (has) {
        newData[k] = {
          include: true,
          sort: has.split(".")[1] as "asc" | "desc",
        };
      } else {
        newData[k] = {
          include: false,
          sort: "asc",
        };
      }
    }
    setSortData(newData);
  };

  React.useEffect(() => {
    handleReset();
  }, [open]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(pathname + "?" + sort);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className="border rounded-md p-1 hover:bg-accent">
          <SlidersHorizontalIcon className="shrink-0 size-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="min-w-80 p-0">
        <form onSubmit={handleSubmit}>
          <h4 className="font-medium leading-none p-2">Sắp xếp</h4>
          <Separator className="my-2" />
          <div className={cn("grid gap-2 px-2")}>
            <div className="flex justify-between gap-2 items-center">
              <p className="font-medium text-sm">Ưu tiên</p>
              <Switch
                checked={sortData.priority.include}
                onCheckedChange={(v) =>
                  setSortData((prev) => ({
                    ...prev,
                    priority: {
                      ...prev.priority,
                      include: v,
                    },
                  }))
                }
              />
            </div>
            <div
              className={cn(
                "flex gap-2 items-center text-muted-foreground",
                sortData.priority.include ? "" : "opacity-50"
              )}
            >
              <p className="text-sm w-full">Sắp xếp hiển thị theo ưu tiên: </p>
              <div className="flex items-center gap-1">
                <button
                  disabled={!sortData.priority.include}
                  onClick={() =>
                    setSortData((prev) => ({
                      ...prev,
                      priority: {
                        ...prev.priority,
                        sort: "asc",
                      },
                    }))
                  }
                  type="button"
                  className={cn(
                    "px-2 py-1 rounded-md disabled:cursor-not-allowed",
                    sortData.priority.sort == "asc"
                      ? "bg-primary text-white"
                      : "hover:bg-accent"
                  )}
                >
                  <p className="text-sm">ASC</p>
                </button>
                <button
                  disabled={!sortData.priority.include}
                  type="button"
                  className={cn(
                    "px-2 py-1 rounded-md disabled:cursor-not-allowed",
                    sortData.priority.sort == "desc"
                      ? "bg-primary text-white"
                      : "hover:bg-accent"
                  )}
                  onClick={() =>
                    setSortData((prev) => ({
                      ...prev,
                      priority: {
                        ...prev.priority,
                        sort: "desc",
                      },
                    }))
                  }
                >
                  <p className="text-sm">DESC</p>
                </button>
              </div>
            </div>
          </div>
          <Separator className="my-2" />
          <div className={cn("grid gap-2 px-2")}>
            <div className="flex justify-between gap-2 items-center ">
              <p className="font-medium text-sm">Ẩn/ hiện</p>
              <Switch
                checked={sortData.enable.include}
                onCheckedChange={(v) =>
                  setSortData((prev) => ({
                    ...prev,
                    enable: {
                      ...prev.enable,
                      include: v,
                    },
                  }))
                }
              />
            </div>
            <div
              className={cn(
                "flex gap-2 items-center text-muted-foreground",
                sortData.enable.include ? "" : "opacity-50"
              )}
            >
              <p className="text-sm w-full">Sắp xếp hiển thị theo (ẩn/hiện):</p>
              <div className="flex items-center gap-1">
                <button
                  disabled={!sortData.enable.include}
                  onClick={() =>
                    setSortData((prev) => ({
                      ...prev,
                      enable: {
                        ...prev.enable,
                        sort: "asc",
                      },
                    }))
                  }
                  type="button"
                  className={cn(
                    "px-2 py-1 rounded-md disabled:cursor-not-allowed",
                    sortData.enable.sort == "asc"
                      ? "bg-primary text-white"
                      : "hover:bg-accent"
                  )}
                >
                  <p className="text-sm">ASC</p>
                </button>
                <button
                  disabled={!sortData.enable.include}
                  type="button"
                  className={cn(
                    "px-2 py-1 rounded-md disabled:cursor-not-allowed",
                    sortData.enable.sort == "desc"
                      ? "bg-primary text-white"
                      : "hover:bg-accent"
                  )}
                  onClick={() =>
                    setSortData((prev) => ({
                      ...prev,
                      enable: {
                        ...prev.enable,
                        sort: "desc",
                      },
                    }))
                  }
                >
                  <p className="text-sm">DESC</p>
                </button>
              </div>
            </div>
          </div>
          <Separator className="my-2" />
          <div className={cn("grid gap-2 px-2")}>
            <div className="flex justify-between gap-2 items-center ">
              <p className="font-medium text-sm">Ngày tạo</p>
              <Switch
                checked={sortData.createdAt.include}
                onCheckedChange={(v) =>
                  setSortData((prev) => ({
                    ...prev,
                    createdAt: {
                      ...prev.createdAt,
                      include: v,
                    },
                  }))
                }
              />
            </div>
            <div
              className={cn(
                "flex gap-2 items-center text-muted-foreground",
                sortData.createdAt.include ? "" : "opacity-50"
              )}
            >
              <p className="text-sm w-full">Sắp xếp hiển thị theo ngày tạo:</p>
              <div className="flex items-center gap-1">
                <button
                  disabled={!sortData.createdAt.include}
                  onClick={() =>
                    setSortData((prev) => ({
                      ...prev,
                      createdAt: {
                        ...prev.createdAt,
                        sort: "asc",
                      },
                    }))
                  }
                  type="button"
                  className={cn(
                    "px-2 py-1 rounded-md disabled:cursor-not-allowed",
                    sortData.createdAt.sort == "asc"
                      ? "bg-primary text-white"
                      : "hover:bg-accent"
                  )}
                >
                  <p className="text-sm">ASC</p>
                </button>
                <button
                  disabled={!sortData.createdAt.include}
                  type="button"
                  className={cn(
                    "px-2 py-1 rounded-md disabled:cursor-not-allowed",
                    sortData.createdAt.sort == "desc"
                      ? "bg-primary text-white"
                      : "hover:bg-accent"
                  )}
                  onClick={() =>
                    setSortData((prev) => ({
                      ...prev,
                      createdAt: {
                        ...prev.createdAt,
                        sort: "desc",
                      },
                    }))
                  }
                >
                  <p className="text-sm">DESC</p>
                </button>
              </div>
            </div>
          </div>
          <Separator className="my-2" />
          <div className={cn("grid gap-2 px-2")}>
            <div className="flex justify-between gap-2 items-center ">
              <p className="font-medium text-sm">Ngày cập nhật</p>
              <Switch
                checked={sortData.updatedAt.include}
                onCheckedChange={(v) =>
                  setSortData((prev) => ({
                    ...prev,
                    updatedAt: {
                      ...prev.updatedAt,
                      include: v,
                    },
                  }))
                }
              />
            </div>
            <div
              className={cn(
                "flex gap-2 items-center text-muted-foreground",
                sortData.updatedAt.include ? "" : "opacity-50"
              )}
            >
              <p className="text-sm w-full">
                Sắp xếp hiển thị theo ngày cập nhật:
              </p>
              <div className="flex items-center gap-1">
                <button
                  disabled={!sortData.updatedAt.include}
                  onClick={() =>
                    setSortData((prev) => ({
                      ...prev,
                      updatedAt: {
                        ...prev.updatedAt,
                        sort: "asc",
                      },
                    }))
                  }
                  type="button"
                  className={cn(
                    "px-2 py-1 rounded-md disabled:cursor-not-allowed",
                    sortData.updatedAt.sort == "asc"
                      ? "bg-primary text-white"
                      : "hover:bg-accent"
                  )}
                >
                  <p className="text-sm">ASC</p>
                </button>
                <button
                  disabled={!sortData.updatedAt.include}
                  type="button"
                  className={cn(
                    "px-2 py-1 rounded-md disabled:cursor-not-allowed",
                    sortData.updatedAt.sort == "desc"
                      ? "bg-primary text-white"
                      : "hover:bg-accent"
                  )}
                  onClick={() =>
                    setSortData((prev) => ({
                      ...prev,
                      updatedAt: {
                        ...prev.updatedAt,
                        sort: "desc",
                      },
                    }))
                  }
                >
                  <p className="text-sm">DESC</p>
                </button>
              </div>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between gap-2 items-center px-2 pb-4">
            <Button type="button" variant="outline" onClick={handleReset}>
              Đặt lại
            </Button>
            <Button>Áp dụng</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default DisplaySort;
