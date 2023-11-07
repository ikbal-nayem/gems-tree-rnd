import { ROUTE_L1, ROUTE_L2 } from "@constants/internal-route.constant";
import { ROUTE_KEY } from "@constants/route-keys.constant";
import { IAppRoutes } from "@gems/utils";
import { getUser } from "@services/helper/auth.helper";
import { lazy } from "react";

let userInfo = getUser();

let organogramRouteList = [
  {
    link: ROUTE_L2.OMS_ORGANOGRAM_LIST,
    routeKey: ROUTE_KEY.OMS_ORGANOGRAM_LIST,
    element: lazy(() => import("@modules/organogram/list")),
  },
];

let permissionRouteList =
  organogramRouteList.filter(
    (d) =>
      Object.keys(userInfo?.userPermissionDTO)?.length > 0 &&
      userInfo?.userPermissionDTO?.sitemapList?.length > 0 &&
      userInfo?.userPermissionDTO?.sitemapList?.find(
        (e) => d?.routeKey === e?.routeKey
      )
  ) || [];

export const OrganogramRoutes: IAppRoutes = {
  link: ROUTE_L1.OMS_ORGANOGRAM,
  childrens: [
    {
      link: ROUTE_L2.OMS_ORGANOGRAM_VIEW,
      routeKey: ROUTE_KEY.OMS_ORGANOGRAM_VIEW,
      element: lazy(() => import("@modules/organogram/view")),
    },
    ...permissionRouteList,
  ],
};
