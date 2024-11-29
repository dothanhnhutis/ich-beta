import { CreateTaskReq, UpdateTaskReq } from "@/schemas/task";
import prisma from "./db";
import { Prisma } from "@prisma/client";

export async function readTaskById(taskId: string) {
  const task = await prisma.tasks.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!task) return;
  return task;
}

export async function writeTask(input: CreateTaskReq["body"]) {
  const { subTasks, ...data } = input;

  const task = await prisma.tasks.create({
    data: {
      ...data,
      subTasks: {
        create: subTasks,
      },
    },
  });
  return task;
}

export async function editTask(taskId: string, input: UpdateTaskReq["body"]) {
  const { ...props } = input;
  const data: Prisma.TasksUpdateInput = props;

  const task = await prisma.tasks.update({
    where: {
      id: taskId,
    },
    data: data,
  });

  return task;
}
