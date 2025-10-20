import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";

export const redisClient = createClient({
  url: redisUrl
});

redisClient.on("error", (err) => {
  console.error("Redis connection error", err);
});

let connectPromise: Promise<void> | null = null;

export const connectRedis = async (): Promise<boolean> => {
  if (redisClient.isOpen) {
    return true;
  }

  if (!connectPromise) {
    connectPromise = redisClient
      .connect()
      .catch((err) => {
        console.warn("Failed to connect to Redis", err);
      })
      .finally(() => {
        connectPromise = null;
      }) as Promise<void>;
  }

  await connectPromise;
  return redisClient.isOpen;
};

export const disconnectRedis = async () => {
  if (redisClient.isOpen) {
    redisClient.destroy();
  }
};
