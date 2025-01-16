import React from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { filterDisplaysService } from "@/services/display.service";
import { cookies } from "next/headers";
import DisplayItem from "./display-item";
import { Metadata } from "next";
import { updateDisplayAction } from "./actions";
import DisplayFilter from "./display-filter";
import DisplaySort from "./display-sort";
import DisplayPagination from "./display-pagination";
import { redirect } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type DisplayPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: "Danh sách hiển thị",
};

const DisplayPage = async (props: DisplayPageProps) => {
  const cookieStore = await cookies();
  const searchParams = await props.searchParams;
  if (Object.keys(searchParams).length == 0) {
    redirect(
      "/admin/tv?enable=true&orderBy=priority.desc&orderBy=updatedAt.desc&limit=10&page=1"
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
    <>
      <header className="sticky top-0 z-[5] bg-white flex shrink-0 items-center py-2 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 size-8 [&_svg]:size-5" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block ">
                <BreadcrumbPage className="text-muted-foreground">
                  Tivi
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Hiển thị</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-2 w-full py-4">
        <div className="flex items-center gap-2 ">
          <h3 className="text-3xl font-bold w-full">Danh sách hiển Thị</h3>
          <DisplaySort />
          <DisplayFilter />
          <Link
            href={"/admin/tv/create"}
            className="p-1 bg-white rounded-md border"
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
    </>
  );
};

export default DisplayPage;
