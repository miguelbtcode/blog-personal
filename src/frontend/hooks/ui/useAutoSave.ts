// hooks/useAutoSave.ts
import { useEffect, useRef } from "react";

interface AutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => void;
  delay?: number; // milliseconds
  enabled?: boolean;
}

export function useAutoSave<T>({
  data,
  onSave,
  delay = 2000, // 2 segundos por defecto
  enabled = true,
}: AutoSaveOptions<T>) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const dataRef = useRef<T>(data);

  useEffect(() => {
    if (!enabled) return;

    // Solo guardar si los datos han cambiado
    if (JSON.stringify(data) === JSON.stringify(dataRef.current)) {
      return;
    }

    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Configurar nuevo timeout
    timeoutRef.current = setTimeout(() => {
      onSave(data);
      dataRef.current = data;
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, onSave, delay, enabled]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
}
