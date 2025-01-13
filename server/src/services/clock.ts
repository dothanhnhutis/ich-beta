import { CreateAlarmData, CreateTimerData } from "@/schemas/clock";
import prisma from "./db";

export async function createAlarm(data: CreateAlarmData) {
  const { departmentIds, ...props } = data;

  return await prisma.alarms.create({
    data: {
      ...props,
      departmentsAlarms: {
        createMany: {
          data: departmentIds.map((d) => ({ departmentId: d })),
        },
      },
    },
  });
}

export async function getAlarmById(alarmId: string) {
  return prisma.alarms.findUnique({
    where: {
      id: alarmId,
    },
  });
}

export async function deleteAlarmById(alarmId: string) {
  prisma.alarms.delete({
    where: { id: alarmId },
  });
}

export async function createTimer(data: CreateTimerData) {
  const { departmentIds, ...props } = data;

  return await prisma.timers.create({
    data: {
      ...props,
      departmentsTimers: {
        createMany: {
          data: departmentIds.map((d) => ({ departmentId: d })),
        },
      },
    },
  });
}
