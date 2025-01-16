import { getDepartments } from "@/services/department.service";
import { getDisplayByIdService } from "@/services/display.service";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";
import DisplayForm from "../display-form";
import { updateDisplayAction } from "../actions";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

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
    <>
      <header className="sticky top-0 z-[5] bg-white flex shrink-0 items-center py-2 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 size-8 [&_svg]:size-5" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage>Tivi</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="text-black hidden md:block">
                  <Link href="/admin/tv/displays">Hiển thị</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Chỉnh sửa hiển thị</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="mx-auto w-full max-w-screen-lg py-4 px-2">
        <h3 className="text-lg sm:text-3xl font-bold">Chỉnh sửa hiển thị</h3>
        <DisplayForm
          departments={departments}
          display={display}
          action={updateDisplayAction}
        />
      </div>
    </>
  );
};

export default EditDisplayPage;
