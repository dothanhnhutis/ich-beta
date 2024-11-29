import prisma from "./db";

export async function readPlans() {
  const plans = await prisma.plans.findMany();
  return plans;
}

export async function readPlanById(planId: string) {
  const plan = await prisma.plans.findUnique({
    where: {
      id: planId,
    },
  });

  if (!plan) return;
  return plan;
}

export async function readTaskOfPlan(planId: string) {
  const tasks = await prisma.tasks.findMany({
    where: { planId, closeTask: false },
    include: {
      subTasks: true,
    },
  });

  return tasks;
}

export async function removeTasksOfPlan(planId: string) {
  const tasks = await prisma.tasks.updateMany({
    where: {
      planId,
    },
    data: {
      closeTask: true,
    },
  });
}
