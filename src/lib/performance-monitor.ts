export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();
  private static isProduction = process.env.NODE_ENV === "production";

  static startTiming(label: string): () => number {
    const start = performance.now();

    return () => {
      const duration = performance.now() - start;
      this.recordMetric(label, duration);
      return duration;
    };
  }

  static recordMetric(label: string, value: number) {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }

    const values = this.metrics.get(label)!;
    values.push(value);

    // Mantener solo las últimas 100 mediciones
    if (values.length > 100) {
      values.shift();
    }

    // Log en desarrollo o métricas críticas
    if (!this.isProduction || value > 1000) {
      console.log(`⏱️ ${label}: ${value.toFixed(2)}ms`);
    }
  }

  static getMetrics(label?: string) {
    if (label) {
      const values = this.metrics.get(label) || [];
      return {
        count: values.length,
        avg: values.reduce((a, b) => a + b, 0) / values.length || 0,
        min: Math.min(...values) || 0,
        max: Math.max(...values) || 0,
        last: values[values.length - 1] || 0,
      };
    }

    const summary: Record<string, any> = {};
    for (const [key, values] of this.metrics.entries()) {
      summary[key] = {
        count: values.length,
        avg: values.reduce((a, b) => a + b, 0) / values.length || 0,
        min: Math.min(...values) || 0,
        max: Math.max(...values) || 0,
        last: values[values.length - 1] || 0,
      };
    }
    return summary;
  }

  static clearMetrics() {
    this.metrics.clear();
  }
}
