import { ROUTE } from "@constants/internal-route.constant";
import { IAppRoutes } from "@interface/common.interface";
import { lazy } from "react";

export const AppRouteList: IAppRoutes[] = [
  {
    link: ROUTE.DASHBOARD,
    element: lazy(() => import("pages/dashboard/DashboardWrapper")),
  },
  {
    link: ROUTE.ORG_TEMPLATE_CREATE,
    element: lazy(
      () => import("@modules/organogram-template/template-tree/index")
    ),
  },
  {
    link: ROUTE.OMS_ORG_EMPLOYEE_LIST,
    element: lazy(
      () => import("@modules/employee-list")
    ),
  },
  {
    link: "*",
    redirect: ROUTE.DASHBOARD,
  },
];