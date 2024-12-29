import envs from "@/configs/envs";
import { FetchApi } from "./fetch-api";
import { UpdateProfile, User, UserSession } from "@/schema/user.schema";

const userInstance = new FetchApi({
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
  } catch (error) {
    console.log("getCurrentUser method error:", error);
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
    await userInstance.patch("/replace-email", { email });
  } catch (error) {
    console.log("changeEmail method error:", error);
  }
}

export async function updateProfile(input: UpdateProfile) {
  try {
    await userInstance.put("", input);
  } catch (error) {
    console.log("updateProfile method error:", error);
  }
}

export async function getSessionsService(options?: Omit<RequestInit, "body">) {
  try {
    const { data } = await userInstance.get<UserSession[]>(
      "/sessions",
      options
    );
    return data;
  } catch (error) {
    console.log("getSessionsService method error:", error);
    return [];
  }
}

export async function getCurrentSessionService(
  options?: Omit<RequestInit, "body">
) {
  try {
    const { data } = await userInstance.get<UserSession>(
      "/sessions/me",
      options
    );
    return data;
  } catch (error) {
    console.log("getCurrentSessionService method error:", error);
    return null;
  }
}

export async function deleteSessionByIdService(
  sessionId: string,
  options?: Omit<RequestInit, "body">
) {
  return await userInstance.delete("/sessions/" + sessionId, options);
}
