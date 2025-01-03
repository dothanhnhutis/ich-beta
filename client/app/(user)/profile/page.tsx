"use client";
import { useAuth } from "@/components/providers/auth-provider";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Skeleton } from "@/components/ui/skeleton";

import React from "react";
import ProfileForm from "./profile-form";

const UserPage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="mx-auto max-w-screen-lg w-full bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-3xl font-bold">Hồ sơ</h3>

          <p className="text-xs font-normal leading-snug text-muted-foreground">
            Thông tin này sẽ được hiển thị công khai cho người gửi hàng
          </p>
        </div>
        <ProfileForm />
      </div>
      {/* <EditProfileForm />
      <EditPhoto /> */}

      <div className="grid gap-2 sm:grid-cols-[1fr_minmax(200px,250px)] overflow-hidden mt-4">
        <div className="flex flex-col gap-3">
          <div className="space-y-1">
            <h3 className="flex items-center text-3xl font-bold">
              Thông tin cá nhân
              <ProfileForm />
            </h3>
            <p className="text-xs font-normal leading-snug text-muted-foreground">
              Thông tin này sẽ được hiển thị công khai cho người gửi hàng
            </p>
          </div>
          <div className="grid min-[300px]:grid-cols-2 gap-2 h-auto">
            <div>
              <label className="text-sm font-normal text-muted-foreground">
                Họ và tên
              </label>
              <p className="font-medium text-base">
                {currentUser?.username || ""}
              </p>
            </div>
            <div>
              <label className="text-sm font-normal text-muted-foreground">
                Số điện thoại
              </label>
              <p className="font-medium text-base">
                {currentUser?.phoneNumber || ""}
              </p>
            </div>
            <div>
              <label className="text-sm font-normal text-muted-foreground">
                Ngày sinh
              </label>
              <p className="font-medium text-base">
                {currentUser?.birthDate || ""}
              </p>
            </div>
            <div>
              <label className="text-sm font-normal text-muted-foreground">
                Giới tính
              </label>
              <p className="font-medium text-base">
                {currentUser?.gender?.toLocaleLowerCase() || ""}
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="order-first sm:order-none flex flex-col gap-2 items-center justify-center">
            <Avatar className="size-32">
              <AvatarImage
                referrerPolicy="no-referrer"
                src={"/user-picture.jpg"}
              />
              <AvatarFallback className="bg-transparent">
                <Skeleton className="size-32 rounded-full" />
              </AvatarFallback>
            </Avatar>
            <div className="text-xs font-normal leading-snug text-muted-foreground">
              <p>Format file: PNG, JPG, JPEG</p>
              <p>Maximum file size is 1 MB</p>
            </div>
            <div className="flex flex-col min-[300px]:flex-row gap-2 items-center justify-center w-full">
              <button className="w-full max-w-[150px] font-medium text-sm h-10 bg-primary rounded-lg text-white ">
                Thay đổi
              </button>
              <button className="w-full max-w-[150px] font-medium text-sm h-10 bg-red-500 rounded-lg text-white ">
                Xoá
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
