"use client";
import { BaseNav, DropDownNav, navs } from "@/configs/constants";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { UrlObject } from "url";

type DropDownNavType = {
  href: string | UrlObject;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

const DropDownContainerNav = ({
  children,
  href,
  title,
  style,
  className,
}: DropDownNavType) => {
  const [containerState, setContainerState] = React.useState<"close" | "open">(
    "close"
  );
  return (
    <>
      <div
        data-state={containerState}
        className={cn(
          "flex items-center justify-between hover:text-primary hover:bg-primary-foreground pl-2 pr-1 py-1",
          className
        )}
        style={style}
      >
        <Link
          href={href}
          className="hover:text-primary hover:bg-primary-foreground "
        >
          {title}
        </Link>
        <button
          type="button"
          onClick={() =>
            setContainerState((prev) => (prev == "close" ? "open" : "close"))
          }
        >
          <ChevronDownIcon
            className={cn(
              "shrink-0 size-5",
              containerState == "close" ? "rotate-180" : ""
            )}
          />
        </button>
      </div>
      {containerState == "open" && children}
    </>
  );
};

const generateNavElement = (
  navData: BaseNav | DropDownNav,
  paddingLeft: number
): React.JSX.Element => {
  if ("subNav" in navData) {
    if ("subNav" in navData.subNav[0]) {
      return (
        <DropDownContainerNav
          title={navData.title}
          href={navData.href}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          <ul className="capitalize font-normal">
            {navData.subNav.map((sub, idx) => (
              <li key={idx}>{generateNavElement(sub, paddingLeft + 8)}</li>
            ))}
          </ul>
        </DropDownContainerNav>
      );
    } else {
      return (
        <DropDownContainerNav
          title={navData.title}
          href={navData.href}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          <div className="capitalize font-normal">
            {navData.subNav.map((sub, idx) => (
              <React.Fragment key={idx}>
                {generateNavElement(sub, paddingLeft + 8)}
              </React.Fragment>
            ))}
          </div>
        </DropDownContainerNav>
      );
    }
  } else {
    return (
      <Link
        href={navData.href}
        className="hover:text-primary hover:bg-primary-foreground block pr-2 py-1"
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        {navData.title}
      </Link>
    );
  }
};

const NavMobile = ({
  containerState,
}: {
  containerState: "open" | "close";
}) => {
  return (
    <nav
      data-state={containerState}
      className={cn(
        "md:hidden transition-all ease-out overflow-y-scroll absolute top-full left-0 right-0 bg-white max-h-[calc(100vh_-_72px)] flex flex-col text-gray-500 uppercase font-semibold text-base data-[state='close']:h-0"
      )}
    >
      {navs.map((nav, idx) => (
        <React.Fragment key={idx}> {generateNavElement(nav, 8)}</React.Fragment>
      ))}
    </nav>
  );
};

export default NavMobile;
