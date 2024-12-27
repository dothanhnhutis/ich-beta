import { dateRegex, displayRegex, trueFalseList } from "@/configs/constants";
import { BadRequestError, PermissionError } from "@/error-handler";
import { hasPermission } from "@/middlewares/checkPermission";
import { CreateDisplayReq, UpdateDisplayByIdReq } from "@/schemas/display";
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
import { isValidDate } from "@/utils/helper";
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

export async function queryDisplays(req: Request, res: Response) {
  const { id } = req.user!;
  let query: QueryDisplay = {};

  const {
    priority,
    enable,
    createdAt,
    maxPriority,
    minPriority,
    createdAtFrom,
    createdAtTo,
    orderBy,
    departmentIds,
    limit,
    page,
    userId,
  } = req.query;

  const isValidAccess = hasPermission(req.user, "read:displays");

  // if (!isValidAccess) {
  //   query.userId = id;

  //   const displays = await queryDisplaysService(query);
  //   return res.status(StatusCodes.OK).json(displays);
  // }

  if (
    typeof priority == "string" &&
    !isNaN(parseInt(priority)) &&
    parseInt(priority) >= 0
  ) {
    query.priority = parseInt(priority);
  }

  if (
    typeof minPriority == "string" &&
    typeof maxPriority == "string" &&
    !isNaN(parseInt(minPriority)) &&
    !isNaN(parseInt(maxPriority)) &&
    parseInt(maxPriority) >= parseInt(minPriority)
  ) {
    query.priority = [parseInt(minPriority), parseInt(maxPriority)];
  }

  if (typeof enable == "string" && trueFalseList.includes(enable)) {
    query.enable = enable == "1" || enable == "true";
  }

  if (typeof createdAt == "string" && dateRegex.test(createdAt)) {
    const parsedDate = createdAt.replace(/-/g, "/");
    const [day, month, year] = parsedDate.split("/").map(Number);
    if (isValidDate(day, month, year)) {
      query.createdAt = [
        `${year}-${month}-${day}T00:00:00.000Z`,
        `${year}-${month}-${day}T23:59:59.999Z`,
      ];
    }
  }

  if (
    typeof createdAtFrom == "string" &&
    typeof createdAtTo == "string" &&
    dateRegex.test(createdAtFrom) &&
    dateRegex.test(createdAtTo)
  ) {
    const parsedDateFrom = createdAtFrom.replace(/-/g, "/");
    const [dayFrom, monthFrom, yearFrom] = parsedDateFrom
      .split("/")
      .map(Number);

    const parsedDateTo = createdAtTo.replace(/-/g, "/");
    const [dayTo, monthTo, yearTo] = parsedDateTo.split("/").map(Number);

    if (
      isValidDate(dayFrom, monthFrom, yearFrom) &&
      isValidDate(dayTo, monthTo, yearTo) &&
      new Date(`${yearFrom}-${monthFrom}-${dayFrom}`).getTime() >=
        new Date(`${yearTo}-${monthTo}-${dayTo}`).getTime()
    ) {
      query.createdAt = [
        `${yearFrom}-${monthFrom}-${dayFrom}T00:00:00.000Z`,
        `${yearTo}-${monthTo}-${dayTo}T23:59:59.999Z`,
      ];
    }
  }
  if (
    Array.isArray(orderBy) &&
    orderBy.every((item) => typeof item === "string")
  ) {
    const orderBys = orderBy
      .filter((v) => typeof v == "string" && displayRegex.test(v))
      .map((data) => {
        const dataSplit = data.split(".");
        return {
          column: dataSplit[0],
          order: dataSplit[1],
        };
      });

    query.orderBy = orderBys as QueryDisplay["orderBy"];
  }

  if (
    Array.isArray(departmentIds) &&
    departmentIds.every((item) => typeof item === "string")
  ) {
    query.departmentIds = departmentIds;
  }

  if (typeof limit == "string") {
    const intRegex = /\d+/;
    if (intRegex.test(limit) && parseInt(limit) > 0) {
      query.limit = parseInt(limit);
    }
  }

  if (typeof page == "string") {
    const intRegex = /\d+/;
    if (intRegex.test(page) && parseInt(page) > 0) {
      query.limit = parseInt(page);
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
