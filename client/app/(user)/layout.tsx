import React from "react";
import { cookies } from "next/headers";
import WrapperUserSiderbar from "./wrapper";
import { UserSidebarProvider } from "@/components/providers/user-sidebar-provider";

const UserLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <UserSidebarProvider
      defaultOpen={defaultOpen}
      minMobileBreackPoint={640}
      siderbarCookieName="sidebar:state"
    >
      <WrapperUserSiderbar>{children}</WrapperUserSiderbar>
    </UserSidebarProvider>
  );
};

export default UserLayout;
