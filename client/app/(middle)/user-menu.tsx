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

import image from "@/public/user-picture.jpg";
import { useAuth } from "@/components/providers/auth-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { DEFAULT_LOGOUT_REDIRECT } from "@/routes";

const UserMenu = () => {
  const { currentUser, signOut } = useAuth();
  const [open, setOpen] = React.useState<boolean>(false);
  const router = useRouter();

  const signOutMutation = useMutation({
    mutationFn: async () => {
      await signOut();
    },
    onSuccess() {
      router.push(DEFAULT_LOGOUT_REDIRECT);
    },
  });
  return (
    <div>
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
            {/* <p className="text-muted-foreground font-sm">SUPER_ADMIN</p> */}
          </DropdownMenuLabel>
          <DropdownMenuItem className="cursor-pointer">
            <SettingsIcon className="mr-4 h-4 w-4" />
            <span>Close Account</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              signOutMutation.mutate();
            }}
            className="cursor-pointer"
          >
            <LogOutIcon className="mr-4 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog>
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
    </div>
  );
};

export default UserMenu;
