import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

interface ExtendedUser extends User {
  role?: string;
  username?: string;
  token?: string;
}

interface ExtendedToken extends JWT {
  accessToken?: string;
  role?: string;
  username?: string;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        const isRegistration = (req as any).url?.includes('/auth/register');
        if (isRegistration) {
          const registrationRes = await fetch(
            `${process.env.NESTJS_BACKEND_URL}/auth/register`,
            {
              method: "POST",
              body: JSON.stringify({
                username: credentials?.username,
                password: credentials?.password,
              }),
              headers: { "Content-Type": "application/json" },
            }
          );

          if (registrationRes.ok) {
            const loginRes = await fetch(
              `${process.env.NESTJS_BACKEND_URL}/auth/login`,
              {
                method: "POST",
                body: JSON.stringify({
                  username: credentials?.username,
                  password: credentials?.password,
                }),
                headers: { "Content-Type": "application/json" },
              }
            );

            const user = await loginRes.json();

            if (loginRes.ok && user) {
              return Promise.resolve(user);
            }
          } else {
            // Handle registration failure
            const registrationError = await registrationRes.json();
            return Promise.resolve(null);
          }
        } else {
          const loginRes = await fetch(
            `${process.env.NESTJS_BACKEND_URL}/auth/login`,
            {
              method: "POST",
              body: JSON.stringify({
                username: credentials?.username,
                password: credentials?.password,
              }),
              headers: { "Content-Type": "application/json" },
            }
          );

          const user = await loginRes.json();

          if (loginRes.ok && user) {
            return Promise.resolve(user);
          }
        }

        // Return null if user data could not be retrieved
        return Promise.resolve(null);
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      const userWithToken = user as ExtendedUser;
      if (userWithToken) {
        token.accessToken = userWithToken.token;
        token.role = userWithToken.role;
        token.username = userWithToken.username;
      }
      return token;
    },
    async session({ session, token }) {
      const userWithToken = token as ExtendedToken;
      session.accessToken = userWithToken.accessToken;
      session.role = userWithToken.role;
      session.user = { name: userWithToken.username };
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});

export { handler as GET, handler as POST };

// interface ExtendedUser extends User {
//   token?: string;
//   role?: string;
//   username?: string;
// }

// interface ExtendedToken extends JWT {
//   accessToken?: string;
//   role?: string;
//   username?: string;
// }

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       authorize: async (credentials) => {
//         const res = await fetch(
//           `${process.env.NESTJS_BACKEND_URL}/auth/login`,
//           {
//             method: "POST",
//             body: JSON.stringify({
//               username: credentials?.username,
//               password: credentials?.password,
//             }),
//             headers: { "Content-Type": "application/json" },
//           }
//         );
//         const user = await res.json();

//         // If no error and we have user data, return it
//         if (res.ok && user) {
//           return user;
//         }
//         // Return null if user data could not be retrieved
//         return null;
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       // First time jwt callback is run, user object is available
//       const userWithToken = user as ExtendedUser;
//       if (userWithToken) {
//         token.accessToken = userWithToken.token;
//         token.role = userWithToken.role;
//         token.username = userWithToken.username;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       // The token parameter needs to be cast as the correct type
//       const userWithToken = token as ExtendedToken;
//       session.accessToken = userWithToken.accessToken;
//       session.role = userWithToken.role;
//       session.user = { name: userWithToken.username };
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/auth/signin", // Custom sign-in page
//     error: "/auth/error", // Error page
//   },
// } as NextAuthOptions);

// export { handler as GET, handler as POST };
