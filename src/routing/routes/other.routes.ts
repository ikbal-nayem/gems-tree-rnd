import { ROUTE_L1, ROUTE_L2 } from "@constants/internal-route.constant";
import { ROUTE_KEY } from "@constants/route-keys.constant";
import { IAppRoutes } from "@gems/utils";
import { lazy } from "react";
// import { getPermittedRouteList } from "utility/utils";

let routeList: IAppRoutes[] = [
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
    link: ROUTE_L1.OMS_MASTER_POST,
    routeKey: ROUTE_KEY.OMS_MASTER_POST,
    element: lazy(() => import("@modules/post")),
  },
  {
    link: ROUTE_L2.OMS_ORGANIZATION_TYPE,
    routeKey: ROUTE_KEY.OMS_ORGANIZATION_TYPE,
    element: lazy(() => import("@modules/organization/organizationTypeList")),
  },
  {
    link: ROUTE_L2.OMS_ORGANIZATION_GROUP,
    routeKey: ROUTE_KEY.OMS_ORGANIZATION_GROUP,
    element: lazy(
      () => import("@modules/organization/organization-group-list")
    ),
  },
  {
    link: ROUTE_L2.OMS_ORGANIZATION_BRANCH,
    routeKey: ROUTE_KEY.OMS_ORGANIZATION_BRANCH,
    element: lazy(() => import("@modules/organization/organization-branch")),
  },
  {
    link: ROUTE_L2.OMS_CONFIGURATION_ORGANOGRAM_APPROVER_LIST,
    routeKey: ROUTE_KEY.OMS_CONFIGURATION_ORGANOGRAM_APPROVER_LIST,
    element: lazy(() => import("@modules/configuration/organogram-approver")),
  },
  {
    link: ROUTE_L2.OMS_CONFIGURATION_ORGANOGRAM_POST_LIST,
    routeKey: ROUTE_KEY.OMS_CONFIGURATION_ORGANOGRAM_POST_LIST,
    element: lazy(() => import("@modules/configuration/organogram-post")),
  },
  {
    link: ROUTE_L2.OMS_AUDIT_LOG_ORGANOGRAM_LOG,
    routeKey: ROUTE_KEY.OMS_CONFIGURATION_ORGANOGRAM_POST_LIST,
    element: lazy(() => import("@modules/audit-log/organogram-log")),
  },
  {
    link: ROUTE_L2.OMS_AUDIT_LOG_ORGANOGRAM_VIEW,
    // routeKey: ROUTE_KEY.OMS_ORGANOGRAM_VIEW,
    element: lazy(
      () => import("@modules/audit-log/organogram-log/OrganogramView")
    ),
  },
];

const permiableRouteList: IAppRoutes[] = [
  {
    link: ROUTE_L2.OMS_ORGANIZATION_MAIN_ACTIVITY,
    // routeKey: ROUTE_KEY.OMS_ORGANIZATION_MAIN_ACTIVITY,
    element: lazy(() => import("@modules/organization/main-activity")),
  },
  {
    link: ROUTE_L2.OMS_ORGANIZATION_BUSINESS_OF_ALLOCATION,
    // routeKey: ROUTE_KEY.OMS_ORGANIZATION_BUSINESS_OF_ALLOCATION,
    element: lazy(() => import("@modules/organization/business-of-allocation")),
  },
  {
    link: ROUTE_L2.OMS_ORGANIZATION_NODE_LIST,
    // routeKey: ROUTE_KEY.OMS_ORGANIZATION_NODE_LIST,
    element: lazy(() => import("@modules/organization/node-list")),
  },
  {
    link: ROUTE_L2.OMS_ORGANIZATION_GROUP_ORG_LIST,
    // routeKey: ROUTE_KEY.OMS_ORGANIZATION_GROUP_ORG_LIST,
    element: lazy(
      () =>
        import(
          "@modules/organization/organization-group-list/list/organization-list-by-group"
        )
    ),
  },
];

export const OtherRoutes = routeList.concat(permiableRouteList);
