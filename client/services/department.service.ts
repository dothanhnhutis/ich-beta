import envs from "@/configs/envs";
import { CutomFetch } from "@/lib/custom-fetch";
import { Department } from "@/schema/department.schema";

const departmentInstance = new CutomFetch({
  baseUrl: envs.NEXT_PUBLIC_SERVER_URL + "/api/v1/departments",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export async function getDepartments(options?: Omit<RequestInit, "body">) {
  try {
    const { data } = await departmentInstance.get<Department[]>("", options);
    return data;
  } catch (error) {
    console.log("getDepartments method error:", error);
    return [];
  }
}

export type Display = {
  id: string;
  userId: string;
  content: string;
  priority: number;
  enable: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getDisplaysOfDepartment(departmentId: string) {
  try {
    const { data } = await departmentInstance.get<Display[]>(
      `/${departmentId}/displays`
    );
    return data;
  } catch (error) {
    console.log("getTaskOfPlan method error:", error);
    return [];
  }
}
