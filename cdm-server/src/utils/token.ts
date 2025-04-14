import { Request, Response } from "express";
import { decode, sign, verify } from "jsonwebtoken";
import {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  REFRESH_TOKEN_NAME,
} from "../constants";
import { JWTVerifyResult, TokenData } from "../types/request";

export function createTokens(account_id: string): TokenData {
  const access_token = sign(
    { account_id },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: ACCESS_TOKEN_MAX_AGE / 1000, // seconds
    }
  );

  const refresh_token = sign(
    { account_id },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: REFRESH_TOKEN_MAX_AGE / 1000, // seconds
    }
  );

  return {
    access_token,
    refresh_token,
    expires_in: ACCESS_TOKEN_MAX_AGE,
    refresh_expires_in: REFRESH_TOKEN_MAX_AGE,
  };
}

export function sendRefreshToken(
  res: Response,
  refreshToken: string,
  expiresIn?: number
) {
  res.cookie(REFRESH_TOKEN_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: expiresIn || REFRESH_TOKEN_MAX_AGE,
  });
}

export function extractTokenFromHeader(req: Request) {
  try {
    const authorization = req.headers["authorization"];
    if (!authorization) return null;
    const token = authorization.split(" ")[1];
    return token;
  } catch (error) {
    return null;
  }
}

export function safeVerifyToken(
  token: string,
  secret: string
): JWTVerifyResult {
  try {
    const payload = verify(token, secret);
    return { success: true, payload };
  } catch (error: any) {
    return {
      success: false,
      message: "JWT verification failed:" + error.message,
    };
  }
}

export function isTokenExpired(token: string) {
  if (!token) return true;
  const decoded = decode(token, { complete: true }); // Decode without verifying
  if (!decoded || typeof decoded.payload === "string" || !decoded.payload.exp)
    return true; // Treat missing exp as expired

  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return decoded.payload.exp < currentTime; // True if expired
}
