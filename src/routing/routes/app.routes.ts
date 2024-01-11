import { ROUTE_L1 } from "@constants/internal-route.constant";
import { IAppRoutes } from "@interface/common.interface";
import { lazy } from "react";
import { OrganogramRoutes } from "./organogram.routes";
import { TemplateRoutes } from "./template.routes";
import { OtherRoutes } from "./other.routes";

export const AppRouteList: IAppRoutes[] = [
  {
    link: ROUTE_L1.DASHBOARD,
    element: lazy(() => import("pages/dashboard/DashboardWrapper")),
  },
  { ...TemplateRoutes },
  { ...OrganogramRoutes },
  ...OtherRoutes,
  {
    link: "*",
    redirect: ROUTE_L1.DASHBOARD,
  },
];
