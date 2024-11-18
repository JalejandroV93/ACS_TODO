import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || "your-secret-key"
);

// Add public paths that don't require authentication
const publicPaths = ["/", "/login", "/register"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  // Check if the path is public
  const isPublicPath = publicPaths.includes(pathname);

  // If user is logged in and trying to access public paths, redirect to /todos
  if (token && isPublicPath) {
    try {
      await jwtVerify(token, SECRET_KEY);
      return NextResponse.redirect(new URL("/todos", request.url));
    } catch {
      // If token is invalid, continue to public path
    }
  }

  // If path requires authentication
  if (!isPublicPath) {
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      // Add user ID to headers for API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("user-id", payload.userId as string);

      return NextResponse.next({
        headers: requestHeaders,
      });
    } catch (e) {
      console.error(e);
      // Redirect to login if token is invalid
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: ["/", "/todos/:path*", "/api/todos/:path*", "/register"],
};
