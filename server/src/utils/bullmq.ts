import { Queue, Worker } from "bullmq";

import { redisClient } from "@/redis/connection";
import { sendAlarmSocketSender } from "@/socket/alarm";
import { Alarm } from "@/schemas/clock";

export const convertTimerRepeatToCronJob = (time: string, repeat: string[]) => {
  const daysMap: Record<string, number> = {
    t2: 0,
    t3: 1,
    t4: 2,
    t5: 3,
    t6: 4,
    t7: 5,
    cn: 6,
  };
  const days = repeat.map((day) => daysMap[day]).join(",");
  const [hour, minute] = time.split(":").map(Number);

  return `${minute} ${hour} * * ${days || "*"}`;
};

export const alarmQueue = new Queue("alarmQueue", {
  connection: redisClient,
});

export const initWorker = () => {
  //alarm worker
  new Worker<{ departmentIds: string[]; alarm: Alarm }>(
    "alarmQueue",
    async (job) => {
      sendAlarmSocketSender(job.data.departmentIds, job.data.alarm);
    },
    {
      connection: redisClient,
    }
  );
};
