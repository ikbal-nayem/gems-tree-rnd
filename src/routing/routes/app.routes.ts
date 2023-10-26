import { ROUTE } from "@constants/internal-route.constant";
import { IAppRoutes } from "@interface/common.interface";
import { TemplateRoutes } from "./template.routes";
import { lazy } from "react";

export const AppRouteList: IAppRoutes[] = [
  {
    link: ROUTE.DASHBOARD,
    element: lazy(() => import("pages/dashboard/DashboardWrapper")),
  },
  { ...TemplateRoutes },
  {
    link: ROUTE.OMS_ORG_EMPLOYEE_LIST,
    element: lazy(() => import("@modules/employee-list")),
  },
  {
    link: ROUTE.OMS_ORGANOGRAM_LIST,
    element: lazy(() => import("@modules/organogram-list")),
  },
  {
    link: "*",
    redirect: ROUTE.DASHBOARD,
  },
];
