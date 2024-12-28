import { Prisma } from "@prisma/client";
import prisma from "./db";
import {
  CreateDisplayData,
  Display,
  DisplayAttributeFilter,
  EditDisplayData,
  SearchDisplay,
} from "@/schemas/display";
import { getDepartmentById } from "./department";

const displayAttributeFilter = (display: DisplayAttributeFilter): Display => {
  const departments = display.departmentsDisplays.map(
    ({ department }) => department
  );
  const { departmentsDisplays, ...props } = display;
  return { ...props, departments };
};

export async function createDisplay(data: CreateDisplayData) {
  const { departmentIds, ...props } = data;

  const display = await prisma.displays.create({
    data: {
      ...props,
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

  return displayAttributeFilter(display);
}

export async function updateDisplayById(
  displayId: string,
  data: EditDisplayData
) {
  const { departmentIds, ...props } = data;
  const display = await prisma.displays.update({
    where: {
      id: displayId,
    },
    data: props,
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
  if (departmentIds) {
    const oldDepartmentsDisplays = await prisma.departmentsDisplays.findMany({
      where: {
        displayId,
      },
    });
    const oldDepartments = oldDepartmentsDisplays.map(
      ({ departmentId }) => departmentId
    );
    const createList = departmentIds
      .filter((id) => !oldDepartments.includes(id))
      .map((id) => ({
        departmentId: id,
        displayId,
      }));
    const deleteList = oldDepartments.filter(
      (id) => !departmentIds.includes(id)
    );

    const createDepartmentsDisplays = prisma.departmentsDisplays.createMany({
      data: createList,
    });
    const deleteDepartmentsDisplays = prisma.departmentsDisplays.deleteMany({
      where: {
        displayId,
        departmentId: { in: deleteList },
      },
    });
    await Promise.all([createDepartmentsDisplays, deleteDepartmentsDisplays]);
  }

  return displayAttributeFilter(display);
}

export async function getDisplayById(displayId: string) {
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

  if (display) return displayAttributeFilter(display);
  return display;
}

export async function deleteDisplayById(displayId: string) {
  const display = await prisma.displays.delete({
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

  if (display) return displayAttributeFilter(display);
  return display;
}

export async function searchDisplays({
  priority,
  createdAt,
  enable,
  departmentId,
  userIds,
  ...props
}: SearchDisplay) {
  let where: Prisma.DisplaysWhereInput = {};

  if (userIds != undefined && userIds.length > 0) {
    where.userId = {
      in: userIds,
    };
  }

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

  if (departmentId != undefined && departmentId.length > 0) {
    const existsdepartments = departmentId.filter(
      async (id) => (await getDepartmentById(id)) != null
    );
    where.departmentsDisplays = {
      some: {
        departmentId: {
          in: existsdepartments,
        },
      },
    };
  }

  // page
  const take = props.limit || 10;
  const page = (!props.page || props.page <= 0 ? 1 : props.page) - 1;
  const skip = page * take;

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
    displays: displays.map(displayAttributeFilter),
    pagination: {
      hasNextPage: skip + take < total,
      totalPage: Math.ceil(total / take),
      totalItem: total,
    },
  };
}
