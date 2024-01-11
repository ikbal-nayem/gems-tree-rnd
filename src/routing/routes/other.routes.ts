import { ROUTE_L1 } from "@constants/internal-route.constant";
import { ROUTE_KEY } from "@constants/route-keys.constant";
import { lazy } from "react";
import { getPermittedRouteList } from "utility/utils";

let routeList = [
  {
    link: ROUTE_L1.OMS_ORG_EMPLOYEE_LIST,
    routeKey: ROUTE_KEY.OMS_ORG_EMPLOYEE_LIST,
    element: lazy(() => import("@modules/employee-list")),
  },
  {
    link: ROUTE_L1.OMS_POST_CONFIG,
    routeKey: ROUTE_KEY.OMS_POST_CONFIG,
    element: lazy(() => import("@modules/post-config")),
  },
  {
    link: ROUTE_L1.OMS_MASTER_ORGANIZATION,
    routeKey: ROUTE_KEY.OMS_MASTER_ORGANIZATION,
    element: lazy(() => import("@modules/organization")),
  },
];

export const  OtherRoutes = getPermittedRouteList(routeList);
