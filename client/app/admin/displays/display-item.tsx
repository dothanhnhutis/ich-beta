"use client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { EllipsisIcon } from "lucide-react";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Display } from "@/schema/display.schema";
import { updateDisplayAction } from "./actions";
import { toast } from "sonner";

const DisplayItem = ({
  data,
  action,
}: {
  data: Display;
  action: typeof updateDisplayAction;
}) => {
  const bindAction = action.bind(null, data.id, { enable: !data.enable });

  const [state, formAction, isPending] = React.useActionState<{
    success: boolean | null;
    message: string;
  }>(bindAction, {
    success: null,
    message: "",
  });

  React.useEffect(() => {
    if (state.success != null) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <div
      className={cn(
        "p-2 border bg-white rounded-[10px] relative",
        isPending ? "animate-pulse" : ""
      )}
    >
      <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isPending}>
          <button className="absolute top-1 right-1 p-2">
            <EllipsisIcon className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-20">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={"/admin/displays/" + data.id}>Chỉnh sửa</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <form action={formAction} className="!p-0">
                <button className="w-full text-start p-1.5">
                  {data.enable ? "Ẩn" : "Hiện"}
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex flex-wrap justify-between gap-4 items-center mt-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {`${data.departments.map((d) => d.name).join(", ")}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {!data.enable ? "Ẩn" : "Hiện"}
          </p>
          <p className="text-sm text-muted-foreground">
            {`Ưu tiên: ${data.priority}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {`Ngày tạo: ${format(data.createdAt, "dd/MM/yy HH:mm")}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {`Cập nhật cuối: ${format(data.updatedAt, "dd/MM/yy HH:mm")}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisplayItem;
