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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import React from "react";
import Image from "next/image";
import { cookies } from "next/headers";
import { getDepartments } from "@/services/department.service";
import PlanProvider from "@/components/providers/plan-provider";
import PlanBtn from "./plan-btn";

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
  return (
    <PlanProvider selected={departments.length > 0 ? [departments[0]] : []}>
      <SidebarProvider defaultOpen={defaultOpen} className="bg-gray-100">
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
              <SidebarGroupLabel>Departments</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {departments.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <PlanBtn {...item} />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center flex-shrink-0 gap-2 bg-white rounded-md p-2">
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
    </PlanProvider>
  );
};

export default TaskLayout;
