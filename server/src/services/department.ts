import prisma from "./db";

export async function getDepartmentsInListService(input: string[]) {
  const departments = await prisma.departments.findMany({
    where: {
      id: { in: input },
    },
  });

  return departments;
}

export async function getDepartmentsService() {
  const departments = await prisma.departments.findMany();
  return departments;
}

export async function getDepartmentByIdService(departmentId: string) {
  const department = await prisma.departments.findUnique({
    where: { id: departmentId },
  });
  if (!department) return;

  return department;
}

export async function getDisplaysOfDepartmentService(departmentId: string) {
  const departments = await prisma.departmentsDisplays.findMany({
    where: { departmentId },
  });

  const displayIds = departments.map((d) => d.displayId);

  const displays = await prisma.displays.findMany({
    where: { id: { in: displayIds }, enable: true },
    orderBy: [
      {
        priority: "desc",
      },
      {
        updatedAt: "desc",
      },
    ],
  });

  return displays;
}
export type Department = {
  id: string;
  name: string;
  factoryId: string;
  createdAt: string;
  updatedAt: string;
};
