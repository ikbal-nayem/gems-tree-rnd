import {
  DASHBOARD,
  ORG_TEMPLATE_CREATE,
} from "@constants/internal-route.constant";
import { IAppRoutes } from "@interface/common.interface";
import { lazy } from "react";

export const AppRouteList: IAppRoutes[] = [
  {
    link: DASHBOARD,
    element: lazy(() => import("pages/dashboard/DashboardWrapper")),
  },
  {
    link: ORG_TEMPLATE_CREATE,
    element: lazy(() => import("@modules/organogram-template/Tree/index")),
  },
  {
    link: "*",
    redirect: DASHBOARD,
  },
];
