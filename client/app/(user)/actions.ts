"use server";
import { deleteSessionByIdService } from "@/services/users.service";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const deleteSessionByIdAction = async (displayId: string) => {
  const cookieStore = await cookies();
  try {
    await deleteSessionByIdService(displayId, {
      headers: {
        cookie: cookieStore
          .getAll()
          .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
          .join("; "),
      },
    });
    revalidatePath("/sessions");
    return { success: true, message: "Xoá phiên đăng nhập thành công" };
  } catch (error: unknown) {
    console.log("deleteSessionByIdAction method error: ", error);
    return { success: false, message: "Xoá phiên đăng nhập thất bại" };
  }
};
