import envs from "@/configs/envs";
import { CutomFetch } from "@/lib/custom-fetch";
import { Plan } from "@/schema/plan.schema";
import { Task } from "@/schema/task.schema";

const planInstance = new CutomFetch({
  baseUrl: envs.NEXT_PUBLIC_SERVER_URL + "/api/v1/plans",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export async function getPlans() {
  try {
    const { data } = await planInstance.get<Plan[]>("");
    return data;
  } catch (error) {
    console.log("getPlans method error:", error);
    return [];
  }
}

export async function getTaskOfPlan(planId: string) {
  try {
    const { data } = await planInstance.get<Task[]>(`/${planId}/tasks`);
    return data;
  } catch (error) {
    console.log("getTaskOfPlan method error:", error);
    return [];
  }
}
