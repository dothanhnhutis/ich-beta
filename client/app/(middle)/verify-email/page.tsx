import React from "react";
import Image from "next/image";
import ReplaceEmailForm from "./replace-email-form";
import { Metadata } from "next";
import SendVerifyEmail from "./send-verify";
export const metadata: Metadata = {
  title: "Xác Thực Email",
};
const VerifyEmailPage = async () => {
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
          <SendVerifyEmail />

          <ReplaceEmailForm />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
