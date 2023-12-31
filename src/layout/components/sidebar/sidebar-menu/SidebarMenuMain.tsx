import { useAuth } from "@context/Auth";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { SidebarMenuItemWithSub } from "./SidebarMenuItemWithSub";
import { ROUTE_KEY } from "@constants/route-keys.constant";
import { MENU } from "@constants/menu-titles.constant";
import { ROUTE_L1, ROUTE_L2 } from "@constants/internal-route.constant";

const menuData = [
  // {
  //   routeKey: ROUTE_KEY.OMS_ORG_TEMPLATE,
  //   link: ROUTE_L1.ORG_TEMPLATE,
  //   title: MENU.BN.TEMPLATE,
  //   icon: "history",
  //   childrens: [
  //     {
  //       routeKey: ROUTE_KEY.OMS_ORG_TEMPLATE_CREATE,
  //       link: ROUTE_L2.ORG_TEMPLATE_CREATE,
  //       title: MENU.BN.TEMPLATE_CREATE,
  //       hasBullet: true,
  //     },
  //     {
  //       routeKey: ROUTE_KEY.OMS_ORG_TEMPLATE_LIST,
  //       link: ROUTE_L2.ORG_TEMPLATE_LIST,
  //       title: MENU.BN.TEMPLATE_LIST,
  //       hasBullet: true,
  //     },
  //   ],
  // },
  {
    routeKey: ROUTE_KEY.OMS_ORGANOGRAM,
    link: ROUTE_L1.OMS_ORGANOGRAM,
    title: MENU.BN.ORGANOGRAM,
    icon: "account_tree",
    childrens: [
       {
        routeKey: ROUTE_KEY.OMS_ORG_TEMPLATE_CREATE,
        link: ROUTE_L2.ORG_TEMPLATE_CREATE,
        title: MENU.BN.TEMPLATE_CREATE,
        hasBullet: true,
      },
      {
        routeKey: ROUTE_KEY.OMS_ORG_TEMPLATE_LIST,
        link: ROUTE_L2.ORG_TEMPLATE_LIST,
        title: MENU.BN.TEMPLATE_LIST,
        hasBullet: true,
      },
      {
        routeKey: ROUTE_KEY.OMS_ORGANOGRAM_LIST,
        link: ROUTE_L2.OMS_ORGANOGRAM_LIST,
        title: MENU.BN.ORGANOGRAM_LIST,
        hasBullet: true,
      },
      {
        routeKey: ROUTE_KEY.OMS_PROPOSAL_LIST,
        link: ROUTE_L2.OMS_PROPOSAL_LIST,
        title: MENU.BN.PROPOSAL_LIST,
        hasBullet: true,
      },
    ],
  },
  {
    routeKey: ROUTE_KEY.OMS_ORG_EMPLOYEE_LIST,
    link: ROUTE_L1.OMS_ORG_EMPLOYEE_LIST,
    title: MENU.BN.EMPLOYEE_LIST,
    icon: "groups",
  },
  {
    routeKey: ROUTE_KEY.OMS_POST_CONFIG,
    link: ROUTE_L1.OMS_POST_CONFIG,
    title: MENU.BN.POST_CONFIG,
    icon: "manage_accounts",
  },
];

const ParentNode = ({ item }) => {
  if (item?.childrens?.length)
    return (
      <SidebarMenuItemWithSub
        to={item?.link}
        title={item?.title}
        fontIcon={item?.icon}
        hasBullet={item?.hasBullet}
      >
        <PermissionMenus data={item?.childrens} />
      </SidebarMenuItemWithSub>
    );
  return (
    <SidebarMenuItem
      to={item?.link}
      title={item?.title}
      fontIcon={item?.icon}
      hasBullet={item?.hasBullet}
    />
  );
};

const PermissionMenus = ({ data = menuData }) => {
  const { currentUser } = useAuth();
  return (
    <>
      {data?.length > 0 &&
        data?.map((item, i) => {
          if (
            currentUser &&
            Object.keys(currentUser?.userPermissionDTO)?.length > 0 &&
            currentUser?.userPermissionDTO?.sitemapList?.length > 0 &&
            currentUser?.userPermissionDTO?.sitemapList?.find(
              (d) => d?.routeKey === item?.routeKey
            )
          )
            return (
              <ParentNode
                key={i}
                item={{
                  ...item,
                  title:
                    currentUser?.userPermissionDTO?.sitemapList?.find(
                      (d) => d?.routeKey === item?.routeKey
                    )?.nameBn || item?.title,
                }}
              />
            );
          return null;
        })}
    </>
  );
};

const SidebarMenuMain = () => {
  return (
    <>
      <SidebarMenuItem
        to={ROUTE_L1.DASHBOARD}
        title="ড্যাশবোর্ড"
        fontIcon="dashboard"
      />
      <PermissionMenus />
    </>
  );
};

export { SidebarMenuMain };
