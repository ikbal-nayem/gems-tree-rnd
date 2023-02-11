import { DASHBOARD } from "@constants/internal-route.constant";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { SidebarMenuItemWithSub } from "./SidebarMenuItemWithSub";

const SidebarMenuMain = () => {
  return (
		<>
			<SidebarMenuItem to={DASHBOARD} title="ড্যাশবোর্ড" fontIcon="dashboard" />
		</>
	);
};

export { SidebarMenuMain };
