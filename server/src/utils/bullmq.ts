import { Queue, Worker } from "bullmq";

import { redisClient } from "@/redis/connection";
import { sendAlarmSocketSender, sendTimerSocketSender } from "@/socket/alarm";
import { Alarm, Timer } from "@/schemas/clock";

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

export const clockQueue = new Queue("clockQueue", {
  connection: redisClient,
});

export const initWorker = () => {
  //alarm worker
  new Worker(
    "clockQueue",
    async (job) => {
      if (job.name == "alarm-job") {
        const data = job.data as { departmentIds: string[]; alarm: Alarm };
        sendAlarmSocketSender(data.departmentIds, data.alarm);
      } else if (job.name == "timer-job") {
        const data = job.data as { departmentIds: string[]; timer: Timer };
        sendTimerSocketSender(data.departmentIds, data.timer);
      }
    },
    {
      connection: redisClient,
    }
  );
};
