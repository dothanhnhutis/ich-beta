"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/components/providers/auth-provider";
import { User } from "@/schema/user.schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

// import { DatePicker, DatePickerInput } from "@/components/date-picker1";
// import DatePicker2 from "@/components/date-picker2";

const LastStepForm = () => {
  const { currentUser } = useAuth();
  const [info, setInfo] = React.useState<{
    username: string;
    phoneNumber: string;
    birthDate: Date;
    gender: User["gender"];
  }>({
    username: currentUser?.username || "",
    birthDate: currentUser?.birthDate || new Date(),
    gender: currentUser?.gender || "MALE",
    phoneNumber: currentUser?.phoneNumber || "",
  });

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form className="grid grid-cols-6 gap-4">
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
          Tên
        </label>
        <Input
          type="text"
          id="username"
          name="username"
          placeholder="Nhập họ và tên"
          value={info.username}
          onChange={handleOnchange}
        />
      </div>

      <div className="flex flex-col gap-1 col-span-6 sm:col-span-3">
        <label htmlFor="phoneNumber">Số điện thoại</label>
        <Input
          placeholder="0123456789"
          id="phoneNumber"
          name="phoneNumber"
          value={info.phoneNumber}
          onChange={handleOnchange}
        />
      </div>

      {/* <div className="grid gap-1 col-span-6">
        <label htmlFor="birthDate" className="col-span-full">
          Ngày sinh
        </label>
        <DatePicker yearRange={10} />
      </div> */}

      <div className="grid gap-1 col-span-6">
        <label htmlFor="birthDate" className="col-span-full">
          Ngày sinh
        </label>
        {/* <DatePicker
          maxYear={2005}
          minYear={1900}
          onValueChange={(data) => console.log(data.toISOString())}
        >
          <DatePickerInput idx={0} type="day" />
          <span>/</span>
          <DatePickerInput idx={1} type="month" />
          <span>/</span>
          <DatePickerInput idx={2} type="year" />
        </DatePicker> */}
      </div>

      <div className="grid gap-1 col-span-6">
        <label htmlFor="birthDate" className="col-span-full">
          Ngày sinh
        </label>
        {/* <DatePicker2 maxYear={2005} minYear={1900} /> */}
      </div>

      <div className="flex flex-col gap-2 col-span-6">
        <label htmlFor="r1" className="cursor-pointer">
          Giới tính
        </label>
        <RadioGroup
          defaultValue={info.gender || undefined}
          className="min-[512px]:grid-cols-3"
          onValueChange={(v) => {
            setInfo((prev) => ({ ...prev, gender: v as User["gender"] }));
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="MALE" id="r1" />
            <Label htmlFor="r1" className="text-sm cursor-pointer">
              Nam
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="FEMALE" id="r2" />
            <Label htmlFor="r2" className="text-sm cursor-pointer">
              Nữ
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="OTHER" id="r3" />
            <Label htmlFor="r3" className="text-sm cursor-pointer">
              Khác
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button className="col-span-6">Lưu</Button>
    </form>
  );
};

export default LastStepForm;
