"use client";
import { useTV } from "@/components/providers/tv-provider";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Department } from "@/schema/department.schema";
import { PinIcon, PinOffIcon } from "lucide-react";
import React from "react";

const DepartmentItem = ({ department }: { department: Department }) => {
  const { data, setData } = useTV();
  const handlePinDepartment = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (department.id == data.pinDepartmentId) {
      setData({ pinDepartmentId: null });
    } else {
      setData({ pinDepartmentId: department.id });
    }
  };
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={department.id == data.selectedDepartment?.id}
        onClick={() => {
          setData({
            selectedDepartment: department,
          });
        }}
      >
        <div className="flex items-center group/item">
          <p className="w-full">{department.name || ""}</p>
          <button
            type="button"
            onClick={handlePinDepartment}
            className={cn(
              data.pinDepartmentId && department.id == data.pinDepartmentId
                ? ""
                : "group-hover/item:block hidden"
            )}
          >
            {data.pinDepartmentId && department.id == data.pinDepartmentId ? (
              <PinOffIcon className="shrink-0 size-4" />
            ) : (
              <PinIcon className="shrink-0 size-4" />
            )}
          </button>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default DepartmentItem;
