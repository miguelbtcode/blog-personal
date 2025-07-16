"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Si no hay sesión y no está en la página de login, redirigir
    if (status === "unauthenticated" && pathname !== "/admin") {
      router.push("/admin");
      return;
    }

    // Si hay sesión pero no es admin, redirigir a login
    if (
      status === "authenticated" &&
      session?.user?.role !== "ADMIN" &&
      pathname !== "/admin"
    ) {
      router.push("/admin");
      return;
    }

    // Si es admin y está en la página de login, redirigir al dashboard
    if (
      status === "authenticated" &&
      session?.user?.role === "ADMIN" &&
      pathname === "/admin"
    ) {
      router.push("/admin/dashboard");
    }
  }, [session, status, router, pathname]);

  // Mostrar loading mientras se verifica la sesión
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <div className="min-h-screen bg-gray-900">{children}</div>;
}
