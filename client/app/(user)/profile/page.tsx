"use client";
import { useAuth } from "@/components/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const UserPage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="mx-auto max-w-screen-lg w-full bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-3xl font-bold">Profile</h3>
          <p className="text-xs font-normal leading-snug text-muted-foreground">
            This information will be displayed publicly for shipper
          </p>
        </div>

        {/* <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex gap-2 items-center justify-center rounded-lg px-2 py-1 hover:bg-accent hover:text-accent-foreground">
              <span className="hidden sm:inline text-base font-medium text-muted-foreground">
                Edit
              </span>
              <UserPenIcon className="shrink-0 size-6" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="lg:max-w-screen-sm max-h-screen overflow-y-scroll">
            <p className="font-bold text-lg">Personal Information</p>
            <div className="grid  gap-4">
              <div className="grid gap-1">
                <Label
                  htmlFor="firstName"
                  className="text-sm text-muted-foreground"
                >
                  Họ và tên
                </Label>
                <Input name="username" id="username" placeholder="Họ và tên" />
              </div>
              <div className="grid gap-1">
                <Label
                  htmlFor="lastName"
                  className="text-sm text-muted-foreground"
                >
                  Last name
                </Label>
                <Input id="lastName" name="lastName" placeholder="Last name" />
              </div>
              <div className="grid gap-1">
                <Label
                  htmlFor="birthDate"
                  className="text-sm text-muted-foreground"
                >
                  Date of birth
                </Label>
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      id="birthDate"
                      variant={"outline"}
                      className={cn(
                        "gap-2 justify-between text-left font-normal",
                        !true && "text-muted-foreground"
                      )}
                    >
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="size-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      // selected={date}
                      // onSelect={(v) => {
                      //   setFormData((prev) => ({
                      //     ...prev,
                      //     birhtDate: v || new Date(),
                      //   }));
                      // }}
                      // initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-1">
                <Label
                  htmlFor="phone"
                  className="text-sm text-muted-foreground"
                >
                  Gender
                </Label>
                <RadioGroup
                  defaultValue="comfortable"
                  className="min-[512px]:grid-cols-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="r1" />
                    <Label htmlFor="r1">Famale</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="comfortable" id="r2" />
                    <Label htmlFor="r2">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="compact" id="r3" />
                    <Label htmlFor="r3">Compact</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="flex justify-end items-center">
              <div className="gap-4 flex items-center">
                <Button variant="outline" className="p-2">
                  <span>Cancel</span>
                </Button>
                <Button size="sm">
                  <span>Save</span>
                </Button>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog> */}
      </div>
      {/* <EditProfileForm />
    <EditPhoto /> */}

      <div className="grid gap-2 sm:grid-cols-[1fr_minmax(200px,250px)] overflow-hidden mt-4">
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
              Phone number
            </label>
            <p className="font-medium text-base">
              {currentUser?.phoneNumber || ""}
            </p>
          </div>
          <div>
            <label className="text-sm font-normal text-muted-foreground">
              Date of Birth
            </label>
            <p className="font-medium text-base">
              {currentUser?.birthDate || ""}
            </p>
          </div>
          <div>
            <label className="text-sm font-normal text-muted-foreground">
              Gender
            </label>
            <p className="font-medium text-base">
              {currentUser?.gender?.toLocaleLowerCase() || ""}
            </p>
          </div>
        </div>
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
              Change picture
            </button>
            <button className="w-full max-w-[150px] font-medium text-sm h-10 bg-red-500 rounded-lg text-white ">
              Delete picture
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
