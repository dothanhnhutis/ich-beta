import { CreateAlarmData, CreateTimerData } from "@/schemas/clock";
import prisma from "./db";

export async function CreateAlarm(data: CreateAlarmData) {
  return await prisma.alarms.create({
    data,
  });
}

export async function CreateTimer(data: CreateTimerData) {
  return await prisma.timers.create({
    data,
  });
}
