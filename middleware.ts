import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas que requieren autenticación
const protectedPaths = ["/todos"];
// Rutas públicas (login y registro)
const publicPaths = ["/", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // Si la ruta requiere autenticación y no hay token, redirigir al login
  if (protectedPaths.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Si hay token y estamos en una ruta pública, redirigir a /todos
  if (token && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/todos", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};