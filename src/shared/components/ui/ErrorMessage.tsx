import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  variant?: "default" | "card";
}

export function ErrorMessage({
  message,
  onRetry,
  variant = "default",
}: ErrorMessageProps) {
  const containerClass =
    variant === "card" ? "bg-white rounded-lg shadow-md p-8" : "py-12";

  return (
    <div className={`text-center ${containerClass}`}>
      <div className="flex justify-center mb-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <p className="text-red-600 text-lg mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}
