"use client";
import { useTV } from "@/components/providers/tv-provider";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { PinIcon, PinOffIcon } from "lucide-react";
import React from "react";

const DepartmentItem = ({ id, name }: { id: string; name: string }) => {
  const { selectedId, setSelectedId, pinId, setPinId } = useTV();
  const handlePinDepartment = () => {
    if (id == pinId) {
      setPinId(null);
    } else {
      setPinId(id);
    }
  };
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={selectedId == id}
        onClick={() => {
          setSelectedId(id);
        }}
      >
        <div className="flex items-center group/item">
          <p className="w-full">{name || ""}</p>
          <button
            type="button"
            onClick={handlePinDepartment}
            className={cn(
              pinId && pinId == id ? "" : "group-hover/item:block hidden"
            )}
          >
            {pinId && pinId == id ? (
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
