import React from "react";
import { SignInForm } from "./form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng Nhập",
};

const SignInPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { email } = await searchParams;
  return <SignInForm email={Array.isArray(email) ? undefined : email} />;
};

export default SignInPage;
