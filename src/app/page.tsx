import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      credentials: "include",
      headers: await headers(),
    },
  });
  console.log("Client session:", session);

  return <div>{session ? `Welcome ${session}` : "Not logged in"}</div>;
}
