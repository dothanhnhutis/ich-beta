import { CreateFactoryData, UpdateFactoryData } from "@/schemas/factory";
import prisma from "./db";

export async function getFactoryById(factoryId: string) {
  return prisma.factorys.findUnique({
    where: {
      id: factoryId,
    },
  });
}

export async function getFactorys() {
  return prisma.factorys.findMany();
}

export async function createFactory(data: CreateFactoryData) {
  return prisma.factorys.create({
    data,
  });
}

export async function updateFactoryById(
  factoryId: string,
  data: UpdateFactoryData
) {
  return prisma.factorys.update({
    where: {
      id: factoryId,
    },
    data,
  });
}

export async function deleteFactoryById(factoryId: string) {
  return prisma.factorys.delete({
    where: {
      id: factoryId,
    },
  });
}
