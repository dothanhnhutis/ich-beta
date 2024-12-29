"use client";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import useCountDown from "@/hooks/useCountDown";
import { reSendVerifyEmail } from "@/services/users.service";
import { LoaderCircleIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const SendVerifyEmailBtn = () => {
  const { currentUser } = useAuth();
  const [time, setTime] = useCountDown("reSendEmail", currentUser?.email || "");

  const [isPending, startTransition] = React.useTransition();

  const handleResend = () => {
    try {
      startTransition(async () => {
        await reSendVerifyEmail();
      });
      setTime(60);
      toast.success(
        "New verification email is successfully sent. Please, check your email..."
      );
    } catch (error: unknown) {
      console.log(error);
    }
  };
  return (
    <Button
      disabled={time > 0 || isPending}
      onClick={handleResend}
      variant="outline"
      className="rounded-full border-2 border-primary !text-primary font-bold"
    >
      {isPending && (
        <LoaderCircleIcon className="h-4 w-4 mr-2 animate-spin flex-shrink-0" />
      )}
      Gửi lại {time > 0 && `(${time}s)`}
    </Button>
  );
};

export default SendVerifyEmailBtn;
