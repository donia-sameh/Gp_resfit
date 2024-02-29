// types/next-auth.d.ts

import "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session types from NextAuth.js to include the accessToken property.
   */
  interface Session {
    accessToken?: string;
    role?: string;
  }
}