import envs from "@/configs/envs";
import { FetchApi } from "./fetch-api";
import { Role, UpdateProfile, User, UserSession } from "@/schema/user.schema";

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
    const { data } = await userInstance.get<{
      status: number;
      success: boolean;
      message: string;
      data: User & {
        roles: Role[];
        session: {
          id: string;
        };
      };
    }>("/me", options);
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

export async function reSendVerifyEmail(options?: Omit<RequestInit, "body">) {
  return await userInstance.get<{ message: string }>("/verify-email", options);
}

export async function changeEmail(
  email: string,
  options?: Omit<RequestInit, "body">
) {
  return await userInstance.patch<{ message: string }>(
    "/replace-email",
    { email },
    options
  );
}

export async function updateProfile(
  input: UpdateProfile,
  options?: Omit<RequestInit, "body">
) {
  return await userInstance.put<{ message: string }>("", input, options);
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
