import React from "react";
import { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { FilterIcon, PlusIcon, SlidersHorizontalIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Danh sách phòng ban",
};

const DepartmentsPage = () => {
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
                  Cơ sở
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Phòng ban</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="mx-auto w-full max-w-screen-xl py-4 px-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-3xl font-bold w-full">Danh sách phòng ban</h3>
          <button type="button" className="p-1 bg-white rounded-md border">
            <SlidersHorizontalIcon className="shrink-0 size-5" />
          </button>
          <button type="button" className="p-1 bg-white rounded-md border">
            <FilterIcon className="shrink-0 size-5" />
          </button>
          <Link
            href={"/admin/facility/departments/create"}
            className="p-1 bg-white rounded-md border"
          >
            <PlusIcon className="shrink-0 size-5" />
          </Link>
        </div>
        <div className="rounded-md border overflow-hidden mt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-10">ID</TableHead>
                <TableHead className="h-10">Tên phòng ban</TableHead>
                <TableHead className="h-10">Tên địa điểm</TableHead>
                <TableHead className="h-10">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              <TableRow>
                <TableCell className="font-medium">ui-iui</TableCell>
                <TableCell>Phòng 1</TableCell>
                <TableCell>Công ty TNHH MTV TM Sản Xuất I.C.H</TableCell>
                <TableCell>+</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default DepartmentsPage;
