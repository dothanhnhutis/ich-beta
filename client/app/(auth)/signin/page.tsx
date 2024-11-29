import React from "react";
import { SignInForm } from "./form";

const SignIn = async ({
  searchParams,
}: {
  searchParams: { email?: string | string[] | undefined };
}) => {
  const email = typeof searchParams.email == "string" ? searchParams.email : "";
  return <SignInForm email={email} />;
};

export default SignIn;
