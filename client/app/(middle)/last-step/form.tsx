"use client";
import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/components/providers/auth-provider";
import { UpdateProfile, updateProfileSchema, User } from "@/schema/user.schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { updateProfile } from "@/services/users.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LastStepForm = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [formData, setFormData] = React.useState<UpdateProfile>({
    username: currentUser?.username || "",
    birthDate: currentUser?.birthDate || "",
    gender: currentUser?.gender || "MALE",
    phoneNumber: currentUser?.phoneNumber || "",
  });

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, success } = updateProfileSchema.safeParse(formData);
    if (!success) return;
    startTransition(async () => {
      await updateProfile(data);
      router.push("/profile");
      toast.success("Tạo hồ sơ thành công.");
    });
  };

  return (
    <form className="grid grid-cols-6 gap-4" onSubmit={handleSubmit}>
      <div className="flex justify-center col-span-6">
        <Avatar className="size-24">
          <AvatarImage
            referrerPolicy="no-referrer"
            src={currentUser?.picture || "/user-picture.jpg"}
          />
          <AvatarFallback className="bg-transparent">
            <Skeleton className="size-24 rounded-full" />
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col gap-1 col-span-6 sm:col-span-3">
        <label htmlFor="username" className="cursor-pointer">
          Họ và tên
        </label>
        <Input
          type="text"
          id="username"
          name="username"
          placeholder="Nhập họ và tên"
          value={formData.username}
          onChange={handleOnchange}
          disabled={isPending}
        />
      </div>

      <div className="flex flex-col gap-1 col-span-6 sm:col-span-3">
        <label htmlFor="phoneNumber">Số điện thoại</label>
        <Input
          placeholder="0123456789"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleOnchange}
          disabled={isPending}
        />
      </div>

      <div className="grid gap-1 col-span-6">
        <label htmlFor="birthDate" className="col-span-full">
          Ngày sinh
        </label>
        <Input
          disabled={isPending}
          id="birthDate"
          name="birthDate"
          placeholder="dd/MM/yyyy"
          value={formData.birthDate}
          onChange={handleOnchange}
        />
      </div>

      <div className="flex flex-col gap-2 col-span-6">
        <label htmlFor="r1" className="cursor-pointer">
          Giới tính
        </label>
        <RadioGroup
          defaultValue={formData.gender || undefined}
          className="min-[512px]:grid-cols-3"
          onValueChange={(v) => {
            setFormData((prev) => ({ ...prev, gender: v as User["gender"] }));
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="MALE" id="r1" disabled={isPending} />
            <Label htmlFor="r1" className="text-sm cursor-pointer">
              Nam
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="FEMALE" id="r2" disabled={isPending} />
            <Label htmlFor="r2" className="text-sm cursor-pointer">
              Nữ
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="OTHER" id="r3" disabled={isPending} />
            <Label htmlFor="r3" className="text-sm cursor-pointer">
              Khác
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button className="col-span-6" disabled={isPending}>
        Lưu
      </Button>
    </form>
  );
};

export default LastStepForm;
