import { ValidationError } from "express-validator";

export class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class RequestValidationError extends Error {
  public statusCode: number;
  public validationErrors: ValidationError[];

  constructor(validationErrors: ValidationError[], statusCode: number) {
    super();
    this.validationErrors = validationErrors;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}
