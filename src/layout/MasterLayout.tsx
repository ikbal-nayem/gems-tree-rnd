import { PageDataProvider } from "@context/PageData";
import { reInitMenu } from "helpers";
import { ThemeModeProvider } from "partials";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Content } from "./components/content";
import { HeaderWrapper } from "./components/header";
import { ScrollTop } from "./components/scroll-top";
import { Sidebar } from "./components/sidebar";
import { ToolbarWrapper } from "./components/toolbar";

const MasterLayout = () => {
	const location = useLocation();
	useEffect(() => {
		reInitMenu();
	}, [location.key]);

	return (
		<PageDataProvider>
			<ThemeModeProvider>
				<div className="d-flex flex-column flex-root app-root" id="kt_app_root">
					<div
						className="app-page flex-column flex-column-fluid"
						id="kt_app_page"
					>
						<HeaderWrapper />
						<div
							className="app-wrapper flex-column flex-row-fluid"
							id="kt_app_wrapper"
						>
							<Sidebar />
							<div
								className="app-main flex-column flex-row-fluid"
								id="kt_app_main"
							>
								<div className="d-flex flex-column flex-column-fluid">
									<ToolbarWrapper />
									<Content>
										<Outlet />
									</Content>
								</div>
								{/* <FooterWrapper /> */}
							</div>
						</div>
					</div>
				</div>
				{/* begin:: Drawers */}
				{/* <ActivityDrawer /> */}
				{/* <DrawerMessenger /> */}
				{/* end:: Drawers */}
				{/* <UpgradePlan /> */}
				{/* end:: Modals */}
				<ScrollTop />
			</ThemeModeProvider>
		</PageDataProvider>
	);
};

export default MasterLayout;
