import { CreateRole } from "@/schemas/roles";
import { writerRole } from "@/services/roles";
import { Request, Response, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

export async function createRole(
  req: Request<{}, {}, CreateRole["body"]>,
  res: Response
) {
  await writerRole(req.body);
  return res.status(200).json(req.body);
}
