import { ROUTE_L1, ROUTE_L2 } from "@constants/internal-route.constant";
import { lazy } from "react";
import { OrganogramRoutes } from "./organogram.routes";
import { TemplateRoutes } from "./template.routes";
import { OtherRoutes } from "./other.routes";
import { ROUTE_KEY } from "@constants/route-keys.constant";
import { IAppRoutes } from "@gems/utils";

export const AppRouteList: IAppRoutes[] = [
  {
    link: ROUTE_L1.DASHBOARD,
    element: lazy(() => import("pages/dashboard/DashboardWrapper")),
  },
  {
    link: ROUTE_L2.OMS_ORGANIZATION_LIST,
    routeKey: ROUTE_KEY.OMS_ORGANIZATION_LIST,
    element: lazy(() => import("@modules/organizations/organization-list")),
  },
  { ...TemplateRoutes },
  { ...OrganogramRoutes },
  ...OtherRoutes,
  {
    link: "*",
    redirect: ROUTE_L1.DASHBOARD,
  },
];
