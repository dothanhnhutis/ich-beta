import { PermissionError } from "@/error-handler";
import { evaluateCondition } from "@/middlewares/checkpolicy";
import { CreatePolicy } from "@/schemas/policies";
import {
  createPolicyService,
  readPoliciesService,
  readRoleByIdService,
} from "@/services/policies";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function createPolicy(
  req: Request<{}, {}, CreatePolicy["body"]>,
  res: Response
) {
  const condition = req.condition;
  if (condition != null && !evaluateCondition(req.user!, condition))
    throw new PermissionError();

  await createPolicyService(req.body);
  return res.status(StatusCodes.CREATED).json({
    message: "create policy success",
  });
}

export async function getPolicyById(
  req: Request<{ id: string }>,
  res: Response
) {
  const condition = req.condition;

  const role = await readRoleByIdService(req.params.id);

  if (condition != null && !evaluateCondition(req.user!, condition, role))
    throw new PermissionError();

  return res.status(StatusCodes.OK).json(role);
}

export async function getPolicies(req: Request, res: Response) {
  const condition = req.condition;
  console.log(condition);

  if (condition != null && !evaluateCondition(req.user!, condition))
    throw new PermissionError();

  const roles = await readPoliciesService();

  return res.status(StatusCodes.OK).json(roles);
}
