"use client";
import React from "react";
import { LogOutIcon, MailIcon, MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { signOut } from "@/services/users.service";
import { DEFAULT_LOGOUT_REDIRECT } from "@/routes";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useSidebar } from "@/components/ui/sidebar";

const AdminHeader = () => {
  const router = useRouter();
  const { currentUser } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push(DEFAULT_LOGOUT_REDIRECT);
    } catch (error: unknown) {
      console.log(error);
    }
  };
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-[5] bg-white">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center justify-center">
          <button
            className="p-3 rounded-full hover:bg-accent"
            onClick={toggleSidebar}
          >
            <MenuIcon className="size-6 shrink-0 " />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none" asChild>
              <div className="p-1 hover:bg-blue-100 rounded-full cursor-pointer">
                <Avatar className="size-8">
                  <AvatarImage
                    referrerPolicy="no-referrer"
                    src={"/user-picture.jpg"}
                  />
                  <AvatarFallback className="bg-transparent">
                    <Skeleton className="size-8 rounded-full" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[360px]">
              <DropdownMenuLabel className="flex items-center gap-3">
                <Avatar className="size-24">
                  <AvatarImage
                    referrerPolicy="no-referrer"
                    src={currentUser?.picture || "/user-picture.jpg"}
                  />
                  <AvatarFallback className="bg-transparent">
                    <Skeleton className="size-24 rounded-full" />
                  </AvatarFallback>
                </Avatar>

                <div className="w-full overflow-hidden">
                  <p className="font-medium text-lg">
                    {currentUser?.username || ""}
                  </p>
                  {/* <p className="text-muted-foreground font-normal">Admin</p> */}
                  <div className="flex items-center space-x-2 text-muted-foreground w-full">
                    <MailIcon className="flex flex-shrink-0 size-4" />
                    <p className="text-sm truncate">
                      {currentUser?.email || ""}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer h-[34px]">
                  <span className="font-medium">Hồ sơ</span>
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem asChild>
                <Link href="/security" className="cursor-pointer h-[34px]">
                  <span className="font-medium">Bảo mật</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/security" className="cursor-pointer h-[34px]">
                  <span className="font-medium">Bảo mật</span>
                </Link>
              </DropdownMenuItem> */}

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span className="font-medium">Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
