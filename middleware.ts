import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // Verificar rutas admin
    if (pathname.startsWith("/admin")) {
      // Permitir acceso a la página de login admin
      if (pathname === "/admin" || pathname === "/admin/login") {
        // Si ya está autenticado como admin, redirigir al dashboard
        if (token?.role === "ADMIN") {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
        return NextResponse.next();
      }

      // Para todas las demás rutas admin, verificar que sea admin
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Las rutas admin requieren autenticación
        if (pathname.startsWith("/admin")) {
          // Permitir acceso a la página de login sin token
          if (pathname === "/admin" || pathname === "/admin/login") {
            return true;
          }
          // Para otras rutas admin, requerir token
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
