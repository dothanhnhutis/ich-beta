"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import envs from "@/configs/envs";

const ContinueBtn = ({
  redir,
  label = "Sign up with Google",
  className,
}: {
  redir?: string;
  label?: string;
  className?: string;
}) => {
  const handleSigUpWithGoogle = () => {
    document.location.href = `${
      envs.NEXT_PUBLIC_SERVER_URL
    }/api/v1/auth/google${redir ? "?redir=" + redir : ""}`;
  };
  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={handleSigUpWithGoogle}
    >
      {label}
    </Button>
  );
};

export default ContinueBtn;
