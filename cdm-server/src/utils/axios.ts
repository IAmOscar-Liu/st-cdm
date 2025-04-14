import axios, { AxiosInstance } from "axios";
import { Response } from "express";
import qs from "querystring";
import { ServiceResponse, ServiceResponseFailure } from "../types/request";
import { CustomError } from "./error";

class CustomAxiosInstance {
  backendService() {
    const axiosClient = axios.create({
      baseURL: process.env.BACKEND_BASE_URL as string, // Set your API base URL
      auth: {
        username: process.env.BACKEND_AUTH_USERNAME as string,
        password: process.env.BACKEND_AUTH_PASSWORD as string,
      },
    });

    this.addInterceptors(axiosClient);
    return axiosClient;
  }

  private addInterceptors(axiosClient: AxiosInstance) {
    // Request interceptor
    axiosClient.interceptors.request.use((config) => {
      // Construct the full URL
      let fullUrl = config.baseURL
        ? `${config.baseURL}${config.url}`
        : config.url;

      // Append query parameters if they exist
      if (config.params) {
        const queryString = qs.stringify(config.params);
        fullUrl += `?${queryString}`;
      }

      console.log(`BFF request: ${config.method?.toUpperCase()} ${fullUrl}`);
      return config;
    });
  }
}

const axiosInstance = new CustomAxiosInstance();
export default axiosInstance;

export function responseOK(statusCode: number) {
  return statusCode >= 200 && statusCode < 300;
}

export function handleServiceError(error: any): ServiceResponseFailure {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error(`Error ${error.response.status}:`, error.response.data);
      // console.error(error.response.request);
      return {
        success: false,
        statusCode: error.response.status,
        message: error.response.data?.message || "Request failed",
      };
    } else if (error.code === "ECONNABORTED") {
      return {
        success: false,
        statusCode: 504,
        message: "Gateway Timeout: Upstream server took to long",
      };
    } else if (error.request) {
      return {
        success: false,
        statusCode: 502,
        message: "Network error: No response received",
      };
    } else {
      return {
        success: false,
        statusCode: 500,
        message: error.message,
      };
    }
  } else if (error instanceof CustomError) {
    return {
      success: false,
      statusCode: error.statusCode,
      message: error.message,
    };
  } else {
    return {
      success: false,
      statusCode: 500,
      message: error?.message || "Unknown error",
    };
  }
}

export function sendJsonResponse<T>(res: Response, result: ServiceResponse<T>) {
  res.status(result.statusCode).json(result);
}
