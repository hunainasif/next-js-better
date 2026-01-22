import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, admin, user, member, client, creator } from "./access-control";
import { jwtClient } from "better-auth/client/plugins";
import { customSessionClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  fetchOptions: {
    credentials: "include", // crucial for cookies
  },
  plugins: [
    adminClient({
      ac,
      roles: {
        admin,
        user,
        member,
        client,
        creator,
      },
    }),
    jwtClient(),
  ],
});
export const betterAuthCookieName = "better-auth.session_token";
