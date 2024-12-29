"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOutIcon, SettingsIcon } from "lucide-react";
import React from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { DEFAULT_LOGOUT_REDIRECT } from "@/routes";
import { signOut } from "@/services/users.service";

const UserMenu = () => {
  const { currentUser } = useAuth();
  const [open, setOpen] = React.useState<boolean>(false);

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
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="outline-none">
        <Avatar>
          <AvatarImage
            referrerPolicy="no-referrer"
            src={currentUser?.picture || "/user-picture.jpg"}
          />
          <AvatarFallback className="bg-transparent">
            <Skeleton className="h-10 w-10 rounded-full" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent avoidCollisions align="end" className="w-[245px]">
        <DropdownMenuLabel className="flex flex-col items-center">
          <Avatar className="w-24 h-24">
            <AvatarImage
              referrerPolicy="no-referrer"
              src={currentUser?.picture || "/user-picture.jpg"}
            />
            <AvatarFallback className="bg-transparent">
              <Skeleton className="w-24 h-24 rounded-full" />
            </AvatarFallback>
          </Avatar>
          <p className="font-medium text-lg">
            {currentUser?.username || "Error"}
          </p>
        </DropdownMenuLabel>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={(e) => e.preventDefault()}
            >
              <SettingsIcon className="mr-4 h-4 w-4" />
              <span>Đóng tài khoản</span>
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will deactivate your account
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOutIcon className="mr-4 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
