"use server";

import { UpdateProfile } from "@/schema/user.schema";
import { FetchApiError } from "@/services/fetch-api";
import {
  changeEmail,
  reSendVerifyEmail,
  updateProfile,
} from "@/services/users.service";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function reSendEmailAction() {
  const cookieStore = await cookies();
  try {
    await reSendVerifyEmail({
      headers: {
        cookie: cookieStore
          .getAll()
          .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
          .join("; "),
      },
    });
  } catch (error: unknown) {
    let msg: string = "unknown";
    if (error instanceof FetchApiError) {
      msg = error.message;
    } else if (error instanceof TypeError) {
      msg = error.message;
    }
    console.log("reSendEmailAction method error: ", msg);
  } finally {
    return "New verification email is successfully sent. Please, check your email...";
  }
}

export async function changeEmailAction(
  prev: { success: boolean | null; message: string },
  formData: FormData
): Promise<{ success: boolean | null; message: string }> {
  const cookieStore = await cookies();
  const email = (formData.get("email") as string) || "";
  try {
    const { data } = await changeEmail(email, {
      headers: {
        cookie: cookieStore
          .getAll()
          .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
          .join("; "),
      },
    });
    revalidatePath("/verify-email");
    return {
      message: data.message,
      success: true,
    };
  } catch (error: unknown) {
    let msg: string = "unknown";
    if (error instanceof FetchApiError) {
      msg = error.message;
    } else if (error instanceof TypeError) {
      msg = error.message;
    }
    console.log("changeEmailAction method error: ", msg);
    return {
      message: msg,
      success: false,
    };
  }
}

export async function completeProfile(info: UpdateProfile) {
  const cookieStore = await cookies();
  try {
    const { data } = await updateProfile(info, {
      headers: {
        cookie: cookieStore
          .getAll()
          .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
          .join("; "),
      },
    });
    revalidatePath("/last-step");
    return {
      message: data.message,
      success: true,
    };
  } catch (error: unknown) {
    let msg: string = "unknown";
    if (error instanceof FetchApiError) {
      msg = error.message;
    } else if (error instanceof TypeError) {
      msg = error.message;
    }
    console.log("changeEmailAction method error: ", msg);
    return {
      message: msg,
      success: false,
    };
  }
}
