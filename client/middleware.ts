import {
  NextRequest,
  NextResponse,
  // userAgent
} from "next/server";

import { cookies } from "next/headers";
import {
  authRoutes,
  COMPLETE_PROFILE_ROUTE,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_LOGOUT_REDIRECT,
  EMAIL_VERIFY_ROUTE,
  privateRegexRoutes,
} from "./routes";
import { getCurrentUser } from "./services/users.service";

// function redirect(request: NextRequest, path?: string) {
//   const { nextUrl, url } = request;
//   //add Header
//   const headers = new Headers(request.headers);
//   headers.set("x-current-path", nextUrl.pathname);
//   headers.set("x-current-search-params", nextUrl.searchParams.toString());
//   headers.set(
//     "x-forwarded-for",
//     request.headers.get("x-real-ip") ||
//       request.headers.get("x-forwarded-for") ||
//       ""
//   );
//   headers.set("x-user-agent", userAgent(request).ua || "");

//   if (path) {
//     const response = NextResponse.redirect(new URL(path, request.nextUrl), {
//       headers,
//     });
//     if (path == "/login") response.cookies.delete("session");
//     return response;
//   } else {
//     const response = NextResponse.next({
//       request: {
//         headers,
//       },
//     });
//     return response;
//   }
// }

export async function middleware(request: NextRequest) {
  const allCookie = (await cookies())
    .getAll()
    .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
    .join("; ");
  const user = await getCurrentUser({
    headers: {
      Cookie: allCookie,
    },
  });

  const isPrivateRoute = privateRegexRoutes.some((routes) =>
    routes.test(request.nextUrl.pathname)
  );

  const isAuthRoute = authRoutes.test(request.nextUrl.pathname);

  if (isPrivateRoute) {
    if (user) {
      if (!user.emailVerified) {
        if (!request.nextUrl.pathname.startsWith(EMAIL_VERIFY_ROUTE)) {
          return NextResponse.redirect(
            new URL(EMAIL_VERIFY_ROUTE, request.nextUrl)
          );
        }
      } else {
        if (request.nextUrl.pathname.startsWith(EMAIL_VERIFY_ROUTE)) {
          return NextResponse.redirect(
            new URL(DEFAULT_LOGIN_REDIRECT, request.nextUrl)
          );
        }
      }

      if (!user.birthDate) {
        if (!request.nextUrl.pathname.startsWith(COMPLETE_PROFILE_ROUTE)) {
          return NextResponse.redirect(
            new URL(COMPLETE_PROFILE_ROUTE, request.nextUrl)
          );
        }
      } else {
        if (request.nextUrl.pathname.startsWith(COMPLETE_PROFILE_ROUTE)) {
          return NextResponse.redirect(
            new URL(DEFAULT_LOGIN_REDIRECT, request.nextUrl)
          );
        }
      }
    } else {
      const response = NextResponse.redirect(
        new URL(DEFAULT_LOGOUT_REDIRECT, request.url)
      );
      response.cookies.delete("sid");
      return response;
    }
  } else if (isAuthRoute) {
    if (user) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, request.nextUrl)
      );
    }
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
