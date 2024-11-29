"use client";
import { Plan } from "@/schema/plan.schema";
import React from "react";

type PlantContext = {
  selected: Plan[];
  addPlan: (plan: Plan) => void;
  removePlan: (planId: string) => void;
};
const PlantContext = React.createContext<PlantContext | null>(null);

export const useplan = () => {
  const context = React.useContext(PlantContext);
  if (!context) {
    throw new Error("useplan must be used within a PlanProvider.");
  }
  return context;
};

type PlanProviderProps = {
  selected?: Plan[];
  max?: number;
  children?: React.ReactNode;
  className?: string;
};
const PlanProvider = ({ selected, children, max = 4 }: PlanProviderProps) => {
  const [planSelected, setPlanSelected] = React.useState<Plan[]>(
    selected ?? []
  );

  const handleAddPlan = (plan: Plan) => {
    if (planSelected.length < max) setPlanSelected((prev) => [...prev, plan]);
  };

  const handleRemovePlan = (planId: string) => {
    if (planSelected.length > 1)
      setPlanSelected((prev) => prev.filter((plan) => plan.id != planId));
  };

  return (
    <PlantContext.Provider
      value={{
        selected: planSelected,
        addPlan: handleAddPlan,
        removePlan: handleRemovePlan,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
};

export default PlanProvider;
