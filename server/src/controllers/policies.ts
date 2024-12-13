import { BadRequestError, PermissionError } from "@/error-handler";
import { evaluateCondition } from "@/middlewares/checkpolicy";
import { CreatePolicyReq, UpdatePolicyByIdReq } from "@/schemas/policies";
import {
  createPolicyService,
  deletePolicyByIdService,
  readPoliciesOfUserIdService,
  readPoliciesService,
  readPolicyByIdService,
  updatePolicyByIdService,
} from "@/services/policies";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function createPolicy(
  req: Request<{}, {}, CreatePolicyReq["body"]>,
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

  const policy = await readPolicyByIdService(req.params.id);

  if (condition != null && !evaluateCondition(req.user!, condition, policy))
    throw new PermissionError();

  if (!policy) throw new BadRequestError("PolicyId không tồn tại");

  return res.status(StatusCodes.OK).json(policy);
}

export async function getPolicyMe(req: Request, res: Response) {
  const { id } = req.user!;
  const policies = await readPoliciesOfUserIdService(id);
  return res.status(StatusCodes.OK).json(policies);
}

export async function getPolicies(req: Request, res: Response) {
  const condition = req.condition;

  if (condition != null && !evaluateCondition(req.user!, condition))
    throw new PermissionError();

  const policies = await readPoliciesService();

  return res.status(StatusCodes.OK).json(policies);
}

export async function updatePolicyById(
  req: Request<UpdatePolicyByIdReq["params"], {}, UpdatePolicyByIdReq["body"]>,
  res: Response
) {
  const condition = req.condition;

  const policy = await readPolicyByIdService(req.params.id);

  if (condition != null && !evaluateCondition(req.user!, condition, policy))
    throw new PermissionError();

  if (!policy) throw new BadRequestError("PolicyId không tồn tại");

  await updatePolicyByIdService(req.params.id, req.body);

  return res.status(StatusCodes.OK).json({
    message: "Cập nhật policy thành công",
  });
}

export async function deletePolicyById(
  req: Request<UpdatePolicyByIdReq["params"]>,
  res: Response
) {
  const condition = req.condition;
  const policy = await readPolicyByIdService(req.params.id);
  if (condition != null && !evaluateCondition(req.user!, condition, policy))
    throw new PermissionError();

  if (!policy) throw new BadRequestError("PolicyId không tồn tại");

  await deletePolicyByIdService(req.params.id);

  return res.status(StatusCodes.OK).json({
    message: "Xoá policy thành công",
  });
}
