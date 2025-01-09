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
import { TVProvider, TVSettings } from "@/components/providers/tv-provider";
import DepartmentItem from "./department-item";
import { DISPLAY_SETTING } from "@/configs/constants";
import UserFooter from "./user-footer";

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

  const tvSettingsCookie = cookieStore.get(DISPLAY_SETTING);

  const tvSettings = tvSettingsCookie
    ? (JSON.parse(tvSettingsCookie.value) as TVSettings)
    : undefined;

  return (
    <TVProvider
      defaultSettings={{
        col: tvSettings?.col || 3,
        isAudioAllowed: false,
        pinDepartmentId: tvSettings?.pinDepartmentId || null,
        speed: tvSettings?.speed || 60,
        selectedDepartment:
          departments.find((d) => d.id == tvSettings?.pinDepartmentId) ||
          departments[0],
      }}
    >
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
                    <DepartmentItem key={d.id} department={d} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <UserFooter />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="bg-transparent">{children}</SidebarInset>
      </SidebarProvider>
    </TVProvider>
  );
};

export default TaskLayout;
