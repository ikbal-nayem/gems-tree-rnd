import "assets/sass/plugins.scss";
import "assets/sass/style.scss";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
// Apps
import { AuthProvider } from "@context/Auth";
import { ENV } from "config/ENV.config";
import { AppRoutes } from "routing/AppRoutes";

// Google analytics
import ReactGA from "react-ga4";
ReactGA.initialize(ENV.googleAnalyticsTag);

const queryClient = new QueryClient();
const container = document.getElementById("root");
if (container) {
	createRoot(container).render(
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<AppRoutes />
			</AuthProvider>
			{/* <ReactQueryDevtools initialIsOpen={false} /> */}
		</QueryClientProvider>
	);
}
