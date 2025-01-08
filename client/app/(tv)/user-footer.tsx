"use client";
import React from "react";
// import Image from "next/image";
import { useAuth } from "@/components/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const UserFooter = () => {
  const { currentUser } = useAuth();
  return (
    <div className=" flex items-center flex-shrink-0 gap-2 bg-white rounded-md p-2">
      {/* <Image
        src="/logo.png"
        alt="logo.png"
        width="100"
        height="100"
        className="size-10 shrink-0 rounded-full border-2 border-white shadow bg-white"
      /> */}
      <Avatar className="size-10">
        <AvatarImage
          referrerPolicy="no-referrer"
          src={currentUser?.picture || "/user-picture.jpg"}
        />
        <AvatarFallback className="bg-transparent">
          <Skeleton className="size-10 rounded-full" />
        </AvatarFallback>
      </Avatar>
      <div className="text-sm">
        <p className="font-semibold">{currentUser?.username || "error"}</p>
        <p>{currentUser?.email || "error"}</p>
      </div>
    </div>
  );
};

export default UserFooter;
