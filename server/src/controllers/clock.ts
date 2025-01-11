import { CreateAlarmReq } from "@/schemas/clock";
import { alarmQueue } from "@/utils/bullmq";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function createAlarmHandler(
  req: Request<{}, {}, CreateAlarmReq["body"]>,
  res: Response
) {
  const { id } = req.user!;
  const body = req.body;

  // await alarmQueue.add("testname", { message: "oker" });
  // await alarmQueue.upsertJobScheduler(
  //   "test1",
  //   {
  //     pattern: "*/10 * * * * *",
  //   },
  //   {
  //     opts: {
  //       removeOnComplete: 1,
  //     },
  //     name: "cron-job",
  //     data: { message: "oker" },
  //   }
  // );

  const scheduler = await alarmQueue.getJobSchedulersCount();
  console.log(scheduler);
  // console.log("Current job scheduler:", scheduler);
  // const isSuccess = await alarmQueue.removeJobScheduler("test1");
  return res.status(StatusCodes.OK).send("isSuccess");
}
