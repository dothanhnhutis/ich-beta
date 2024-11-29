import { BadRequestError } from "@/error-handler";
import { CreateTaskReq, UpdateTaskReq } from "@/schemas/task";
import { editTask, readTaskById, writeTask } from "@/services/task";
import { emptyTask, taskSend } from "@/socket/task";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function createTask(
  req: Request<{}, {}, CreateTaskReq["body"]>,
  res: Response
) {
  await writeTask(req.body);
  taskSend(req.body);

  return res.status(StatusCodes.OK).send("Create task success");
}

export async function updateTask(
  req: Request<UpdateTaskReq["params"], {}, UpdateTaskReq["body"]>,
  res: Response
) {
  const { id } = req.params;

  const task = await readTaskById(id);
  if (!task) throw new BadRequestError("Task không tồn tại");

  await editTask(id, req.body);
  // taskSend(req.body);

  return res.status(StatusCodes.OK).send("Create task success");
}
