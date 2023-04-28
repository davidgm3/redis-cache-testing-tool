import { createClient } from 'redis';
import z from 'zod';

const urlSchema = z.string().url();
type urlString = z.infer<typeof urlSchema>;

export async function fetchApi(url: urlString) {
  // Validate URL
  if (!urlSchema.safeParse(url).success) {
    throw new Error('Error. Please provide a valid URL');
  }
  // Connect to Redis
  const redisClient = createClient({
    url: process.env.REDIS_URL,
  });
  redisClient.connect();

  // Initialize results
  const results: {
    cached: number[];
    uncached: number[];
  } = {
    cached: [],
    uncached: [],
  };

  // Take 10 samples
  for (let i = 0; i < 10; i++) {
    const start = Date.now();
    await fetch(url);
    const end = Date.now();
    const duration = end - start;
    results.uncached.push(duration);
    // cache the result
    await redisClient.set(url, 'true');

    const start2 = Date.now();
    // fetch the cached result
    await redisClient.get(url);
    const end2 = Date.now();
    const duration2 = end2 - start2;
    // delete the cached result
    redisClient.del(url);
    results.cached.push(duration2);
  }
  // Disconnect from Redis
  await redisClient.quit();
  return results;
}
