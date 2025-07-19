import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface NavigationGuardOptions {
  hasUnsavedChanges: boolean;
  message?: string;
}

export function useNavigationGuard({
  hasUnsavedChanges,
  message = "Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?",
}: NavigationGuardOptions) {
  const router = useRouter();

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    // Proteger contra cierre de ventana/pestaña
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    // Proteger contra navegación del navegador (back/forward)
    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges) {
        const confirmExit = window.confirm(message);
        if (!confirmExit) {
          // Pushear el estado actual de nuevo para cancelar la navegación
          window.history.pushState(null, "", window.location.href);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges, message]);
}
