import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

const publicPages = ["/", "/auth/signin", "/auth/signup"];
const adminPages = ["/dashboard"];

const authMiddleware = withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const publicPathnameRegex = RegExp(
        `^(${adminPages.map((p) => p.replace("/", "\\/") + "/?").join("|")})$`,
        "i"
      );
      const path = req.nextUrl.pathname;
      const isAdminPage = publicPathnameRegex.test(path);
      // Validate that admin only area for logged in user
      if (token?.role !== "admin" && isAdminPage) {
        return false;
      }

      return !!token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(${publicPages.map((p) => p.replace("/", "\\/") + "/?").join("|")})$`,
    "i"
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return NextResponse.next();
  } else {
    return (authMiddleware as any)(req);
  }
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
