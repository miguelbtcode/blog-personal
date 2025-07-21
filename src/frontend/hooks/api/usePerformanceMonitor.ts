import { useEffect, useRef } from "react";
import { PerformanceMonitor } from "@/lib/performance-monitor";

export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const mountTime = useRef<number>(0);

  useEffect(() => {
    // Medir tiempo de montaje
    mountTime.current = performance.now();

    return () => {
      if (mountTime.current) {
        const duration = performance.now() - mountTime.current;
        PerformanceMonitor.recordMetric(`${componentName}:lifetime`, duration);
      }
    };
  }, [componentName]);

  useEffect(() => {
    // Contar re-renders
    renderCount.current++;
    if (renderCount.current > 1) {
      PerformanceMonitor.recordMetric(
        `${componentName}:rerender`,
        renderCount.current
      );
    }
  });

  return {
    renderCount: renderCount.current,
    recordMetric: (label: string, value: number) =>
      PerformanceMonitor.recordMetric(`${componentName}:${label}`, value),
  };
}
