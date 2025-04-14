import { Method } from "axios";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useApi } from "./useApi";

export type ApiMutationParams<TBody = any> = {
  url: string;
  method?: Method; // POST, PUT, PATCH, DELETE (default: POST)
  headers?: Record<string, string>;
  body?: TBody;
};

export function useApiMutation<TData = any, TBody = any>(
  options?: UseMutationOptions<TData, unknown, ApiMutationParams<TBody>>,
) {
  const api = useApi();

  return useMutation<TData, any, ApiMutationParams<TBody>>({
    mutationFn: async ({ url, method = "POST", headers, body }) => {
      const { data } = await api.request<TData>({
        url,
        method,
        headers,
        data: body,
      });
      return data;
    },
    ...options,
  });
}
