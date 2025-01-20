import {
  Alarm,
  AlarmAttributeFilter,
  CreateAlarmData,
  CreateTimerData,
  UpdateAlarmData,
} from "@/schemas/clock";
import prisma from "./db";

const alarmAttributeFilter = (alarm: AlarmAttributeFilter): Alarm => {
  const { departmentsAlarms, ...props } = alarm;
  const departments = departmentsAlarms.map(({ department }) => department);
  return { ...props, departments };
};

export async function createAlarm(data: CreateAlarmData) {
  const { departmentIds, ...props } = data;

  const alarm = await prisma.alarms.create({
    data: {
      ...props,
      departmentsAlarms: {
        createMany: {
          data: departmentIds.map((d) => ({ departmentId: d })),
        },
      },
    },
    include: {
      departmentsAlarms: {
        select: {
          department: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          email: true,
          picture: true,
          username: true,
        },
      },
    },
  });
  return alarmAttributeFilter(alarm);
}

export async function updateAlarmById(alarmId: string, data: UpdateAlarmData) {
  const { departmentIds, ...props } = data;
  const alarm = await prisma.alarms.update({
    where: { id: alarmId },
    data: props,
    include: {
      departmentsAlarms: {
        select: {
          department: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          email: true,
          picture: true,
          username: true,
        },
      },
    },
  });

  if (departmentIds) {
    const oldDepartmentsAlarms = await prisma.departmentsAlarms.findMany({
      where: {
        alarmId,
      },
    });
    const oldDepartments = oldDepartmentsAlarms.map(
      ({ departmentId }) => departmentId
    );

    const createList = departmentIds
      .filter((id) => !oldDepartments.includes(id))
      .map((id) => ({
        departmentId: id,
        alarmId,
      }));
    const deleteList = oldDepartments.filter(
      (id) => !departmentIds.includes(id)
    );

    const createDepartmentsAlarms = prisma.departmentsAlarms.createMany({
      data: createList,
    });
    const deleteDepartmentsAlarms = prisma.departmentsAlarms.deleteMany({
      where: {
        alarmId,
        departmentId: { in: deleteList },
      },
    });
    await Promise.all([createDepartmentsAlarms, deleteDepartmentsAlarms]);
  }
  return alarmAttributeFilter(alarm);
}

export async function getAlarms() {
  return prisma.alarms.findMany({});
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
