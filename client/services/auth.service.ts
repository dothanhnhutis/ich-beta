import envs from "@/configs/envs";
import { FetchApi } from "./fetch-api";
import { SignIn, SignInMFA } from "@/schema/auth.schema";

const authInstance = new FetchApi({
  baseUrl: envs.NEXT_PUBLIC_SERVER_URL + "/api/v1/auth",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export async function checkToken(token: string) {
  try {
    await authInstance.get("/check-token?token=" + token);
    return true;
  } catch (error) {
    console.log("checkToken method error:", error);
    return false;
  }
}

export async function confirmEmail(token: string) {
  try {
    await authInstance.get("/confirm-email?token=" + token);
    return true;
  } catch (error) {
    console.log("confirmEmail method error:", error);
    return false;
  }
}

export async function signIn(input: SignIn) {
  const { data } = await authInstance.post<{
    message: string;
    session?: { sessionId: string; expires: string };
  }>("/signin", input);
  return data;
}

export async function signInWithMFA(input: SignInMFA) {
  try {
    const { data } = await authInstance.post<{ message: string }>(
      "/signin/mfa",
      input
    );
    return data;
  } catch (error) {
    console.log("signIn method error:", error);
    throw error;
  }
}
