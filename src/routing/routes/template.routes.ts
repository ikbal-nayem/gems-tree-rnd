import { ROUTE } from "@constants/internal-route.constant";
import { ROUTE_KEY } from "@constants/route-keys.constant";
import { IAppRoutes } from "@gems/utils";
import { getUser } from "@services/helper/auth.helper";
import { lazy } from "react";

let userInfo = getUser();

let templateRouteList = [
  {
    link: ROUTE.ORG_TEMPLATE_CREATE,
    routeKey: ROUTE_KEY.OMS_ORG_TEMPLATE_CREATE,
    element: lazy(() => import("@modules/organogram-template/template/create")),
  },

  {
    link: ROUTE.ORG_TEMPLATE_LIST,
    routeKey: ROUTE_KEY.OMS_ORG_TEMPLATE_LIST,
    element: lazy(() => import("@modules/organogram-template/template-list")),
  },
];

let permissionRouteList =
  templateRouteList.filter(
    (d) =>
      Object.keys(userInfo?.userPermissionDTO)?.length > 0 &&
      userInfo?.userPermissionDTO?.sitemapList?.length > 0 &&
      userInfo?.userPermissionDTO?.sitemapList?.find(
        (e) => d?.routeKey === e?.routeKey
      )
  ) || [];

export const TemplateRoutes: IAppRoutes = {
  link: ROUTE.ORG_TEMPLATE,
  childrens: [
    {
      link: ROUTE.ORG_TEMPLATE_UPDATE,
      routeKey: ROUTE_KEY.OMS_ORG_TEMPLATE_UPDATE,
      element: lazy(
        () => import("@modules/organogram-template/template/update")
      ),
    },
    {
      link: ROUTE.ORG_TEMPLATE_VIEW,
      routeKey: ROUTE_KEY.OMS_ORG_TEMPLATE_VIEW,
      element: lazy(() => import("@modules/organogram-template/template/view")),
    },
    ...permissionRouteList,
  ],
};
