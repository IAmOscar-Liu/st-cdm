import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query";
import { Method } from "axios";
import { useState } from "react";
import { useApi } from "./useApi";

export type ApiQueryParams<TData = any, TBody = any> = {
  queryKey: QueryKey;
  url: string;
  method?: Method;
  body?: TBody;
  headers?: Record<string, string>;
  enabled?: boolean;
  staleTime?: number;
  select?: UseQueryOptions<TData, unknown, TData>["select"]; // TSelect === TData
};

export function useApiQuery<TData = any, TBody = any>({
  queryKey,
  url,
  method = "GET",
  body,
  headers,
  enabled = true,
  staleTime = 0,
  select,
}: ApiQueryParams<TData, TBody>) {
  const api = useApi();

  return useQuery<TData>({
    queryKey,
    queryFn: async () => {
      const { data } = await api.request<TData>({
        url,
        method,
        headers,
        data: body,
      });
      return data;
    },
    enabled,
    staleTime,
    select,
  });
}

export function useApiLazyQuery<TData = any, TBody = any>() {
  const api = useApi();

  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetch = async ({
    url,
    method = "GET",
    body,
    headers,
  }: Omit<ApiQueryParams<TData, TBody>, "queryKey">) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.request<TData>({
        url,
        method,
        data: body,
        headers,
      });

      setData(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetch, data, isLoading, error };
}
