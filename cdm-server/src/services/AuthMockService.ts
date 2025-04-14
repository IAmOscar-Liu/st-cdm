import { exampleUser, findUserByEmail, findUserById } from "../mock/mockUser";
import { ServiceResponse, TokenData } from "../types/request";
import { User } from "../types/user";
import { handleServiceError } from "../utils/axios";
import { CustomError } from "../utils/error";
import { createTokens, safeVerifyToken } from "../utils/token";

class AuthMockService {
  async login(
    email: string,
    password: string
  ): Promise<ServiceResponse<TokenData>> {
    try {
      // mock login request
      const user = await findUserByEmail(email);
      if (!user) throw new CustomError("Wrong email or password", 400);

      // const valid = await bcrypt.compare(password + "", user.password!);
      const valid = await Promise.resolve(password === "123456");
      if (!valid) throw new CustomError("Wrong email or password", 400);

      const tokens = createTokens(exampleUser.id);

      return {
        success: true,
        statusCode: 200,
        data: tokens,
      };
    } catch (error: any) {
      return handleServiceError(error);
    }
  }

  async refresh(refreshToken: string): Promise<ServiceResponse<TokenData>> {
    try {
      const result = safeVerifyToken(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      );
      if (!result.success) throw new CustomError(result.message, 401);
      if (
        typeof result.payload === "string" ||
        typeof result.payload.account_id !== "string"
      )
        throw new CustomError("Invalid refresh token", 401);

      const user = await findUserById(result.payload.account_id);

      if (!user) throw new CustomError("Cannot find account", 401);

      const tokens = createTokens(user.id);
      return {
        success: true,
        statusCode: 200,
        data: tokens,
      };
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async getUserInfoByAccessToken(
    accessToken: string
  ): Promise<ServiceResponse<User>> {
    try {
      if (!accessToken) throw new CustomError("Unauthorized", 401);

      const result = safeVerifyToken(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string
      );
      if (!result.success) throw new CustomError(result.message, 401);
      if (
        typeof result.payload === "string" ||
        typeof result.payload.account_id !== "string"
      )
        throw new CustomError("Invalid token", 401);

      const user = await findUserById(result.payload.account_id);

      if (!user) throw new CustomError("Unauthorized", 401);

      return { success: true, statusCode: 200, data: user };
    } catch (error) {
      return handleServiceError(error);
    }
  }
}

const authMockService = new AuthMockService();
export default authMockService;
