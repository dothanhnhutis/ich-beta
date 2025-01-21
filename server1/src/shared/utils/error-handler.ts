import { StatusCodes } from "http-status-codes";

// interface IErrorResponse {
//   message: string;
//   statusCode: number;
//   serializeErrors(): IError;
// }

export interface IError {
  message: string;
  statusCode: number;
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  constructor(message: string) {
    super(message);
  }
  serializeErrors(): IError {
    return {
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

export class BadRequestError extends CustomError {
  statusCode: number = StatusCodes.BAD_REQUEST;

  constructor(public message: string) {
    super(message);
  }
}

export class NotAuthorizedError extends CustomError {
  statusCode: number = StatusCodes.UNAUTHORIZED;

  constructor() {
    super("Not Authorized");
  }
}

export class NotFoundError extends CustomError {
  statusCode: number = StatusCodes.NOT_FOUND;

  constructor() {
    super("Route not found");
  }
}

export class PermissionError extends CustomError {
  statusCode: number = StatusCodes.FORBIDDEN;

  constructor(message?: string) {
    super(message || "Permission denied");
  }
}

export class CacheError extends CustomError {
  statusCode: number = 600;

  constructor(public message: string) {
    super(message);
  }
}
export class MBConnectError extends CustomError {
  statusCode: number = 700;

  constructor() {
    super("Connection to the RabbitMQ cluster failed");
  }
}

export class MBInitConnectError extends CustomError {
  statusCode: number = 701;

  constructor() {
    super("call Amqp.connect() method when start server");
  }
}
