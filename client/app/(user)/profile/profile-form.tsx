"use client";
import React from "react";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/components/providers/auth-provider";
import DateInput from "@/components/date-input";
const ProfileForm = () => {
  const { currentUser } = useAuth();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="flex gap-2 items-center justify-center rounded-lg px-2 py-1 hover:bg-accent hover:text-accent-foreground">
          <PencilIcon className="shrink-0 size-4" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="lg:max-w-screen-sm max-h-screen overflow-y-scroll">
        <AlertDialogTitle>
          <p className="font-bold text-lg">Thông tin cá nhân</p>
        </AlertDialogTitle>

        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label
              htmlFor="firstName"
              className="text-sm text-muted-foreground"
            >
              Họ và tên
            </Label>
            <Input
              name="username"
              id="username"
              value={currentUser?.username}
              placeholder="Họ và tên"
            />
          </div>
          <div className="grid gap-1">
            <Label
              htmlFor="phoneNumber"
              className="text-sm text-muted-foreground"
            >
              Số điện thoại
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="84+ 123 456 789"
            />
          </div>
          <div className="grid gap-1">
            <Label
              htmlFor="birthDate"
              className="text-sm text-muted-foreground"
            >
              Ngày sinh
            </Label>
            <DateInput />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="phone" className="text-sm text-muted-foreground">
              Giới tính
            </Label>
            <RadioGroup
              defaultValue="comfortable"
              className="min-[512px]:grid-cols-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="r1" />
                <Label htmlFor="r1">Nam</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comfortable" id="r2" />
                <Label htmlFor="r2">Nữ</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compact" id="r3" />
                <Label htmlFor="r3">Khác</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" className="p-2">
              <span>Huỷ</span>
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button size="sm">
              <span>Lưu</span>
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProfileForm;
