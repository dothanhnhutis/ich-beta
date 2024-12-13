"use client";
import { Department } from "@/schema/department.schema";
import React from "react";

type DepartmentContext = {
  selected: Department[];
  addDepartment: (department: Department) => void;
  removeDepartment: (departmentId: string) => void;
};
const DepartmentContext = React.createContext<DepartmentContext | null>(null);

export const useDepartment = () => {
  const context = React.useContext(DepartmentContext);
  if (!context) {
    throw new Error("useDepartment must be used within a DepartmentProvider.");
  }
  return context;
};

type DepartmentProviderProps = {
  selected?: Department[];
  max?: number;
  children?: React.ReactNode;
  className?: string;
};
const DepartmentProvider = ({
  selected,
  children,
  max = 4,
}: DepartmentProviderProps) => {
  const [departmentSelected, setDepartmentSelected] = React.useState<
    Department[]
  >(selected ?? []);

  const handleAddDepartment = (department: Department) => {
    if (departmentSelected.length < max)
      setDepartmentSelected((prev) => [...prev, department]);
  };

  const handleRemoveDepartment = (planId: string) => {
    if (departmentSelected.length > 1)
      setDepartmentSelected((prev) => prev.filter((plan) => plan.id != planId));
  };

  return (
    <DepartmentContext.Provider
      value={{
        selected: departmentSelected,
        addDepartment: handleAddDepartment,
        removeDepartment: handleRemoveDepartment,
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
};

export default DepartmentProvider;
