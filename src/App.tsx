import { GEMSApp } from "@gems-web/components";
import RouteChangeTracker from "@services/helper/tracker.helper";
import { I18nProvider } from "i18n/i18nProvider";
import { LayoutProvider, LayoutSplashScreen } from "layout/core";
import { MasterInit } from "layout/MasterInit";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const App = () => {
	return (
		<Suspense fallback={<LayoutSplashScreen />}>
			<GEMSApp>
				<I18nProvider>
					<LayoutProvider>
						<Outlet />
						<MasterInit />
					</LayoutProvider>
				</I18nProvider>
			</GEMSApp>
			<RouteChangeTracker />
		</Suspense>
	);
};

export { App };
