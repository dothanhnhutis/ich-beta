import { getDepartments } from "@/services/department.service";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React from "react";
import DisplayForm from "../display-form";
import { createDisplayAction } from "../actions";

export const metadata: Metadata = {
  title: "Tạo hiển thị",
};

const CreateDisplayPage = async () => {
  const cookieStore = await cookies();
  const departments = await getDepartments({
    headers: {
      cookie: cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
        .join("; "),
    },
  });

  return (
    <div className="mx-auto w-full max-w-screen-md px-4">
      <h3 className="text-xl font-bold">Tạo hiển thị</h3>
      <DisplayForm departments={departments} action={createDisplayAction} />
    </div>
  );
};

export default CreateDisplayPage;
