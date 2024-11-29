"use client";
import { useplan } from "@/components/providers/plan-provider";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Plan } from "@/schema/plan.schema";
import React from "react";

const PlanBtn = (plan: Plan) => {
  const { addPlan, removePlan, selected } = useplan();
  const handleToggle = () => {
    if (selected.map((p) => p.id).includes(plan.id)) {
      removePlan(plan.id);
    } else {
      addPlan(plan);
    }
  };
  return (
    <SidebarMenuButton
      onClick={handleToggle}
      asChild
      isActive={selected.map((p) => p.id).includes(plan.id)}
    >
      <p>{plan.name}</p>
    </SidebarMenuButton>
  );
};

export default PlanBtn;
