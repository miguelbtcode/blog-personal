import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAdmin = session?.user?.role === "ADMIN";
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin");
    }
    if (!isLoading && isAuthenticated && !isAdmin) {
      router.push("/admin");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  return {
    session,
    isAdmin,
    isLoading,
    isAuthenticated,
    user: session?.user,
  };
}

// Hook para páginas que requieren autenticación admin
export function useRequireAdmin() {
  const { isAdmin, isLoading, isAuthenticated } = useAdmin();

  if (isLoading) {
    return { isLoading: true, isAdmin: false };
  }

  if (!isAuthenticated || !isAdmin) {
    return { isLoading: false, isAdmin: false };
  }

  return { isLoading: false, isAdmin: true };
}
