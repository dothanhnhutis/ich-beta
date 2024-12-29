"use client";
import { useAuth } from "@/components/providers/auth-provider";
import { useUserSidebar } from "@/components/providers/user-sidebar-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DEFAULT_LOGOUT_REDIRECT } from "@/routes";
import { signOut } from "@/services/users.service";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  // BellIcon,
  CookieIcon,
  // CreditCardIcon,
  LogOutIcon,
  LucideIcon,
  MailIcon,
  // MapPinIcon,
  MenuIcon,
  MonitorIcon,
  // SettingsIcon,
  // ShieldCheckIcon,
  // ShoppingBagIcon,
  SquareUserRoundIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

type SideBarLinkProps = {
  href: string;
  title: string;
  Icon: LucideIcon;
};
const sideBars: Omit<SideBarLinkProps, "isOpen" | "selected">[] = [
  {
    href: "/profile",
    Icon: SquareUserRoundIcon,
    title: "Profile",
  },
  // {
  //   href: "/security",
  //   Icon: ShieldCheckIcon,
  //   title: "Security",
  // },
  {
    href: "/sessions",
    Icon: CookieIcon,
    title: "Sessions",
  },
  // {
  //   href: "/",
  //   Icon: MapPinIcon,
  //   title: "Address",
  // },
  // {
  //   href: "/",
  //   Icon: CreditCardIcon,
  //   title: "Payment method",
  // },
  // {
  //   href: "/settings",
  //   Icon: SettingsIcon,
  //   title: "Settings",
  // },
];

const WrapperUserSiderbar = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { currentUser } = useAuth();
  const { open, toggleSidebar, isMobile, setOpen } = useUserSidebar();
  const path = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push(DEFAULT_LOGOUT_REDIRECT);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white">
      <header className="sticky top-0 z-50 bg-white">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center justify-center">
            <button
              className="p-3 rounded-full hover:bg-accent"
              onClick={toggleSidebar}
            >
              <MenuIcon className="size-6 shrink-0 " />
            </button>
            <Link
              href={"/"}
              className="pl-3 pr-2 shrink-0 hidden sm:inline-block"
            >
              <Image
                src="/logo.png"
                alt="logo.png"
                width="100"
                height="100"
                className="size-14"
              />
            </Link>
            <p className="text-base font-bold text-back max-w-[150px] hidden sm:inline-block">
              Công ty TNHH MTV TM Sản Xuất I.C.H
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            {currentUser && currentUser.roles.length > 0 && (
              <Button
                aria-label="menu"
                variant="ghost"
                size="icon"
                className="rounded-full p-1 hover:bg-blue-100 [&_svg]:size-6"
                asChild
              >
                <Link prefetch href={"/admin"}>
                  <MonitorIcon className="shrink-0 text-gray-500" />
                </Link>
              </Button>
            )}
            {/* <Button
              aria-label="menu"
              variant="ghost"
              size="icon"
              className="rounded-full p-1 [&_svg]:size-6 hover:bg-blue-100 relative before:absolute before:bottom-[30%] before:right-[20%] before:size-2 before:bg-green-400 before:rounded-full"
              asChild
            >
              <Link prefetch href={"/notifications"}>
                <BellIcon className="shrink-0 size-6 text-gray-500" />
              </Link>
            </Button>
            <Button
              aria-label="menu"
              variant="ghost"
              size="icon"
              className="rounded-full p-1 hover:bg-blue-100 [&_svg]:size-6"
              asChild
            >
              <Link prefetch href={"/cart"}>
                <ShoppingBagIcon className="shrink-0 text-gray-500" />
              </Link>
            </Button> */}
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none" asChild>
                <div className="p-1  hover:bg-blue-100 rounded-full cursor-pointer">
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
                  <Link
                    href="/settings/profile"
                    className="cursor-pointer h-[34px]"
                  >
                    <span className="font-medium">Hồ sơ</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/settings/security"
                    className="cursor-pointer h-[34px]"
                  >
                    <span className="font-medium">Bảo mật</span>
                  </Link>
                </DropdownMenuItem>

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
      <div className="flex">
        <div
          data-state={open}
          className="hidden sm:block shrink-0 h-[calc(100vh_-_72px)] sticky left-0 top-[72px] p-1 space-y-1 w-[64px] data-[state='true']:w-[200px] data-[state='true']:p-2"
        >
          {sideBars.map(({ Icon, href, title }, idx) => (
            <Link
              key={idx}
              href={href}
              data-state={open}
              className={cn(
                "flex justify-center data-[state='true']:justify-start data-[state='true']:items-center gap-1 data-[state='true']:gap-2 rounded-md text-center flex-col py-2 data-[state='true']:p-2 data-[state='true']:flex-row [&>svg]:data-[state='true']:mx-0 [&>p]:data-[state='true']:text-sm",
                !href.startsWith(path) ? "hover:bg-accent" : "bg-accent"
              )}
            >
              <Icon className="shrink-0 size-6 mx-auto" />
              <p className="text-[10px] text-muted-foreground leading-4 truncate">
                {title}
              </p>
            </Link>
          ))}
        </div>
        <Sheet
          open={isMobile ? open : false}
          onOpenChange={() => {
            if (isMobile) setOpen(!open);
          }}
        >
          <SheetContent
            hiddenClose={true}
            side="left"
            className="sm:hidden w-[280px] p-2"
          >
            <VisuallyHidden.Root>
              <SheetTitle></SheetTitle>
            </VisuallyHidden.Root>
            <div className="flex items-center">
              <button
                className="p-2 rounded-full hover:bg-accent"
                onClick={() => setOpen(!open)}
              >
                <MenuIcon className="size-6 shrink-0 " />
              </button>
              <Link href={"/"} className="px-2 shrink-0">
                <Image
                  src="/logo.png"
                  alt="logo.png"
                  width="100"
                  height="100"
                  className="size-14"
                />
              </Link>
              <p className="text-base font-bold text-back">
                Công ty TNHH MTV TM Sản Xuất I.C.H
              </p>
            </div>
            <div className="pt-2">
              {sideBars.map(({ Icon, href, title }, idx) => (
                <Link
                  key={idx}
                  href={href}
                  data-state={true}
                  className={cn(
                    "flex justify-center data-[state='true']:justify-start data-[state='true']:items-center gap-1 data-[state='true']:gap-2 rounded-md text-center flex-col py-2 data-[state='true']:p-2 data-[state='true']:flex-row [&>svg]:data-[state='true']:mx-0 [&>p]:data-[state='true']:text-sm",
                    !href.startsWith(path) ? "hover:bg-accent" : "bg-accent"
                  )}
                >
                  <Icon className="shrink-0 size-6 mx-auto" />
                  <p className="text-[10px] text-muted-foreground leading-4 truncate">
                    {title}
                  </p>
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        {children}
      </div>
    </div>
  );
};

export default WrapperUserSiderbar;
