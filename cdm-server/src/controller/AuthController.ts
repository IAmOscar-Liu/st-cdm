import { Request, Response } from "express";
import { REFRESH_TOKEN_NAME } from "../constants";
import AuthService from "../services/AuthMockService";
import { sendJsonResponse } from "../utils/axios";
import { extractTokenFromHeader, sendRefreshToken } from "../utils/token";

class AuthController {
  async login(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);
    if (!result.success) return sendJsonResponse(res, result);

    sendRefreshToken(
      res,
      result.data.refresh_token,
      result.data.refresh_expires_in
    );
    sendJsonResponse(res, {
      ...result,
      data: { accessToken: result.data.access_token },
    });
  }

  logout(_: Request, res: Response): any {
    res.clearCookie(REFRESH_TOKEN_NAME);

    return res.json({ success: true, statusCode: 200, data: true });
  }

  async refresh(req: Request, res: Response): Promise<any> {
    const refreshToken = req.cookies[REFRESH_TOKEN_NAME];

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Refresh token doesn't exist",
      });
    }

    const result = await AuthService.refresh(refreshToken);
    if (!result.success) return sendJsonResponse(res, result);

    sendRefreshToken(
      res,
      result.data.refresh_token,
      result.data.refresh_expires_in
    );
    sendJsonResponse(res, {
      ...result,
      data: { accessToken: result.data.access_token },
    });
  }

  async me(req: Request, res: Response): Promise<any> {
    const accessToken = extractTokenFromHeader(req);
    if (!accessToken)
      return res
        .status(401)
        .json({ success: false, statusCode: 401, message: "Unauthorized" });

    const result = await AuthService.getUserInfoByAccessToken(accessToken);
    sendJsonResponse(res, result);
  }
}

const authController = new AuthController();
export default authController;
