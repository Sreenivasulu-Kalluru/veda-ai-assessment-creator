import Redis from 'ioredis';

let redisClient: Redis;

export const connectRedis = async (): Promise<void> => {
  try {
    const redisURL = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = new Redis(redisURL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });

    redisClient.on('connect', () => {
      console.log('Redis connected successfully');
    });

    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
  }
};

export { redisClient };
