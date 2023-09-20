import { DASHBOARD } from "@constants/internal-route.constant";
// import { ROUTE_KEY } from "@constants/route-keys.constant";
import { useAuth } from "@context/Auth";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { SidebarMenuItemWithSub } from "./SidebarMenuItemWithSub";

const menuData = [];

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
            return <ParentNode key={i} item={item} />;
          return null;
        })}
    </>
  );
};

const SidebarMenuMain = () => {
  return (
    <>
      <SidebarMenuItem to={DASHBOARD} title="ড্যাশবোর্ড" fontIcon="dashboard" />
      <PermissionMenus />
    </>
  );
};

export { SidebarMenuMain };
