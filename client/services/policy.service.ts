import envs from "@/configs/envs";
import { CutomFetch } from "@/lib/custom-fetch";

const policiesInstance = new CutomFetch({
  baseUrl: envs.NEXT_PUBLIC_SERVER_URL + "/api/v1/policies",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export async function getPloliesMe(options?: Omit<RequestInit, "body">) {
  try {
    const { data } = await policiesInstance.get<{ message: string }>(
      "/me",
      options
    );
    return data;
  } catch (error) {
    console.log("getPloliesMe method error:", error);
    throw error;
  }
}
