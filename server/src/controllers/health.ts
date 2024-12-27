import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export function health(req: Request, res: Response) {
  return res.status(StatusCodes.OK).send("Server health check oker");
}
