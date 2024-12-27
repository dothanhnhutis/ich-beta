import { BadRequestError, PermissionError } from "@/error-handler";
import { checkPermission, hasPermission } from "@/middlewares/checkPermission";
import {
  CreateDisplayReq,
  queryDisplaysSchema,
  UpdateDisplayByIdReq,
} from "@/schemas/display";
import {
  getDepartmentsInListService,
  readDepartmentById,
} from "@/services/department";
import {
  removeDisplayById,
  readDisplayById,
  QueryDisplay,
  queryDisplaysService,
  editDisplayById,
  writeNewDisplay,
} from "@/services/display";
import {
  createDisplaySocketSender,
  deleteDisplaySocketSender,
  updateDisplaySocketSender,
} from "@/socket/display";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function createDisplay(
  req: Request<{}, {}, CreateDisplayReq["body"]>,
  res: Response
) {
  const isValidAccess = hasPermission(req.user, "read:displays");
  if (!isValidAccess) throw new PermissionError();

  for (const departmentId of req.body.departmentIds) {
    const department = await readDepartmentById(departmentId);
    if (department) continue;
    throw new BadRequestError(`Mã phòng ban id=${departmentId} không tồn tại`);
  }

  const display = await writeNewDisplay({
    ...req.body,
    userId: req.user!.id,
  });

  if (req.body.enable) {
    createDisplaySocketSender(req.body.departmentIds, display);
  }

  return res.status(StatusCodes.CREATED).json({
    message: "Tạo hiển thị thành công",
    display,
  });
}

export async function updateDisplayById(
  req: Request<
    UpdateDisplayByIdReq["params"],
    {},
    UpdateDisplayByIdReq["body"]
  >,
  res: Response
) {
  const isValidAccess = hasPermission(req.user, "update:displays");
  if (!isValidAccess) throw new PermissionError();

  const display = await readDisplayById(req.params.id);
  if (!display) throw new BadRequestError("displayId không tồn tại");

  const { departmentIds, ...displaydata } = req.body;

  if (departmentIds) {
    for (const departmentId of departmentIds) {
      const department = await readDepartmentById(departmentId);
      if (department) continue;
      throw new BadRequestError(`Phòng ban id=${departmentId} không tồn tại}`);
    }
  }

  const newDisplay = await editDisplayById(req.params.id, req.body);

  const senToDepartments = display.departments
    .map((d) => d.id)
    .concat(departmentIds || [])
    .filter((value, index, array) => array.indexOf(value) === index);
  updateDisplaySocketSender(senToDepartments, newDisplay);

  return res.status(StatusCodes.OK).json({
    message: "Cập nhật displays thành công",
  });
}

export async function getDisplayById(
  req: Request<{ id: string }>,
  res: Response
) {
  const isValidAccess = hasPermission(req.user, "read:displays");

  const display = await readDisplayById(req.params.id);

  if (!isValidAccess) {
    if (!display || display.userId != req.user!.id) {
      throw new PermissionError();
    }
  }

  if (!display)
    throw new BadRequestError(`Hiển thị id=${req.params.id} không tồn tại`);

  return res.status(StatusCodes.OK).json(display);
}

export async function getDisplays(req: Request, res: Response) {
  const { success, data } = queryDisplaysSchema.safeParse(req.query);

  let query: QueryDisplay = {};
  if (data) {
    const {
      priority,
      enable,
      createdAt,
      maxPriority,
      minPriority,
      createdAtFrom,
      createdAtTo,
      orderBy,
      ...props
    } = data;

    query = {
      ...props,
    };

    if (priority != undefined) {
      query.priority = priority;
    } else if (
      minPriority != undefined &&
      maxPriority != undefined &&
      maxPriority >= minPriority
    ) {
      query.priority = [minPriority, maxPriority];
    }

    if (enable != undefined) {
      query.enable = enable;
    }

    if (createdAt != undefined) {
      query.createdAt = createdAt;
    } else if (
      createdAtFrom != undefined &&
      createdAtTo != undefined &&
      new Date(createdAtTo).getTime() >= new Date(createdAtFrom).getTime()
    ) {
      query.createdAt = [createdAtFrom, createdAtTo];
    }
    if (orderBy) {
      query.orderBy = orderBy as QueryDisplay["orderBy"];
    }
  }
  const displays = await queryDisplaysService(query);
  return res.status(StatusCodes.OK).json(displays);
}

export async function deleteDisplayById(
  req: Request<{ id: string }>,
  res: Response
) {
  const isValidAccess = hasPermission(req.user, "delete:displays");

  const display = await readDisplayById(req.params.id);

  if (!isValidAccess) {
    if (!display || display.userId != req.user!.id) {
      throw new PermissionError();
    }
  }

  if (!display)
    throw new BadRequestError(`Hiển thị id=${req.params.id} không tồn tại`);

  const deleteDisplay = await removeDisplayById(req.params.id);

  return res.status(StatusCodes.OK).json({
    message: "Xoá hiển thị thành công",
    display: deleteDisplay,
  });
}
