import { Alarm, Timer } from "@/schemas/clock";
import SocketServer from "./init";

export const sendAlarmSocketSender = (
  departmentIds: string[],
  alarm: Alarm
) => {
  const factoryNamespace = SocketServer.getInstance().of("/department");
  for (const id of departmentIds) {
    factoryNamespace.to(id).emit("alarm", alarm);
  }
};

export const sendTimerSocketSender = (
  departmentIds: string[],
  timer: Timer
) => {
  const factoryNamespace = SocketServer.getInstance().of("/department");
  for (const id of departmentIds) {
    factoryNamespace.to(id).emit("timer", timer);
  }
};
