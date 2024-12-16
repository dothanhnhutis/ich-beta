import envs from "@/configs/envs";
import { CutomFetch } from "@/lib/custom-fetch";
import { User } from "@/schema/user.schema";

const userInstance = new CutomFetch({
  baseUrl: envs.NEXT_PUBLIC_SERVER_URL + "/api/v1/users",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export async function getCurrentUser(options?: Omit<RequestInit, "body">) {
  try {
    const { data } = await userInstance.get<User>("/me", options);
    return data;
  } catch (error: unknown) {
    // console.log("getCurrentUser method error:", error);
    return null;
  }
}

export async function signOut(options?: Omit<RequestInit, "body">) {
  try {
    await userInstance.delete("/signout", options);
  } catch (error: unknown) {
    console.log("signOut method error:", error);
  }
}

export async function reSendVerifyEmail() {
  try {
    await userInstance.get("/verify-email");
  } catch (error) {
    console.log("reSendVerifyEmail method error:", error);
  }
}

export async function changeEmail(email: string) {
  try {
    await userInstance.post("/change-email", { email });
  } catch (error) {
    console.log("changeEmail method error:", error);
  }
}
