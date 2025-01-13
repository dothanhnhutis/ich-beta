import { BadRequestError, PermissionError } from "@/error-handler";
import { hasPermission } from "@/middlewares/checkPermission";
import { CreateAlarmReq, CreateTimerReq } from "@/schemas/clock";
import {
  createAlarm,
  createTimer,
  deleteAlarmById,
  getAlarmById,
} from "@/services/clock";
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

export async function deleteAlarmHandler(
  req: Request<{ alarmId: string }>,
  res: Response
) {
  const { alarmId } = req.params;
  const { id } = req.user!;

  const alarm = await getAlarmById(alarmId);

  const isValidAccess = hasPermission(req.user, "delete:alarms");
  if (!isValidAccess && alarm?.userId != id) throw new PermissionError();

  if (!alarm) throw new BadRequestError(`Báo thức id=${alarmId} không tồn tại`);

  await deleteAlarmById(alarmId);

  const alarmCronJob = await clockQueue.getJobScheduler(alarm.id);

  if (alarmCronJob) {
    await clockQueue.removeJobScheduler(alarm.id);
  }

  res.status(StatusCodes.OK).json({
    message: "Xoá báo thức thành công",
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
