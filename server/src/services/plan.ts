import prisma from "./db";

export async function readPlans() {
  const plans = await prisma.plans.findMany();
  return plans;
}

export async function readTaskOfPlan(planId: string) {
  const tasks = await prisma.tasks.findMany({
    where: { planId },
    include: {
      subTasks: true,
    },
  });

  return tasks;
}
