import React from "react";
import Link from "next/link";
import Image from "next/image";
import UserMenu from "./user-menu";

const MiddleLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 backdrop-blur bg-background/60">
        <div className="flex flex-shrink-0 items-center justify-between mx-auto max-w-[1350px] p-2 relative z-50">
          <Link href="/" prefetch={true}>
            <Image
              src="/logo.png"
              alt="logo.png"
              width="100"
              height="100"
              className="size-14 shrink-0"
            />
          </Link>
          <UserMenu />
        </div>
      </header>
      {children}
    </>
  );
};

export default MiddleLayout;
