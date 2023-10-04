import { DASHBOARD, ORG_TREE } from "@constants/internal-route.constant";
import { IAppRoutes } from "@interface/common.interface";
import { lazy } from "react";

export const AppRouteList: IAppRoutes[] = [
  {
    link: DASHBOARD,
    element: lazy(() => import("pages/dashboard/DashboardWrapper")),
  },
  {
    link: ORG_TREE,
    element: lazy(() => import("@modules/Tree/custom-node-chart")),
  },
  {
    link: "*",
    redirect: DASHBOARD,
  },
];
