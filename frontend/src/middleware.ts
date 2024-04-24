import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { UserRoles } from "./constants/UserRoles";

const publicPages = ["/", "/auth/signin", "/auth/signup"];
const adminPages = ["/dashboard"];
const applicantPages = ["/jobs"];

const authMiddleware = withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const adminPathnameRegex = RegExp(
        `^(${adminPages.map((p) => p.replace("/", "\\/") + "/?").join("|")})$`,
        "i"
      );
      const applicantPathnameRegex = RegExp(
        `^(${applicantPages
          .map((p) => p.replace("/", "\\/") + "/?")
          .join("|")})$`,
        "i"
      );
      const path = req.nextUrl.pathname;
      const isAdminPage = adminPathnameRegex.test(path);
      const isApplicantPage = applicantPathnameRegex.test(path);
      // Validate that admin only area for logged in user
      if (token?.role === UserRoles.APPLICANT && isAdminPage) {
        return false;
      }

      if (token?.role === UserRoles.ADMIN && isApplicantPage) {
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
