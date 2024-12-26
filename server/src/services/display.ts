import { Prisma } from "@prisma/client";
import prisma from "./db";
import { CreateDisplayReq, UpdateDisplayByIdReq } from "@/schemas/display";
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

export type QueryDisplay = {
  enable?: boolean;
  priority?: [number, number] | number;
  createdAt?: [string, string];
  orderBy?: {
    column: "priority" | "enable" | "createdAt" | "updatedAt";
    order: "asc" | "desc";
  }[];
  limit?: number;
  page?: number;
};

export async function queryDisplaysService({
  priority,
  createdAt,
  enable,
  ...props
}: QueryDisplay) {
  let where: Prisma.DisplaysWhereInput = {};
  if (enable != undefined) {
    where.enable = enable;
  }

  if (priority != undefined) {
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

  if (createdAt != undefined) {
    if (
      createdAt.length == 2 &&
      new Date(createdAt[0]).getTime() <= new Date(createdAt[1]).getTime()
    ) {
      where.createdAt = {
        gte: createdAt[0],
        lte: createdAt[1],
      };
    }
  }

  // page
  const take = props.limit || 10;
  const page = (!props.page || props.page <= 0 ? 1 : props.page) - 1;
  const skip = page * take;
  console.log(page, take, skip);

  let orderBy: Prisma.DisplaysOrderByWithAggregationInput[] =
    props.orderBy?.map((o) => ({ [o.column]: o.order })) || [];

  const [displays, total] = await prisma.$transaction([
    prisma.displays.findMany({
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
    }),
    prisma.displays.count({ where }),
  ]);
  return {
    displays: displays.map(({ departmentsDisplays, ...props }) => {
      const departments = departmentsDisplays.map((d) => d.department);
      return { ...props, departments };
    }),
    pagination: {
      hasNextPage: skip + take < total,
      totalPage: Math.ceil(total / take),
      totalItem: total,
    },
  };
}
