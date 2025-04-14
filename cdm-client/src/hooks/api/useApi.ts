import { QUERIES } from "@/constants";
import { useAuth } from "@/context/AuthProvider";
import { createAxiosInstance } from "@/lib/axiosInstance";
import { User } from "@/types/general";
import { ApiResponse } from "@/types/response";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useApi = () => {
  const { accessToken, setAccessToken } = useAuth();
  const queryClient = useQueryClient();

  const api = useMemo(
    () =>
      createAxiosInstance(
        () => accessToken,
        setAccessToken,
        () => {
          setAccessToken(null);
          queryClient.setQueryData<ApiResponse<User>>([QUERIES.user], {
            success: false,
            message: "user has logged out",
          });
        },
      ),
    [accessToken],
  );

  return api;
};
