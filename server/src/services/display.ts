import { Prisma } from "@prisma/client";
import prisma from "./db";
import {
  CreateDisplayReq,
  QueryDisplay,
  UpdateDisplayByIdReq,
} from "@/schemas/display";
import { number } from "zod";

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

  if (!display) return;
  const departments = display.departmentsDisplays.map((d) => d.department);
  const { departmentsDisplays, ...props } = display;
  return { ...props, departments };
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

// type QueryDisplay = {
//   enable?: boolean;
//   priority?: [number, number] | number;
//   createdAt?: [string, string] | string;
//   orderBy?: OrderByDisplay[];
//   take?: number;
//   page?: number;
// };

// type OrderByDisplay =
//   | {
//       priority: "asc" | "desc";
//     }
//   | { enable: "asc" | "desc" }
//   | { createdAt: "asc" | "desc" }
//   | { updatedAt: "asc" | "desc" };

export async function queryDisplaysService({
  priority,
  createdAt,
  orderBy,
  take = 10,
  page = 1,
  ...props
}: QueryDisplay) {
  let where: Prisma.DisplaysWhereInput = {
    ...props,
  };

  if (priority) {
    if (typeof priority == "number") {
      where.priority = priority;
    } else {
      if (priority.length == 2 && priority[0] <= priority[1]) {
        where.priority = {
          gte: priority[0],
          lte: priority[1],
        };
      }
    }
  }

  if (createdAt) {
    if (typeof createdAt == "string") {
      where.createdAt = createdAt;
    } else {
      if (createdAt.length == 2 && createdAt[0] <= createdAt[1]) {
        where.createdAt = {
          gte: createdAt[0],
          lte: createdAt[1],
        };
      }
    }
  }

  const skip = (page - 1) * take;

  const count = await prisma.displays.count({ where });

  const displays = await prisma.displays.findMany({
    where,
    orderBy,
    take,
    skip,
    include: {
      departmentsDisplays: {
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
  const hasNext = count > page * take;
  const totalPages = Math.ceil(count / take);
  return {
    displays: displays.map(({ departmentsDisplays, ...props }) => {
      const departments = departmentsDisplays.map((d) => d.department);
      return { ...props, departments };
    }),
    count,
    page,
    hasNext,
    totalPages,
  };
}
