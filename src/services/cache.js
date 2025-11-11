// Simple client-side cache for reducing IPC calls

class CacheService {
  constructor() {
    this.cache = new Map();
    this.expiryTimes = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
  }

  // Get item from cache
  get(key) {
    const expiry = this.expiryTimes.get(key);
    
    if (!expiry || Date.now() > expiry) {
      this.delete(key);
      return null;
    }

    return this.cache.get(key);
  }

  // Set item in cache
  set(key, value, ttl = this.defaultTTL) {
    this.cache.set(key, value);
    this.expiryTimes.set(key, Date.now() + ttl);
  }

  // Delete item from cache
  delete(key) {
    this.cache.delete(key);
    this.expiryTimes.delete(key);
  }

  // Check if key exists and is valid
  has(key) {
    return this.get(key) !== null;
  }

  // Clear all cache
  clear() {
    this.cache.clear();
    this.expiryTimes.clear();
  }

  // Clear expired items
  clearExpired() {
    const now = Date.now();
    
    for (const [key, expiry] of this.expiryTimes.entries()) {
      if (now > expiry) {
        this.delete(key);
      }
    }
  }

  // Get cache size
  size() {
    return this.cache.size;
  }

  // Get all keys
  keys() {
    return Array.from(this.cache.keys());
  }

  // Cache wrapper for async functions
  async wrap(key, fetchFn, ttl = this.defaultTTL) {
    // Check cache first
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch and cache
    const data = await fetchFn();
    this.set(key, data, ttl);
    return data;
  }

  // Invalidate cache by pattern
  invalidatePattern(pattern) {
    const regex = new RegExp(pattern);
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.delete(key);
      }
    }
  }

  // Get cache stats
  getStats() {
    const now = Date.now();
    let validCount = 0;
    let expiredCount = 0;

    for (const [key, expiry] of this.expiryTimes.entries()) {
      if (now > expiry) {
        expiredCount++;
      } else {
        validCount++;
      }
    }

    return {
      total: this.cache.size,
      valid: validCount,
      expired: expiredCount,
      hitRate: this.hitCount / (this.hitCount + this.missCount) || 0
    };
  }
}

// Export singleton instance
const cacheService = new CacheService();

// Auto-cleanup every 5 minutes
setInterval(() => {
  cacheService.clearExpired();
}, 5 * 60 * 1000);

export default cacheService;