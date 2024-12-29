import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import React from "react";
import Image from "next/image";
import { cookies } from "next/headers";
import { getDepartments } from "@/services/department.service";
import { TVProvider } from "@/components/providers/tv-provider";
import DepartmentItem from "./department-item";

const TaskLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  const departments = await getDepartments({
    headers: {
      cookie: cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
        .join("; "),
    },
  });

  const pinDepartmentId = cookieStore.get("deparment:pin")?.value;

  return (
    <TVProvider defaultPinId={pinDepartmentId} departments={departments}>
      <SidebarProvider defaultOpen={defaultOpen} className="bg-gray-100 z-[-2]">
        <Sidebar className="[&>div[data-sidebar='sidebar']]:bg-transparent bg-white">
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="logo.png"
                width="100"
                height="100"
                className="size-14 shrink-0"
              />
              <h3 className="text-lg font-bold text-back">
                Công ty TNHH MTV TM Sản Xuất I.C.H
              </h3>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Phòng ban</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {departments.map((d) => (
                    <DepartmentItem key={d.id} name={d.name} id={d.id} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className=" flex items-center flex-shrink-0 gap-2 bg-white rounded-md p-2">
              <Image
                src="/logo.png"
                alt="logo.png"
                width="100"
                height="100"
                className="size-10 shrink-0 rounded-full border-2 border-white shadow bg-white"
              />
              <div className="text-sm">
                <p className="font-semibold">Thanh Nhut</p>
                <p>gaconght@gmail.com</p>
              </div>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="bg-transparent">{children}</SidebarInset>
      </SidebarProvider>
    </TVProvider>
  );
};

export default TaskLayout;
