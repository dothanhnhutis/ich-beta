"use client";
import { useAuth } from "@/components/providers/auth-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import useCountDown from "@/hooks/useCountDown";
import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { reSendEmailAction } from "../actions";

const SendVerifyEmail = () => {
  const { currentUser } = useAuth();
  const [time, setTime] = useCountDown("reSendEmail", currentUser?.email || "");

  const [message, formAction, isPending] = React.useActionState<string | null>(
    reSendEmailAction,
    null
  );
  React.useEffect(() => {
    if (message && time == 0) {
      setTime(60);
      toast.success(message);
    }
  }, [message, time, setTime]);
  console.log(message);

  return (
    <form action={formAction} className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-center mt-4">
        <span>Xác minh email của bạn để tiếp tục</span>
      </h1>
      <div className="text-center text-muted-foreground text-base">
        Chúng tôi vừa gửi email đến địa chỉ:{" "}
        <strong className="block md:inline">{currentUser?.email}</strong>
      </div>
      <p className="text-center text-muted-foreground text-base">
        Vui lòng kiểm tra email của bạn và bấm liên kết được cung cấp để xác
        minh địa chỉ của bạn.
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
          disabled={time > 0 || isPending}
          variant="outline"
          className="rounded-full border-2 border-primary !text-primary font-bold"
        >
          {isPending && (
            <LoaderCircleIcon className="h-4 w-4 mr-2 animate-spin flex-shrink-0" />
          )}
          Gửi lại {time > 0 && `(${time}s)`}
        </Button>
      </div>
    </form>
  );
};

export default SendVerifyEmail;
