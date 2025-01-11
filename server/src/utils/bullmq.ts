import { Queue, Worker } from "bullmq";

import { redisClient } from "@/redis/connection";

export const alarmQueue = new Queue("alarmQueue", {
  connection: redisClient,
});

export const initWorker = () => {
  //alarm worker
  new Worker(
    "alarmQueue",
    async (job) => {
      console.log(job);
    },
    {
      connection: redisClient,
    }
  );
};
