import {
  CreateDepartmentData,
  QueryDepartment,
  UpdateDepartmentData,
} from "@/schemas/department";
import prisma from "./db";
import { Prisma } from "@prisma/client";

export async function getDepartments() {
  const departments = await prisma.departments.findMany();
  return departments;
}

export async function getDepartmentById(departmentId: string) {
  return await prisma.departments.findUnique({
    where: { id: departmentId },
  });
}

export async function queryDepartment(data: QueryDepartment) {
  const where: Prisma.DepartmentsWhereInput = {
    ...data,
  };

  if (data.name) {
    where;
  }

  const take = data.limit || 10;
  const page = (!data.page || data.page <= 0 ? 1 : data.page) - 1;
  const skip = page || 1 * take;

  let orderBy: Prisma.DepartmentsOrderByWithAggregationInput[] =
    data.orderBy?.map((o) => ({ [o.column]: o.order })) || [];

  const [departments, total] = await prisma.$transaction([
    prisma.departments.findMany({
      where,
      take,
      skip,
      orderBy,
    }),
    prisma.departments.count({ where }),
  ]);

  return {
    departments,
    pagination: {
      hasNextPage: skip + take < total,
      totalPage: Math.ceil(total / take),
      totalItem: total,
    },
  };
}

export async function createDepartment(data: CreateDepartmentData) {
  return await prisma.departments.create({
    data,
  });
}

export async function updateDepartmentById(
  departmentId: string,
  data: UpdateDepartmentData
) {
  return await prisma.departments.update({
    where: {
      id: departmentId,
    },
    data,
  });
}

export async function deleteDepartmentById(departmentId: string) {
  return await prisma.departments.delete({
    where: {
      id: departmentId,
    },
  });
}
