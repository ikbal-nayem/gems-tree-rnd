import { ROUTE_L1, ROUTE_L2 } from "@constants/internal-route.constant";
import { ROUTE_KEY } from "@constants/route-keys.constant";
import { IAppRoutes } from "@gems/utils";
import { lazy } from "react";
// import { getPermittedRouteList } from "utility/utils";

let routeList = [
  {
    link: ROUTE_L2.ORG_TEMPLATE_CREATE,
    routeKey: ROUTE_KEY.OMS_ORG_TEMPLATE_CREATE,
    element: lazy(() => import("@modules/organogram-template/template/create")),
  },
  {
    link: ROUTE_L2.ORG_EXIST_ORGANOGRAM_CREATE,
    routeKey: ROUTE_KEY.OMS_ORG_EXIST_ORGANOGRAM_CREATE,
    element: lazy(
      () =>
        import("@modules/organogram-template/template/existOrganogramCreate")
    ),
  },
  {
    link: ROUTE_L2.ORG_TEMPLATE_LIST,
    routeKey: ROUTE_KEY.OMS_ORG_TEMPLATE_LIST,
    element: lazy(() => import("@modules/organogram-template/template-list")),
  },
  {
    link: ROUTE_L2.OMS_PROPOSAL_LIST,
    routeKey: ROUTE_KEY.OMS_PROPOSAL_LIST,
    element: lazy(() => import("@modules/organogram-template/proposal-list")),
  },
];

// let permissionRouteList = getPermittedRouteList(routeList);

export const TemplateRoutes: IAppRoutes = {
  link: ROUTE_L1.ORG_TEMPLATE,
  childrens: [
    {
      link: ROUTE_L2.ORG_TEMPLATE_UPDATE,
      // routeKey: ROUTE_KEY.OMS_ORG_TEMPLATE_UPDATE,
      element: lazy(
        () => import("@modules/organogram-template/template/update")
      ),
    },
    {
      link: ROUTE_L2.ORG_TEMPLATE_NODE_CREATE,
      // routeKey: ROUTE_KEY.ORG_TEMPLATE_NODE_CREATE,
      element: lazy(() => import("@modules/organogram/draft-list/node/Create")),
    },
    {
      link: ROUTE_L2.ORG_TEMPLATE_NODE_UPDATE,
      // routeKey: ROUTE_KEY.ORG_TEMPLATE_NODE_UPDATE,
      element: lazy(() => import("@modules/organogram/draft-list/node/Update")),
    },
    {
      link: ROUTE_L2.ORG_TEMPLATE_VIEW,
      // routeKey: ROUTE_KEY.OMS_ORG_TEMPLATE_VIEW,
      element: lazy(() => import("@modules/organogram-template/template/view")),
    },
    {
      link: ROUTE_L2.OMS_ORGANOGRAM_NODE_LIST,
      // routeKey: ROUTE_KEY.OMS_ORGANOGRAM_NODE_LIST,
      element: lazy(() => import("@modules/organogram/draft-list/node/list")),
    },
    {
      link: ROUTE_L2.OMS_ORGANOGRAM_MAIN_ACTIVITY,
      // routeKey: ROUTE_KEY.OMS_ORGANOGRAM_MAIN_ACTIVITY,
      element: lazy(
        () => import("@modules/organogram/draft-list/main-activity")
      ),
    },
    {
      link: ROUTE_L2.OMS_ORGANOGRAM_ALLOCATION_OF_BUSINESS,
      // routeKey: ROUTE_KEY.OMS_ORGANOGRAM_ALLOCATION_OF_BUSINESS,
      element: lazy(
        () => import("@modules/organogram/draft-list/allocation-of-business")
      ),
    },
    ...routeList,
  ],
};
