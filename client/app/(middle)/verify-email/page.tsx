"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import useCountDown from "@/hooks/useCountDown";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { reSendVerifyEmail } from "@/services/users.service";
import ChangeEmailForm from "./change-email";

const VerifyEmailPage = () => {
  const { currentUser } = useAuth();
  const [time, setTime] = useCountDown("reSendEmail", currentUser?.email || "");

  const reSendVerifyEmailMutation = useMutation({
    mutationFn: async () => {
      await reSendVerifyEmail();
    },
    onSuccess() {
      setTime(60);
      toast.success(
        "New verification email is successfully sent. Please, check your email..."
      );
    },
  });

  return (
    <div
      className="flex flex-col flex-grow sm:flex-grow-0 sm:grid grid-cols-12 transition-all
"
    >
      <div className="flex flex-col flex-grow sm:flex-grow-0 sm:col-start-3 sm:col-end-11 mx-auto w-full sm:max-w-screen-sm p-4">
        <div className="flex flex-col flex-grow space-y-6">
          <div className="mt-10 mb-6 text-center">
            <div className="inline-flex w-[145px] h-[130px] min-w-[145px] min-h-[130px]">
              <Image
                src={"/verify-mail.svg"}
                alt="mail"
                width={100}
                height={100}
                className="shrink-0 size-auto"
              />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-center mt-4">
            <span>Xác minh email của bạn để tiếp tục</span>
          </h1>
          <div className="text-center text-muted-foreground text-base">
            Chúng tôi vừa gửi email đến địa chỉ:{" "}
            <strong className="block md:inline">{currentUser?.email}</strong>
          </div>
          <p className="text-center text-muted-foreground text-base">
            Vui lòng kiểm tra email của bạn và chọn liên kết được cung cấp để
            xác minh địa chỉ của bạn.
          </p>
          <div className="flex flex-col sm:justify-center sm:flex-row gap-2">
            <Link
              target="_blank"
              href="https://gmail.com/"
              className={cn(
                buttonVariants({ variant: "default" }),
                "rounded-full order-last font-bold"
              )}
            >
              Đi tới Hộp thư đến Gmail
            </Link>
            <Button
              disabled={time > 0 || reSendVerifyEmailMutation.isPending}
              onClick={() => reSendVerifyEmailMutation.mutate()}
              variant="outline"
              className="rounded-full border-2 border-primary !text-primary font-bold"
            >
              {reSendVerifyEmailMutation.isPending && (
                <LoaderCircleIcon className="h-4 w-4 mr-2 animate-spin flex-shrink-0" />
              )}
              Gửi lại {time > 0 && `(${time}s)`}
            </Button>
          </div>

          <ChangeEmailForm />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
