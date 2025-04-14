import { NextFunction, Request, Response } from "express";
import { query, validationResult } from "express-validator";
import { RequestValidationError } from "../../utils/error";

export const pagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Page must be an integer greater than 0"),
  query("pageSize")
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage("PageSize must be an integer greater than 0"),
  query("sortBy")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("SortBy must be a non-empty string"),
  query("sortDesc")
    .optional()
    .isBoolean()
    .toBoolean()
    .withMessage("SortDesc must be a boolean value"),
  query("textSearch")
    .optional()
    .isString()
    .trim()
    .withMessage("TextSearch must be a valid string"),
  query("status")
    .optional()
    .isString()
    .trim()
    .withMessage("status must be a valid string"),

  handleValidation,
];

export const Validator = {
  pagination,
};

export function handleValidation(
  req: Request,
  _: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new RequestValidationError(errors.array(), 400));
  }
  next();
}
