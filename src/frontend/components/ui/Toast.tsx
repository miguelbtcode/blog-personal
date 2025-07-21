"use client";

import * as React from "react";
import { X, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// Context para manejar toasts
type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  duration?: number;
};

type ToastContextType = {
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => void;
  success: (title: string, description?: string, duration?: number) => void;
  error: (title: string, description?: string, duration?: number) => void;
  warning: (title: string, description?: string, duration?: number) => void;
  info: (title: string, description?: string, duration?: number) => void;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

// Hook para usar toasts
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Provider mejorado
function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = toast.duration || 5000;

    setToasts((prev) => [...prev, { ...toast, id }]);

    // Auto dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const success = React.useCallback(
    (title: string, description?: string, duration = 3000) => {
      addToast({ title, description, variant: "success", duration });
    },
    [addToast]
  );

  const error = React.useCallback(
    (title: string, description?: string, duration = 5000) => {
      addToast({ title, description, variant: "destructive", duration });
    },
    [addToast]
  );

  const warning = React.useCallback(
    (title: string, description?: string, duration = 4000) => {
      addToast({ title, description, variant: "warning", duration });
    },
    [addToast]
  );

  const info = React.useCallback(
    (title: string, description?: string, duration = 4000) => {
      addToast({ title, description, variant: "info", duration });
    },
    [addToast]
  );

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        toast: addToast,
        success,
        error,
        warning,
        info,
        dismiss,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

// Componente Toast Individual mejorado
const ToastItem = React.forwardRef<
  HTMLDivElement,
  Toast & { onDismiss: () => void }
>(
  (
    {
      id,
      title,
      description,
      variant = "default",
      action,
      onDismiss,
      duration = 5000,
    },
    ref
  ) => {
    const [progress, setProgress] = React.useState(100);
    const [isExiting, setIsExiting] = React.useState(false);

    // Animación de progreso
    React.useEffect(() => {
      const startTime = Date.now();
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        const percentage = (remaining / duration) * 100;
        setProgress(percentage);

        if (remaining > 0) {
          requestAnimationFrame(updateProgress);
        }
      };
      updateProgress();
    }, [duration]);

    const handleClose = () => {
      setIsExiting(true);
      setTimeout(onDismiss, 300);
    };

    const getVariantStyles = () => {
      switch (variant) {
        case "success":
          return {
            container: "border-green-200/50 bg-white/95 ring-green-500/10",
            progress: "bg-gradient-to-r from-green-400 to-green-600",
            icon: <CheckCircle className="w-5 h-5 text-green-600" />,
            iconBg: "bg-green-100",
            title: "text-green-900",
            description: "text-green-700",
          };
        case "destructive":
          return {
            container: "border-red-200/50 bg-white/95 ring-red-500/10",
            progress: "bg-gradient-to-r from-red-400 to-red-600",
            icon: <XCircle className="w-5 h-5 text-red-600" />,
            iconBg: "bg-red-100",
            title: "text-red-900",
            description: "text-red-700",
          };
        case "warning":
          return {
            container: "border-amber-200/50 bg-white/95 ring-amber-500/10",
            progress: "bg-gradient-to-r from-amber-400 to-amber-600",
            icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
            iconBg: "bg-amber-100",
            title: "text-amber-900",
            description: "text-amber-700",
          };
        case "info":
          return {
            container: "border-blue-200/50 bg-white/95 ring-blue-500/10",
            progress: "bg-gradient-to-r from-blue-400 to-blue-600",
            icon: <Info className="w-5 h-5 text-blue-600" />,
            iconBg: "bg-blue-100",
            title: "text-blue-900",
            description: "text-blue-700",
          };
        default:
          return {
            container: "border-gray-200/50 bg-white/95 ring-gray-500/10",
            progress: "bg-gradient-to-r from-gray-400 to-gray-600",
            icon: <Info className="w-5 h-5 text-gray-600" />,
            iconBg: "bg-gray-100",
            title: "text-gray-900",
            description: "text-gray-700",
          };
      }
    };

    const styles = getVariantStyles();

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl border backdrop-blur-sm shadow-lg ring-1 transition-all duration-300 ease-out mb-3",
          "min-w-[320px] max-w-[400px]",
          styles.container,
          isExiting
            ? "animate-out slide-out-to-right-full fade-out duration-300"
            : "animate-in slide-in-from-right-full fade-in duration-300"
        )}
      >
        {/* Barra de progreso */}
        <div
          className={cn(
            "absolute top-0 left-0 h-1 transition-all duration-100 ease-linear",
            styles.progress
          )}
          style={{ width: `${progress}%` }}
        />

        {/* Contenido */}
        <div className="flex items-start gap-3 p-4">
          {/* Icono animado */}
          <div className="flex-shrink-0 relative">
            <div className="relative">
              {variant === "success" && (
                <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" />
              )}
              <div
                className={cn(
                  "relative rounded-full p-2 shadow-sm",
                  styles.iconBg
                )}
              >
                <div className="animate-in zoom-in duration-300">
                  {styles.icon}
                </div>
              </div>
            </div>
          </div>

          {/* Texto */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4
                className={cn(
                  "text-sm font-semibold animate-in slide-in-from-left duration-200",
                  styles.title
                )}
              >
                {title}
              </h4>
            )}
            {description && (
              <p
                className={cn(
                  "text-sm mt-1 animate-in slide-in-from-left duration-300 delay-75",
                  styles.description
                )}
              >
                {description}
              </p>
            )}
            {action && <div className="mt-2">{action}</div>}
          </div>

          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Efecto shimmer para success */}
        {variant === "success" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
        )}
      </div>
    );
  }
);
ToastItem.displayName = "ToastItem";

// Componente Toaster que renderiza todos los toasts
export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            {...toast}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Componentes legacy para compatibilidad
const ToastComponent = ToastItem;
const ToastAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = "ToastAction";

const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 group-hover:opacity-100",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
));
ToastClose.displayName = "ToastClose";

const ToastTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
));
ToastDescription.displayName = "ToastDescription";

export {
  type Toast,
  ToastProvider,
  ToastComponent,
  ToastAction,
  ToastClose,
  ToastTitle,
  ToastDescription,
};
