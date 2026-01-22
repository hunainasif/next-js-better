import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/forgot", "/reset", "/set"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`[Middleware] Processing path: ${pathname}`);

  const isPublicRoute = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  const isProtectedRoute = !isPublicRoute;

  console.log(
    `[Middleware] Is public route: ${isPublicRoute}, Is protected: ${isProtectedRoute}`,
  );

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.warn(
        "[Middleware] NEXT_PUBLIC_API_URL is not set. Middleware will treat requests as unauthenticated.",
      );
      if (isProtectedRoute) {
        console.log("[Middleware] Redirecting to /login (no API URL)");
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return NextResponse.next();
    }

    const cookies = request.headers.get("cookie") || "";
    console.log(`[Middleware] Cookies present: ${cookies ? "YES" : "NO"}`);
    console.log(`[Middleware] Cookie value: ${cookies.substring(0, 100)}...`);

    // Forward cookies to your backend to validate session
    const res = await fetch(`${apiUrl}/api/me`, {
      headers: {
        cookie: cookies,
      },
      credentials: "include",
      cache: "no-store",
    });

    console.log(`[Middleware] Auth check response status: ${res.status}`);

    // If backend says unauthenticated -> redirect to login for protected routes
    if (!res.ok) {
      console.log(`[Middleware] Auth check failed with status ${res.status}`);
      if (isProtectedRoute) {
        console.log("[Middleware] Redirecting to /login (auth failed)");
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return NextResponse.next();
    }

    const session = await res.json();
    console.log(`[Middleware] Session data:`, JSON.stringify(session, null, 2));
    const isLoggedIn = !!session?.user;
    const userRole = (session?.user as any)?.role as string | undefined;

    console.log(
      `[Middleware] Is logged in: ${isLoggedIn}, User role: ${userRole}`,
    );

    // Not logged in and trying to access protected route
    if (!isLoggedIn && isProtectedRoute) {
      console.log("[Middleware] Redirecting to /login (not logged in)");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Logged in but on a public route -> send to role home
    if (isLoggedIn && isPublicRoute && userRole) {
      console.log(
        `[Middleware] Redirecting logged-in user from ${pathname} to /${userRole}`,
      );
      return NextResponse.redirect(new URL(`/${userRole}`, request.url));
    }

    // Logged in and on a protected route but not within the role namespace -> redirect
    if (isLoggedIn && isProtectedRoute && userRole) {
      if (!pathname.startsWith(`/${userRole}`)) {
        console.log(
          `[Middleware] Redirecting to correct role path: /${userRole}`,
        );
        return NextResponse.redirect(new URL(`/${userRole}`, request.url));
      }
    }

    console.log("[Middleware] Allowing request to proceed");
    return NextResponse.next();
  } catch (err) {
    console.error("[Middleware] Error:", err);
    // On error, be conservative: redirect to login for protected routes
    if (isProtectedRoute) {
      console.log("[Middleware] Redirecting to /login (error occurred)");
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)"],
};
