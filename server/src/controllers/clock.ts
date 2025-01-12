import { BadRequestError } from "@/error-handler";
import { CreateAlarmReq } from "@/schemas/clock";
import { createAlarm } from "@/services/clock";
import { getDepartmentById } from "@/services/department";
import { alarmQueue, convertTimerRepeatToCronJob } from "@/utils/bullmq";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function createAlarmHandler(
  req: Request<{}, {}, CreateAlarmReq["body"]>,
  res: Response
) {
  const { id } = req.user!;
  const body = req.body;
  console.log(body);

  for (const departmentId of req.body.departmentIds) {
    const department = await getDepartmentById(departmentId);
    if (department) continue;
    throw new BadRequestError(`Mã phòng ban id=${departmentId} không tồn tại`);
  }

  const alarm = await createAlarm({
    ...req.body,
    userId: req.user!.id,
  });

  const cronExpression = convertTimerRepeatToCronJob(
    req.body.time,
    req.body.repeat
  );

  // await alarmQueue.add("testname", { message: "oker" });
  await alarmQueue.upsertJobScheduler(
    alarm.id,
    {
      pattern: cronExpression,
    },
    {
      name: "alarm-job",
      data: { alarm, departmentIds: req.body.departmentIds },
    }
  );

  // const scheduler = await alarmQueue.getJobSchedulersCount();
  // console.log(scheduler);
  // // console.log("Current job scheduler:", scheduler);
  // // const isSuccess = await alarmQueue.removeJobScheduler("test1");
  return res.status(StatusCodes.OK).json({
    message: "Tạo báo động thành công",
    alarm,
  });
}
