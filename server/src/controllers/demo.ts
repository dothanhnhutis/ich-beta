import { CreateTaskReq } from "@/schemas/demo";
import { emptyTask, taskSend } from "@/socket/task";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export function createTask(
  req: Request<{}, {}, CreateTaskReq["body"]>,
  res: Response
) {
  taskSend(req.body);
  return res.status(StatusCodes.OK).send("Create task success");
}

export function clearTask(req: Request, res: Response) {
  emptyTask();
  return res.status(StatusCodes.OK).send("Clear task success");
}
