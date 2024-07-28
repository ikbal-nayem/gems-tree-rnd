import { useAuth } from "@context/Auth";
import { ENV } from "config/ENV.config";
import { FC, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "../App";
import { ErrorsPage } from "../pages/errors/ErrorsPage";
import { PrivateRoutes } from "./PrivateRoutes";

const PUBLIC_URL = ENV.public_url;

const AppRoutes: FC = () => {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) logout();
  }, [isAuthenticated]);

  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          {isAuthenticated && <Route path="/*" element={<PrivateRoutes />} />}
          <Route path="error/*" element={<ErrorsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export { AppRoutes };
