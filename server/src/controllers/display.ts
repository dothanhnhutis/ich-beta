import { dateRegex, displayRegex, trueFalseList } from "@/configs/constants";
import { BadRequestError, PermissionError } from "@/error-handler";
import { hasPermission } from "@/middlewares/checkPermission";
import {
  CreateDisplayReq,
  SearchDisplay,
  UpdateDisplayByIdReq,
} from "@/schemas/display";
import { getDepartmentById } from "@/services/department";
import {
  deleteDisplayById,
  getDisplayById,
  searchDisplays,
  updateDisplayById,
  createDisplay,
} from "@/services/display";
import {
  createDisplaySocketSender,
  deleteDisplaySocketSender,
  updateDisplaySocketSender,
} from "@/socket/display";
import { isValidDate } from "@/utils/helper";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function createDisplayHandler(
  req: Request<{}, {}, CreateDisplayReq["body"]>,
  res: Response
) {
  const isValidAccess = hasPermission(req.user, "read:displays");
  if (!isValidAccess) throw new PermissionError();

  for (const departmentId of req.body.departmentIds) {
    const department = await getDepartmentById(departmentId);
    if (department) continue;
    throw new BadRequestError(`Mã phòng ban id=${departmentId} không tồn tại`);
  }

  const display = await createDisplay({
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

export async function updateDisplayByIdHandler(
  req: Request<
    UpdateDisplayByIdReq["params"],
    {},
    UpdateDisplayByIdReq["body"]
  >,
  res: Response
) {
  const isValidAccess = hasPermission(req.user, "update:displays");
  if (!isValidAccess) throw new PermissionError();

  const display = await getDisplayById(req.params.id);
  if (!display) throw new BadRequestError("displayId không tồn tại");

  const { departmentIds, ...displaydata } = req.body;

  if (departmentIds) {
    for (const departmentId of departmentIds) {
      const department = await getDepartmentById(departmentId);
      if (department) continue;
      throw new BadRequestError(`Phòng ban id=${departmentId} không tồn tại}`);
    }
  }

  const newDisplay = await updateDisplayById(req.params.id, req.body);

  const senToDepartments = display.departments
    .map((d) => d.id)
    .concat(departmentIds || [])
    .filter((value, index, array) => array.indexOf(value) === index);
  updateDisplaySocketSender(senToDepartments, newDisplay);

  return res.status(StatusCodes.OK).json({
    message: "Cập nhật displays thành công",
  });
}

export async function getDisplayByIdHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  const isValidAccess = hasPermission(req.user, "read:displays");

  const display = await getDisplayById(req.params.id);

  if (!isValidAccess) {
    if (!display || display.userId != req.user!.id) {
      throw new PermissionError();
    }
  }

  if (!display)
    throw new BadRequestError(`Hiển thị id=${req.params.id} không tồn tại`);

  return res.status(StatusCodes.OK).json(display);
}

export async function searchDisplaysHandler(req: Request, res: Response) {
  let query: SearchDisplay = {};

  const {
    priority,
    enable,
    createdAt,
    maxPriority,
    minPriority,
    createdAtFrom,
    createdAtTo,
    orderBy,
    departmentId,
    limit,
    page,
    userId,
  } = req.query;

  const isValidAccess = hasPermission(req.user, "read:displays");
  if (!isValidAccess) throw new PermissionError();

  if (
    typeof userId == "string" ||
    (Array.isArray(userId) && userId.every((u) => typeof u == "string"))
  ) {
    query.userIds = Array.isArray(userId) ? userId : [userId];
  }

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

  if (typeof orderBy == "string") {
    const dataSplit = orderBy.split(".");
    query.orderBy = [
      {
        column: dataSplit[0],
        order: dataSplit[1],
      },
    ] as SearchDisplay["orderBy"];
  } else if (
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

    query.orderBy = orderBys as SearchDisplay["orderBy"];
  }

  if (typeof departmentId == "string") {
    query.departmentId = [departmentId];
  } else if (
    Array.isArray(departmentId) &&
    departmentId.every((item) => typeof item === "string")
  ) {
    query.departmentId = departmentId;
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
      query.page = parseInt(page);
    }
  }

  const displays = await searchDisplays(query);
  return res.status(StatusCodes.OK).json(displays);
}

export async function deleteDisplayByIdHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  const isValidAccess = hasPermission(req.user, "delete:displays");

  const display = await getDisplayById(req.params.id);

  if (!isValidAccess) {
    if (!display || display.userId != req.user!.id) {
      throw new PermissionError();
    }
  }

  if (!display)
    throw new BadRequestError(`Hiển thị id=${req.params.id} không tồn tại`);

  const deleteDisplay = await deleteDisplayById(req.params.id);

  return res.status(StatusCodes.OK).json({
    message: "Xoá hiển thị thành công",
    display: deleteDisplay,
  });
}
