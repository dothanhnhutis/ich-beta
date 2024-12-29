"use client";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import React from "react";

const SIDEBAR_COOKIE_NAME = "userSidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const MIN_MOBILE_BREAKPOINT = 768;

type UserSiderbarContext = {
  open: boolean;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const userSiderbarContext = React.createContext<UserSiderbarContext | null>(
  null
);

type UserSidebarProviderProps = {
  children?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  siderbarCookieName?: string;
  siderbarCookieMaxAge?: number;
  minMobileBreackPoint?: number;
};

export const UserSidebarProvider = ({
  children,
  defaultOpen,
  open,
  onOpenChange,
  siderbarCookieName = SIDEBAR_COOKIE_NAME,
  siderbarCookieMaxAge = SIDEBAR_COOKIE_MAX_AGE,
  minMobileBreackPoint = MIN_MOBILE_BREAKPOINT,
}: UserSidebarProviderProps) => {
  const [state, setState] = React.useState<boolean>(() => {
    if (onOpenChange && open == undefined) {
      throw new Error("asdasd");
    }
    return open || !!defaultOpen;
  });
  const frame = useWindowDimensions();

  const [mobile, setIsMobile] = React.useState<boolean>();
  const handleSetState = React.useCallback(
    (value: boolean) => {
      document.cookie = `${siderbarCookieName}=${value}; path=/; max-age=${siderbarCookieMaxAge}`;
      setState(value);
    },
    [siderbarCookieMaxAge, siderbarCookieName]
  );
  React.useEffect(() => {
    if (frame) {
      if (frame.width < minMobileBreackPoint) handleSetState(false);
    }
    setIsMobile(frame ? frame.width < minMobileBreackPoint : false);
  }, [frame, handleSetState, minMobileBreackPoint]);

  const handleOnOpenChange = () => {
    handleSetState(!state);
  };

  return (
    <userSiderbarContext.Provider
      value={{
        open: state,
        toggleSidebar: handleOnOpenChange,
        isMobile: !!mobile,
        setOpen: (open) => {
          handleSetState(open);
        },
      }}
    >
      {children}
    </userSiderbarContext.Provider>
  );
};

export const useUserSidebar = () => {
  const context = React.useContext(userSiderbarContext);
  if (!context) {
    throw new Error(
      "useUserSidebar must be used within a UserSidebarProvider."
    );
  }
  return context;
};

// export const UserSidebarContent = React.forwardRef<
//   HTMLDivElement,
//   React.ComponentProps<"div">
// >(({ className, ...props }, ref) => {
//   return (
//     <div
//       ref={ref}
//       data-sidebar="content"
//       className={cn("flex", className)}
//       {...props}
//     />
//   );
// });
// UserSidebarContent.displayName = "UserSidebarContent";

// export const UserSideBar = ({ children }: { children?: React.ReactNode }) => {
//   const { isMobile, open, setOpen } = useUserSidebar();
//   return (
//     <>
//       <div
//         data-state={open}
//         className="hidden sm:block shrink-0 h-[calc(100vh_-_72px)] sticky left-0 top-[72px] p-1 space-y-1 w-[64px] data-[state='true']:w-[200px] data-[state='true']:p-2"
//       >
//         {children}
//       </div>
//       <Sheet
//         open={isMobile ? open : false}
//         onOpenChange={() => {
//           if (isMobile) {
//             setOpen(!open);
//           }
//         }}
//       >
//         <SheetContent
//           showClose={false}
//           side="left"
//           className="sm:hidden w-[280px] space-y-1 p-2"
//         >
//           {children}
//         </SheetContent>
//       </Sheet>
//     </>
//   );
// };
