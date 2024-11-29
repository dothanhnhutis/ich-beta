import Redis from "ioredis";
import env from "@/configs/env";

let redisClient: Redis, connectionTimeout: NodeJS.Timeout;

const REDIS_CONNECT_TIMEOUT = env.NODE_ENV == "development" ? 0 : 10000;

function handleTimeoutError() {
  connectionTimeout = setTimeout(() => {
    throw new Error("Redis reconnect time out");
  }, REDIS_CONNECT_TIMEOUT);
}

function handleEventConnect(redisClient: Redis) {
  redisClient.on("connect", () => {
    console.log("Redis connection status: connected");
    clearTimeout(connectionTimeout);
  });
  redisClient.on("end", () => {
    console.log("Redis connection status: disconnected");
    handleTimeoutError();
  });
  redisClient.on("reconnecting", () => {
    console.log("Redis connection status: reconnecting");
    clearTimeout(connectionTimeout);
  });
  redisClient.on("error", (err) => {
    console.log(`Redis connection status: error ${err}`);
    handleTimeoutError();
  });
}

export function initRedis(): void {
  const instanceRedis: Redis = new Redis(env.REDIS_HOST);
  redisClient = instanceRedis;
  handleEventConnect(redisClient);
  for (const s of ["SIGINT", "SIGTERM"]) {
    process.once(s, () => {
      redisClient.disconnect();
    });
  }
}
export { redisClient };
