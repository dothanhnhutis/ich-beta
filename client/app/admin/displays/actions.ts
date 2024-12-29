"use server";
import { UpdateDisplay } from "@/schema/display.schema";
import {
  createdDisplayService,
  updateDisplayService,
} from "@/services/display.service";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const updateDisplayAction = async (
  displayId: string,
  jsonData: Partial<UpdateDisplay>
) => {
  const cookieStore = await cookies();
  try {
    await updateDisplayService(displayId, jsonData, {
      headers: {
        cookie: cookieStore
          .getAll()
          .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
          .join("; "),
      },
    });
    revalidatePath("/admin/displays");
    revalidatePath("/admin/displays/" + displayId);
    return { success: true, message: "Cập nhật hiển thị thành công" };
  } catch (error: unknown) {
    console.log(error);
    return { success: false, message: "Cập nhật hiển thị thất bại" };
  }
};

export const createDisplayAction = async (jsonData: UpdateDisplay) => {
  const cookieStore = await cookies();

  try {
    await createdDisplayService(jsonData, {
      headers: {
        cookie: cookieStore
          .getAll()
          .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
          .join("; "),
      },
    });
    revalidatePath("/admin/displays");
    return { success: true, message: "Tạo hiển thị thành công" };
  } catch (error: unknown) {
    console.log(error);
    return { success: false, message: "Tạo hiển thị thất bại" };
  }
};
