import envs from "@/configs/envs";
import { CutomFetch } from "@/lib/custom-fetch";

const departmentInstance = new CutomFetch({
  baseUrl: envs.NEXT_PUBLIC_SERVER_URL + "/api/v1/displays",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
export type CreateDisplay = {
  content: string;
  enable: boolean;
  priority: number;
  departmentIds: string[];
};
export async function createNewDisplay(input: CreateDisplay) {
  try {
    const { data } = await departmentInstance.post<{ message: string }>(
      "",
      input
    );
    return data;
  } catch (error) {
    console.log("createNewDisplay method error:", error);
    throw error;
  }
}
