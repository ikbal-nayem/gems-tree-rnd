import { ROUTE_L1, ROUTE_L2 } from "@constants/internal-route.constant";
import { ROUTE_KEY } from "@constants/route-keys.constant";
import { IAppRoutes } from "@gems/utils";
import { lazy } from "react";
// import { getPermittedRouteList } from "utility/utils";

// let routeList = [
//   {
//     link: ROUTE_L2.OMS_ORGANOGRAM_APPROVED_LIST,
//     routeKey: ROUTE_KEY.OMS_ORGANOGRAM_APPROVED_LIST,
//     element: lazy(() => import("@modules/organogram/approved-list")),
//   },
//   {
//     link: ROUTE_L2.OMS_ORGANOGRAM_DRAFT_LIST,
//     routeKey: ROUTE_KEY.OMS_ORGANOGRAM_DRAFT_LIST,
//     element: lazy(() => import("@modules/organogram/draft-list")),
//   },
//   {
//     link: ROUTE_L2.OMS_ORGANOGRAM_INREVIEW_LIST,
//     routeKey: ROUTE_KEY.OMS_ORGANOGRAM_INREVIEW_LIST,
//     element: lazy(() => import("@modules/organogram/inreview-list")),
//   },
//   {
//     link: ROUTE_L2.OMS_ORGANOGRAM_INAPPROVE_LIST,
//     routeKey: ROUTE_KEY.OMS_ORGANOGRAM_INAPPROVE_LIST,
//     element: lazy(() => import("@modules/organogram/inapprove-list")),
//   },
// ];

// let permissionRouteList = getPermittedRouteList(routeList);

export const OrganogramRoutes: IAppRoutes = {
  link: ROUTE_L1.OMS_ORGANOGRAM,
  childrens: [
    {
      link: ROUTE_L2.OMS_ORGANOGRAM_VIEW,
      // routeKey: ROUTE_KEY.OMS_ORGANOGRAM_VIEW,
      element: lazy(() => import("@modules/organograms/view")),
    },
    {
      link: ROUTE_L2.OMS_ORGANOGRAM_APPROVED_LIST,
      routeKey: ROUTE_KEY.OMS_ORGANOGRAM_APPROVED_LIST,
      element: lazy(() => import("@modules/organograms/approved-list")),
    },
    {
      link: ROUTE_L2.OMS_ORGANOGRAM_DRAFT_LIST,
      routeKey: ROUTE_KEY.OMS_ORGANOGRAM_DRAFT_LIST,
      element: lazy(() => import("@modules/organograms/draft-list")),
    },
    {
      link: ROUTE_L2.OMS_ORGANOGRAM_INREVIEW_LIST,
      routeKey: ROUTE_KEY.OMS_ORGANOGRAM_INREVIEW_LIST,
      element: lazy(() => import("@modules/organograms/inreview-list")),
    },
    {
      link: ROUTE_L2.OMS_ORGANOGRAM_INAPPROVE_LIST,
      routeKey: ROUTE_KEY.OMS_ORGANOGRAM_INAPPROVE_LIST,
      element: lazy(() => import("@modules/organograms/inapprove-list")),
    },
  ],
};
