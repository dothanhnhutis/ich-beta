import { getDepartments } from "@/services/department.service";
import { getDisplayByIdService } from "@/services/display.service";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";
import DisplayForm from "../display-form";
import { updateDisplayAction } from "../actions";

export const metadata: Metadata = {
  title: "Chỉnh sửa hiển thị",
};

const EditDisplayPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const cookieStore = await cookies();
  const cookie = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
    .join("; ");

  const display = await getDisplayByIdService(params.id, {
    headers: {
      cookie,
    },
  });

  const departments = await getDepartments({
    headers: {
      cookie,
    },
  });

  if (!display) return notFound();

  return (
    <div className="mx-auto w-full max-w-screen-md px-4 text">
      <h3 className="text-3xl font-bold">Chỉnh sửa hiển thị</h3>
      <DisplayForm
        departments={departments}
        display={display}
        action={updateDisplayAction}
      />
    </div>
  );
};

export default EditDisplayPage;
