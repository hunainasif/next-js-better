import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicRoute = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  const isProtectedRoute = !isPublicRoute;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.warn(
        "NEXT_PUBLIC_API_URL is not set. Middleware will treat requests as unauthenticated.",
      );
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return NextResponse.next();
    }

    // Forward cookies to your backend to validate session
    const res = await fetch(`${apiUrl}/api/me`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
      cache: "no-store",
    });

    // If backend says unauthenticated -> redirect to login for protected routes
    if (!res.ok) {
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return NextResponse.next();
    }

    const session = await res.json();
    console.log(`[Middleware] Session:`, session);
    const isLoggedIn = !!session?.user;
    const userRole = session?.user?.role as string | undefined;

    // Not logged in and trying to access protected route
    if (!isLoggedIn && isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Logged in but on a public route -> send to role home
    if (isLoggedIn && isPublicRoute && userRole) {
      return NextResponse.redirect(new URL(`/${userRole}`, request.url));
    }

    // Logged in and on a protected route but not within the role namespace -> redirect
    if (isLoggedIn && isProtectedRoute && userRole) {
      if (!pathname.startsWith(`/${userRole}`)) {
        return NextResponse.redirect(new URL(`/${userRole}`, request.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error("[Middleware] Error:", err);
    // On error, be conservative: redirect to login for protected routes
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)"],
};
