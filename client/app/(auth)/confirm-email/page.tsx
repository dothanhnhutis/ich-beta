import { Button } from "@/components/ui/button";
import envs from "@/configs/envs";
import { verifyJWT } from "@/lib/jwt";
import { UserToken } from "@/schema/user.schema";
import { confirmEmail } from "@/services/auth.service";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Xác Thực Tài Khoản",
};

const ConfirmEmailPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { token } = await searchParams;

  const expiredElement: React.JSX.Element = (
    <div className="flex flex-col items-center sm:mx-auto sm:max-w-md gap-2 text-center text-red-500">
      <h4 className="font-semibold text-2xl text-black">Xác Thực Tài Khoản</h4>
      <p>Xác thực email không thành công.</p>
      <p>Mã thông báo đã hết hạn</p>

      <Button asChild>
        <Link href="/">Go to Home</Link>
      </Button>
    </div>
  );

  if (!token || Array.isArray(token)) {
    return expiredElement;
  }

  const data = verifyJWT<UserToken>(token, envs.NEXT_PUBLIC_JWT_SECRET, {
    ignoreExpiration: false,
  });

  if (!data || data.type != "emailVerification") return expiredElement;

  const isSuccess = await confirmEmail(token);

  if (!isSuccess) return expiredElement;

  return (
    <div className="flex flex-col items-center sm:mx-auto sm:max-w-md gap-2 text-center text-green-500">
      <h4 className="font-semibold text-2xl text-black">Xác Thực Tài Khoản</h4>
      <p className="text-sm text-green-500 text-center">
        Xác thực tài khoản thành công
      </p>
      <Button asChild>
        <Link href="/">Go to Home</Link>
      </Button>
    </div>
  );
};

export default ConfirmEmailPage;
