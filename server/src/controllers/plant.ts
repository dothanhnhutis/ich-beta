import { readPlans, readTaskOfPlan } from "@/services/plan";
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
