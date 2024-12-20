import prisma from "./db";
import { CreateDisplayReq, UpdateDisplayByIdReq } from "@/schemas/display";

export async function createDisplayService(
  input: CreateDisplayReq["body"] & { userId: string }
) {
  const { departmentIds, ...data } = input;

  const display = await prisma.displays.create({
    data: {
      ...data,
      departmentsDisplays: {
        createMany: {
          data: departmentIds.map((d) => ({ departmentId: d })),
        },
      },
    },
    include: {
      departmentsDisplays: {
        select: {
          department: true,
        },
      },
    },
  });

  const departments = display.departmentsDisplays.map((d) => d.department);
  const { departmentsDisplays, ...props } = display;
  return { ...props, departments };
}

export async function updateDisplayService(
  displayId: string,
  input: Omit<UpdateDisplayByIdReq["body"], "departmentIds">
) {
  const display = await prisma.displays.update({
    where: {
      id: displayId,
    },
    data: input,
    include: {
      departmentsDisplays: {
        select: {
          department: true,
        },
      },
    },
  });

  const departments = display.departmentsDisplays.map((d) => d.department);
  const { departmentsDisplays, ...props } = display;
  return { ...props, departments };
}

export async function getDisplayByIdService(displayId: string) {
  const display = await prisma.displays.findUnique({
    where: {
      id: displayId,
    },
    include: {
      departmentsDisplays: {
        select: {
          department: true,
        },
      },
    },
  });

  if (!display) return;
  const departments = display.departmentsDisplays.map((d) => d.department);
  const { departmentsDisplays, ...props } = display;
  return { ...props, departments };
}

export async function getDisplaysService() {
  const displays = await prisma.displays.findMany({
    include: {
      departmentsDisplays: {
        select: {
          department: true,
        },
      },
    },
  });

  return displays.map(({ departmentsDisplays, ...props }) => {
    const departments = departmentsDisplays.map((d) => d.department);
    return { ...props, departments };
  });
}

export async function createOrDeleteDisplaysService(
  displayId: string,
  departments: string[]
) {
  await prisma.departmentsDisplays.deleteMany({
    where: {
      displayId,
      departmentId: { notIn: departments },
    },
  });

  await prisma.departmentsDisplays.createMany({
    data: departments.map((departmentId) => ({
      departmentId,
      displayId,
    })),
    skipDuplicates: true,
  });
}

export async function deleteDisplayByIdService(displayId: string) {
  const display = await prisma.displays.delete({
    where: {
      id: displayId,
    },
  });

  return display;
}
