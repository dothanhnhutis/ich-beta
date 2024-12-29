import React from "react";
import Image from "next/image";

import { cookies } from "next/headers";
import {
  Sidebar,
  SidebarContent,
  // SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  // SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  // BoxesIcon,
  MonitorIcon,
  // NewspaperIcon,
  // UsersIcon,
  // WrenchIcon,
} from "lucide-react";
import AdminHeader from "./header";

const AdminLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar className="[&_>_div[data-sidebar='sidebar']]:bg-transparent">
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
            {/* <SidebarGroupLabel>asdsad</SidebarGroupLabel> */}
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="[&>svg]:size-6 h-auto">
                    <Link
                      href={"/admin/displays"}
                      className={cn("flex items-center", "hover:bg-accent")}
                    >
                      <MonitorIcon className="shrink-0" />
                      <p
                        className={cn(
                          "text-muted-foreground leading-4 truncate"
                        )}
                      >
                        Màn Hình
                      </p>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* <SidebarMenuItem>
                  <SidebarMenuButton asChild className="[&>svg]:size-6 h-auto">
                    <Link
                      href={"/"}
                      className={cn(
                        "flex flex-shrink-0 rounded-lg p-2 gap-2 items-center transition-all ease-in-out duration-300 text-blue-600 font-bold",
                        "text-blue-600 font-bold "
                      )}
                    >
                      <WrenchIcon className="shrink-0" />
                      <p className={cn("text-sm w-full truncate ")}>Role</p>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="[&>svg]:size-6 h-auto">
                    <Link
                      href={"/"}
                      className={cn(
                        "flex flex-shrink-0 rounded-lg p-2 gap-2 items-center transition-all ease-in-out duration-300 text-blue-600 font-bold",
                        "text-blue-600 font-bold "
                      )}
                    >
                      <UsersIcon className="shrink-0" />
                      <p className={cn("text-sm w-full truncate ")}>Users</p>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="[&>svg]:size-6 h-auto">
                    <Link
                      href={"/"}
                      className={cn(
                        "flex flex-shrink-0 rounded-lg p-2 gap-2 items-center transition-all ease-in-out duration-300 text-blue-600 font-bold",
                        "text-blue-600 font-bold "
                      )}
                    >
                      <NewspaperIcon className="shrink-0" />
                      <p className={cn("text-sm w-full truncate ")}>Post</p>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="[&>svg]:size-6 h-auto">
                    <Link
                      href={"/"}
                      className={cn(
                        "flex flex-shrink-0 rounded-lg p-2 gap-2 items-center transition-all ease-in-out duration-300 text-blue-600 font-bold",
                        "text-blue-600 font-bold "
                      )}
                    >
                      <BoxesIcon className="shrink-0" />
                      <p className={cn("text-sm w-full truncate ")}>Warehose</p>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem> */}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        {/* <SidebarFooter>settings</SidebarFooter> */}
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-transparent">
        <AdminHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
