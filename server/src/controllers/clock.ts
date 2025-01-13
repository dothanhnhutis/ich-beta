import { BadRequestError } from "@/error-handler";
import { CreateAlarmReq, CreateTimerReq } from "@/schemas/clock";
import { createAlarm, createTimer } from "@/services/clock";
import { getDepartmentById } from "@/services/department";
import { clockQueue, convertTimerRepeatToCronJob } from "@/utils/bullmq";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function createAlarmHandler(
  req: Request<{}, {}, CreateAlarmReq["body"]>,
  res: Response
) {
  const { id } = req.user!;

  for (const departmentId of req.body.departmentIds) {
    const department = await getDepartmentById(departmentId);
    if (department) continue;
    throw new BadRequestError(`Mã phòng ban id=${departmentId} không tồn tại`);
  }

  const alarm = await createAlarm({
    ...req.body,
    userId: id,
  });

  const cronExpression = convertTimerRepeatToCronJob(
    req.body.time,
    req.body.repeat
  );

  if (alarm.enable)
    await clockQueue.upsertJobScheduler(
      alarm.id,
      {
        pattern: cronExpression,
        startDate: alarm.createdAt,
      },
      {
        name: "alarm-job",
        data: { alarm, departmentIds: req.body.departmentIds },
      }
    );

  return res.status(StatusCodes.OK).json({
    message: "Tạo báo thức thành công",
    alarm,
  });
}

export async function createTimerHandler(
  req: Request<{}, {}, CreateTimerReq["body"]>,
  res: Response
) {
  const { id } = req.user!;
  const body = req.body;

  for (const departmentId of req.body.departmentIds) {
    const department = await getDepartmentById(departmentId);
    if (department) continue;
    throw new BadRequestError(`Mã phòng ban id=${departmentId} không tồn tại`);
  }

  const timer = await createTimer({
    ...req.body,
    userId: id,
  });

  // if (timer.status == )
  // await clockQueue.add("timer-job", "hihi", {
  //   delay: 5000,
  // });

  return res.status(StatusCodes.OK).json({
    message: "Tạo bộ đếm thành công",
    // timer,
  });
}
