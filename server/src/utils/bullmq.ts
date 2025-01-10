import { Queue, Worker } from "bullmq";

import { redisClient } from "@/redis/connection";

export const myFirstQueue = new Queue("myFirstQueue", {
  connection: redisClient,
});

export const initWorker = () => {
  new Worker(
    "myFirstQueue",
    async (job) => {
      console.log(job);
    },
    {
      connection: redisClient,
    }
  );
};
