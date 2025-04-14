import { NextFunction, Response } from "express";
import { RequestWithAccountId } from "../types/request";
import { CustomError } from "../utils/error";
import { extractTokenFromHeader, safeVerifyToken } from "../utils/token";

export function isAuthMock(
  req: RequestWithAccountId,
  _: Response,
  next: NextFunction
): any {
  const token = extractTokenFromHeader(req);
  if (!token) return next(new CustomError("Unauthorized", 401));

  const result = safeVerifyToken(
    token,
    process.env.ACCESS_TOKEN_SECRET as string
  );
  if (!result.success) return next(new CustomError(result.message, 401));
  if (
    typeof result.payload === "string" ||
    typeof result.payload.account_id !== "string"
  )
    return next(new CustomError("Token is invalid", 401));

  req.account_id = result.payload.account_id;
  next();
}
