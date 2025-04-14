import { QUERIES } from "@/constants";
import { useAuth } from "@/context/AuthProvider";
import AppwriteService from "@/lib/appwrite";
import { User } from "@/types/general";
import { ApiResponse } from "@/types/response";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "../App";
import AuthRoutes from "./AuthRoutes";
import PrivateRoutes from "./PrivateRoutes";

function AppRoutes() {
  const { data: meData, isLoading } = useMeQuery();
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    if (meData?.success) setCurrentUser(meData.data);
  }, [meData]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App isLoading={isLoading} />}>
          <Route path="error/*" element={<div>Not Found</div>} />

          {meData?.success ? (
            <>
              <Route path="/*" element={<PrivateRoutes />} />
              <Route index element={<Navigate to="/start" />} />
            </>
          ) : (
            <>
              <Route path="auth/*" element={<AuthRoutes />} />
              <Route path="*" element={<Navigate to="/auth?logout=true" />} />
            </>
          )}

          <Route path="/unauthorized" element={<div>Unauthorized</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function useMeQuery() {
  const { enabled, setAccessToken, accessToken } = useAuth();
  // return useApiQuery<ApiResponse<User>, void>({
  //   url: "/auth/me",
  //   method: "POST",
  //   queryKey: [QUERIES.user],
  //   staleTime: Number.MAX_SAFE_INTEGER,
  //   enabled,
  // });
  return useQuery<ApiResponse<User>>({
    queryFn: () =>
      AppwriteService.getCurrentUser(accessToken ? undefined : setAccessToken),
    queryKey: [QUERIES.user],
    staleTime: Number.MAX_SAFE_INTEGER,
    enabled,
  });
}

export default AppRoutes;
