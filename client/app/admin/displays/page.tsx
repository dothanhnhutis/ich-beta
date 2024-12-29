import { filterDisplaysService } from "@/services/display.service";
import { PlusIcon } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";
import DisplayItem from "./display-item";
import { Metadata } from "next";
import { updateDisplayAction } from "./actions";
import DisplayFilter from "./display-filter";
import DisplaySort from "./display-sort";
import DisplayPagination from "./display-pagination";
import { redirect } from "next/navigation";

type DisplayPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: "Hiển thị",
};

const DisplayPage = async (props: DisplayPageProps) => {
  const cookieStore = await cookies();
  const searchParams = await props.searchParams;
  if (Object.keys(searchParams).length == 0) {
    redirect(
      "/admin/displays?enable=true&orderBy=priority.desc&orderBy=updatedAt.desc&limit=10&page=1"
    );
  }
  const {
    data: { displays, pagination },
  } = await filterDisplaysService(searchParams, {
    headers: {
      cookie: cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
        .join("; "),
    },
  });

  return (
    <main className="max-w-screen-xl mx-auto px-2 w-full">
      <div className="flex items-center gap-2 sticky right-0 top-[64px] z-10 bg-white">
        <h3 className="text-3xl font-bold w-full">Hiển Thị</h3>
        <DisplaySort />
        <DisplayFilter />
        <Link
          href={"/admin/displays/create"}
          className="border rounded-md p-1 hover:bg-accent"
        >
          <PlusIcon className="shrink-0 size-5" />
        </Link>
      </div>
      <div className="grid gap-2 mt-2 pb-4">
        {displays.length > 0 ? (
          <>
            {displays.map((d) => (
              <DisplayItem key={d.id} data={d} action={updateDisplayAction} />
            ))}
            <DisplayPagination {...pagination} />
          </>
        ) : (
          <p className="text-lg text-center">Không có dữ liệu</p>
        )}
      </div>
    </main>
  );
};

export default DisplayPage;
