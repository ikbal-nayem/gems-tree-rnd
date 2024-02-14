import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ErrorsPage } from "../pages/errors/ErrorsPage";
import { App } from "../App";
import { PrivateRoutes } from "./PrivateRoutes";
import { ENV } from "config/ENV.config";

const PUBLIC_URL = ENV.public_url;

const AppRoutes: FC = () => {
	return (
		<BrowserRouter basename={PUBLIC_URL}>
			<Routes>
				<Route element={<App />}>
					<Route path="/*" element={<PrivateRoutes />} />
					<Route path="error/*" element={<ErrorsPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export { AppRoutes };
