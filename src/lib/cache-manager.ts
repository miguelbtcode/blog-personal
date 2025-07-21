import { LRUCache } from "lru-cache";

interface CacheConfig {
  ttl: number;
  max: number;
  updateAgeOnGet?: boolean;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
}

export class CacheManager {
  private static instances = new Map<string, LRUCache<string, any>>();
  private static stats = new Map<string, CacheStats>();

  // Configuraciones predefinidas
  private static configs = {
    posts: { ttl: 1000 * 60 * 5, max: 100 }, // 5 minutos, 100 posts
    postLists: { ttl: 1000 * 60 * 2, max: 50 }, // 2 minutos, 50 listas
    metadata: { ttl: 1000 * 60 * 30, max: 200 }, // 30 minutos, 200 entradas
    shortTerm: { ttl: 1000 * 30, max: 50 }, // 30 segundos, 50 entradas
  };

  static getCache(
    namespace: keyof typeof CacheManager.configs
  ): LRUCache<string, any> {
    if (!this.instances.has(namespace)) {
      const config = this.configs[namespace];
      const cache = new LRUCache(config);
      this.instances.set(namespace, cache);
      this.stats.set(namespace, { hits: 0, misses: 0, sets: 0, deletes: 0 });
    }
    return this.instances.get(namespace)!;
  }

  static get<T>(
    namespace: keyof typeof CacheManager.configs,
    key: string
  ): T | undefined {
    const cache = this.getCache(namespace);
    const stats = this.stats.get(namespace)!;

    const value = cache.get(key);
    if (value !== undefined) {
      stats.hits++;
      console.log(`🎯 Cache HIT: ${namespace}:${key}`);
      return value;
    } else {
      stats.misses++;
      console.log(`❌ Cache MISS: ${namespace}:${key}`);
      return undefined;
    }
  }

  static set<T>(
    namespace: keyof typeof CacheManager.configs,
    key: string,
    value: T
  ): void {
    const cache = this.getCache(namespace);
    const stats = this.stats.get(namespace)!;

    cache.set(key, value);
    stats.sets++;
    console.log(`💾 Cache SET: ${namespace}:${key}`);
  }

  static delete(
    namespace: keyof typeof CacheManager.configs,
    key: string
  ): boolean {
    const cache = this.getCache(namespace);
    const stats = this.stats.get(namespace)!;

    const deleted = cache.delete(key);
    if (deleted) {
      stats.deletes++;
      console.log(`🗑️ Cache DELETE: ${namespace}:${key}`);
    }
    return deleted;
  }

  static invalidatePattern(
    namespace: keyof typeof CacheManager.configs,
    pattern: string
  ): number {
    const cache = this.getCache(namespace);
    let deleted = 0;

    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
        deleted++;
      }
    }

    if (deleted > 0) {
      console.log(
        `🧹 Cache INVALIDATE: ${namespace} pattern "${pattern}" (${deleted} keys)`
      );
    }
    return deleted;
  }

  static clear(namespace?: keyof typeof CacheManager.configs): void {
    if (namespace) {
      this.getCache(namespace).clear();
      console.log(`🔄 Cache CLEAR: ${namespace}`);
    } else {
      for (const ns of Object.keys(this.configs)) {
        this.getCache(ns as any).clear();
      }
      console.log(`🔄 Cache CLEAR ALL`);
    }
  }

  static getStats(namespace?: keyof typeof CacheManager.configs) {
    if (namespace) {
      const stats = this.stats.get(namespace);
      const cache = this.getCache(namespace);
      return {
        ...stats,
        size: cache.size,
        hitRate: stats!.hits / (stats!.hits + stats!.misses) || 0,
      };
    }

    const allStats: Record<string, any> = {};
    for (const [ns, stats] of this.stats.entries()) {
      const cache = this.getCache(ns as any);
      allStats[ns] = {
        ...stats,
        size: cache.size,
        hitRate: stats.hits / (stats.hits + stats.misses) || 0,
      };
    }
    return allStats;
  }
}
