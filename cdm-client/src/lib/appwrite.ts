import { User } from "@/types/general";
import { ApiResponse } from "@/types/response";
import { Account, Client } from "appwrite";
import { waitFor } from "./utils";

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // or your custom endpoint
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT); // replace with your Project ID

const account = new Account(client);

export default class AppwriteService {
  static async login(
    email: string,
    password: string,
  ): Promise<ApiResponse<{ accessToken: string }>> {
    try {
      /* const session = */ await account.createEmailPasswordSession(
        email,
        password,
      );
      // console.log(session);
      const accessToken = await AppwriteService.createJWT();
      return {
        success: true,
        data: { accessToken },
      };
    } catch (error) {
      throw error;
    }
  }

  static async logout() {
    try {
      await account.deleteSession("current");
    } catch (error) {
      throw error;
    }
  }

  static async getCurrentUser(
    setAccessToken?: (token: string) => void,
  ): Promise<ApiResponse<User>> {
    try {
      const user = await account.get();
      if (setAccessToken) {
        setAccessToken(await AppwriteService.createJWT());
        await waitFor(100);
      }
      return { success: true, data: user };
    } catch (error) {
      console.error("Failed to get current user", error);
      return { success: false, message: error }; // not logged in
    }
  }

  static async createJWT() {
    const accessToken = (await account.createJWT()).jwt;
    console.log("access token: ", accessToken);
    return accessToken;
  }
}

export { account };
