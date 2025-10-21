// This file contains the logic for connecting to a Redis server.

import { createClient } from "redis";

// The URL for the Redis server. It defaults to redis://localhost:6379 if the REDIS_URL environment variable is not set.
const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";

// The Redis client instance.
export const redisClient = createClient({
  url: redisUrl
});

// An event listener that logs any errors that occur with the Redis client.
redisClient.on("error", (err) => {
  console.error("Redis connection error", err);
});

// A promise that resolves when the Redis client is connected.
let connectPromise: Promise<void> | null = null;

/**
 * Connects to the Redis server.
 * @returns A promise that resolves to true if the connection is successful, and false otherwise.
 */
export const connectRedis = async (): Promise<boolean> => {
  // If the client is already open, return true.
  if (redisClient.isOpen) {
    return true;
  }

  // If there is no existing connection promise, create one.
  if (!connectPromise) {
    connectPromise = redisClient
      .connect()
      .catch((err) => {
        // If the connection fails, log a warning.
        console.warn("Failed to connect to Redis", err);
      })
      .finally(() => {
        // Reset the connection promise once the connection is established or has failed.
        connectPromise = null;
      }) as Promise<void>;
  }

  // Wait for the connection to be established.
  await connectPromise;
  // Return true if the client is open, and false otherwise.
  return redisClient.isOpen;
};

/**
 * Disconnects from the Redis server.
 */
export const disconnectRedis = async () => {
  // If the client is open, destroy it.
  if (redisClient.isOpen) {
    redisClient.destroy();
  }
};