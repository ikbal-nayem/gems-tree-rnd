import { DASHBOARD } from "@constants/internal-route.constant";
import { IAppRoutes } from "@interface/common.interface";
import { lazy } from "react";

export const AppRouteList: IAppRoutes[] = [
	{
		link: DASHBOARD,
		element: lazy(() => import("pages/dashboard/DashboardWrapper")),
	},
	{
		link: "*",
		redirect: DASHBOARD,
	},
];
