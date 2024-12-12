import { CreateDisplayReq, UpdateDisplayByIdReq } from "@/schemas/display";
import prisma from "./db";

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
  });

  return display;
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
  });

  return display;
}

export async function getDisplayByIdService(displayId: string) {
  const display = await prisma.displays.findUnique({
    where: {
      id: displayId,
    },
  });

  if (!display) return;

  return display;
}

export async function getDisplaysService() {
  const display = await prisma.displays.findMany({});
  return display;
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
