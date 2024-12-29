import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

import React from "react";
import SendVerifyEmailBtn from "./send-verify-btn";
import ReplaceEmailForm from "./replace-email-form";
import { Metadata } from "next";
import EmailBox from "./email-box";
export const metadata: Metadata = {
  title: "Xác Thực Email",
};
const VerifyEmailPage = () => {

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
         <EmailBox/>
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
            <SendVerifyEmailBtn />
          </div>

          <ReplaceEmailForm />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
