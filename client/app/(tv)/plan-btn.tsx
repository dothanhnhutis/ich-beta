"use client";
import { useDepartment } from "@/components/providers/plan-provider";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Department } from "@/schema/department.schema";
import React from "react";

const PlanBtn = (department: Department) => {
  const { addDepartment, removeDepartment, selected } = useDepartment();
  const handleToggle = () => {
    if (selected.map((p) => p.id).includes(department.id)) {
      removeDepartment(department.id);
    } else {
      addDepartment(department);
    }
  };
  return (
    <SidebarMenuButton
      onClick={handleToggle}
      asChild
      isActive={selected.map((p) => p.id).includes(department.id)}
    >
      <p>{department.name}</p>
    </SidebarMenuButton>
  );
};

export default PlanBtn;
