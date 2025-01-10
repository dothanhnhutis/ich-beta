import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
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
  title: "Danh sách địa điểm",
};
const LocationsPage = () => {
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
                <BreadcrumbPage>Địa điểm</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="mx-auto w-full max-w-screen-xl py-4 px-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-3xl font-bold w-full">Danh sách địa điểm</h3>
          <button type="button" className="p-1 bg-white rounded-md border">
            <SlidersHorizontalIcon className="shrink-0 size-5" />
          </button>
          <button type="button" className="p-1 bg-white rounded-md border">
            <FilterIcon className="shrink-0 size-5" />
          </button>
          <Link
            href={"/admin/facility/locations/create"}
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
                <TableHead className="h-10">Tên địa điểm</TableHead>
                <TableHead className="h-10">Địa chỉ</TableHead>
                <TableHead className="h-10 text-right">Phòng ban</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              <TableRow>
                <TableCell className="font-medium">
                  23123132-1132132-1321113
                </TableCell>
                <TableCell>Công ty TNHH MTV TM Sản Xuất I.C.H</TableCell>
                <TableCell>
                  Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Thành phố Sóc
                  Trăng, Tỉnh Sóc Trăng
                </TableCell>
                <TableCell className="text-right">3</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default LocationsPage;
