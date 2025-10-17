import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
      console.warn('REDIS_URL not configured. Cache will be disabled.');
      // Return a mock client that doesn't do anything
      return {
        get: async () => null,
        set: async () => 'OK',
        setex: async () => 'OK',
        del: async () => 1,
        quit: async () => 'OK',
        keys: async () => [],
        connect: async () => {},
        on: () => {},
      } as unknown as Redis;
    }
    
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: true,
      retryStrategy(times) {
        if (times > 3) {
          console.error('Redis connection failed after 3 attempts. Disabling cache.');
          return null; // Stop retrying
        }
        return Math.min(times * 50, 2000);
      },
    });
    
    // Try to connect but don't block
    redis.connect().catch((err) => {
      console.error('Redis connection error:', err.message);
      console.warn('Continuing without Redis cache...');
    });
    
    redis.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });
    
    redis.on('connect', () => {
      console.log('Redis Client Connected');
    });
  }
  
  return redis;
}

// Cache utility functions
export async function getCached<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const redis = getRedisClient();
  
  // If Redis is not available, just fetch data directly
  if (!redis || typeof redis.get !== 'function') {
    return fetcher();
  }
  
  try {
    const cached = await redis.get(key);
    if (cached) {
      // Parse with BigInt support
      return JSON.parse(cached, (key, value) => {
        // Try to convert string numbers back to BigInt if they look like timestamps
        if (typeof value === 'string' && /^\d{13,}$/.test(value)) {
          return BigInt(value);
        }
        return value;
      });
    }
  } catch (error) {
    console.error('Redis get error:', error);
  }
  
  const data = await fetcher();
  
  try {
    // Serialize with BigInt support
    const serialized = JSON.stringify(data, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
    await redis.setex(key, ttl, serialized);
  } catch (error) {
    console.error('Redis set error:', error);
  }
  
  return data;
}

export async function invalidateCache(pattern: string): Promise<void> {
  const redis = getRedisClient();
  
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('Redis invalidate error:', error);
  }
}

// Export function to close Redis connection
export async function closeRedisConnection(): Promise<void> {
  if (redis) {
    try {
      await redis.quit();
      console.log('Redis connection closed');
    } catch (error) {
      console.error('Error closing Redis connection:', error);
    }
  }
}

