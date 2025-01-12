import { CreateAlarmData, CreateTimerData } from "@/schemas/clock";
import prisma from "./db";

export async function createAlarm(data: CreateAlarmData) {
  return await prisma.alarms.create({
    data,
  });
}

export async function createTimer(data: CreateTimerData) {
  return await prisma.timers.create({
    data,
  });
}
