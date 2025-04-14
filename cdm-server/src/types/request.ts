import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export type RequestWithAccountId = Request & { account_id?: string };

export type NonNullableFields<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

export type SearchQueries = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDesc?: boolean;
  textSearch?: string;
  status?: string[];
};

export type ServiceResponseFailure = {
  success: false;
  statusCode: number;
  message: any;
};

export type ServiceResponse<T> =
  | {
      success: true;
      statusCode: number;
      data: T;
    }
  | ServiceResponseFailure;

export type ServicePaginationResponse<T> =
  | {
      success: true;
      statusCode: number;
      data: {
        code?: number;
        occurTime?: string;
        message?: any;
        data: T[];
        totalElements: number;
        totalPages: number;
      };
    }
  | ServiceResponseFailure;

export type TokenData = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
};

export type JWTVerifyResult =
  | { success: true; payload: string | JwtPayload }
  | { success: false; message: string };
