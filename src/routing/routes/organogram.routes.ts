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

    // Organogram Change Proposal (Permieble) Routs Start Here ...
    {
      link: ROUTE_L2.OMS_PROPOSAL_LIST,
      routeKey: ROUTE_KEY.OMS_PROPOSAL_LIST,
      element: lazy(
        () => import("@modules/organogram/proposal-organogram/list")
      ),
    },
    {
      link: ROUTE_L2.OMS_ORGANOGRAM_CHANGE_TYPE_LIST,
      routeKey: ROUTE_KEY.OMS_ORGANOGRAM_CHANGE_TYPE_LIST,
      element: lazy(() => import("@modules/organogram/changeTypeList")),
    },
    {
      link: ROUTE_L2.OMS_ORGANOGRAM_CHECKLIST,
      routeKey: ROUTE_KEY.OMS_ORGANOGRAM_CHANGE_TYPE_LIST,
      element: lazy(() => import("@modules/organogram/checkList")),
    },
    {
      link: ROUTE_L2.OMS_ORGANOGRAM_PROPOSAL_VIEW,
      // routeKey: ROUTE_KEY.OMS_ORGANOGRAM_PROPOSAL_VIEW,
      element: lazy(
        () => import("@modules/organogram/proposal-organogram/view/index")
      ),
    },
    {
      link: ROUTE_L2.OMS_ORGANOGRAM_PROPOSAL_UPDATE,
      // routeKey: ROUTE_KEY.OMS_ORGANOGRAM_PROPOSAL_UPDATE,
      element: lazy(
        () => import("@modules/organogram/proposal-organogram/update")
      ),
    },
    {
      link: ROUTE_L2.OMS_ORGANOGRAM_PROPOSAL_NODE_LIST,
      routeKey: ROUTE_KEY.OMS_ORGANOGRAM_PROPOSAL_NODE_LIST,
      element: lazy(
        () => import("@modules/organogram/proposal-organogram/node/list")
      ),
    },
    {
      link: ROUTE_L2.ORG_ORGANOGRAM_PROPOSAL_NODE_CREATE,
      routeKey: ROUTE_KEY.ORG_ORGANOGRAM_PROPOSAL_NODE_CREATE,
      element: lazy(
        () => import("@modules/organogram/proposal-organogram/node/create")
      ),
    },
    {
      link: ROUTE_L2.ORG_ORGANOGRAM_PROPOSAL_NODE_UPDATE,
      routeKey: ROUTE_KEY.ORG_ORGANOGRAM_PROPOSAL_NODE_UPDATE,
      element: lazy(
        () => import("@modules/organogram/proposal-organogram/node/update")
      ),
    },
    {
      link: ROUTE_L2.OMS_ORGANOGRAM_PROPOSAL_MAIN_ACTIVITY,
      routeKey: ROUTE_KEY.OMS_ORGANOGRAM_MAIN_ACTIVITY,
      element: lazy(
        () => import("@modules/organogram/proposal-organogram/main-activity")
      ),
    },
    {
      link: ROUTE_L2.OMS_ORGANOGRAM_PROPOSAL_ALLOCATION_OF_BUSINESS,
      routeKey: ROUTE_KEY.OMS_ORGANOGRAM_PROPOSAL_ALLOCATION_OF_BUSINESS,
      element: lazy(
        () =>
          import(
            "@modules/organogram/proposal-organogram/allocation-of-business"
          )
      ),
    },
  ],
};
