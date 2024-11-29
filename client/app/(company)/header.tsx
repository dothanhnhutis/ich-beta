"use client";
import { cn } from "@/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";
import React from "react";
import NavMobile from "./nav-mobile";
import NavDesktop from "./nav-desktop";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [containerState, setContainerState] = React.useState<"close" | "open">(
    "close"
  );

  React.useEffect(() => {
    const handleResize = () => {
      setContainerState("close");
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <header
      className="sticky top-0 left-0 right-0 bg-white z-50"
      data-state="open"
    >
      {containerState == "open" && (
        <style jsx global>{`
          body {
            position: fixed;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            overflow: hidden;
          }
        `}</style>
      )}
      <div
        onClick={() => setContainerState("close")}
        data-state={containerState}
        className={cn(
          "fixed top-0 left-0 right-0 h-screen transition-all ease-out bg-transparent data-[state='open']:bg-[#1111115c] data-[state='open']:backdrop-blur hidden data-[state='open']:block"
        )}
      />

      <div className="flex items-center justify-between mx-auto max-w-[1350px] p-2 relative z-50 bg-white">
        <button
          onClick={() =>
            setContainerState((prev) => (prev == "close" ? "open" : "close"))
          }
          type="button"
          className="md:hidden"
        >
          {containerState == "close" ? (
            <MenuIcon className="size-7 shrink-0" />
          ) : (
            <XIcon className="size-7 shrink-0" />
          )}
        </button>
        <NavMobile containerState={containerState} />

        <Image
          src="/logo.png"
          alt="logo.png"
          width="100"
          height="100"
          className="size-14 shrink-0"
        />

        <NavDesktop />
        <Button asChild variant="outline" size="sm">
          <Link href="/signin">Sign In</Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
