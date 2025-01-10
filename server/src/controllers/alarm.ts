import { myFirstQueue } from "@/utils/bullmq";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function createAlarmHandler(req: Request, res: Response) {
  // await myFirstQueue.add("testname", { message: "oker" });
  // await myFirstQueue.upsertJobScheduler(
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

  // const scheduler = await myFirstQueue.getJobScheduler(
  //   "fb73277b-17bd-43f2-b588-c8f89cb3b786"
  // );
  // console.log("Current job scheduler:", scheduler);
  const isSuccess = await myFirstQueue.remove("test1");
  return res.status(StatusCodes.OK).send(isSuccess);
}
