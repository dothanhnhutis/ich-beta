import { BadRequestError } from "@/error-handler";
import {
  readPlanById,
  readPlans,
  readTaskOfPlan,
  removeTasksOfPlan,
} from "@/services/plan";
import { emptyTask } from "@/socket/task";
import { Request, Response, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

export async function getPlans(req: Request, res: Response) {
  const plans = await readPlans();
  res.status(StatusCodes.OK).json(plans);
}

export async function getTaskOfPlan(
  req: Request<{ id: string }>,
  res: Response
) {
  const { id } = req.params;
  const tasks = await readTaskOfPlan(id);
  res.status(StatusCodes.OK).json(tasks);
}

export async function clearTaskOfPlan(
  req: Request<{ id: string }>,
  res: Response
) {
  const { id } = req.params;
  const plan = await readPlanById(id);
  if (!plan) throw new BadRequestError("Kết hoạch không tồn tại");
  await removeTasksOfPlan(id);

  emptyTask(id);

  return res.status(StatusCodes.OK).send("Xoá tất cả task của plan thành công");
}
