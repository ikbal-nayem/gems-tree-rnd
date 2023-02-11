import { useEffect } from "react";
import ReactGA from "react-ga4";
import { useLocation } from "react-router-dom";

const RouteChangeTracker = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: pathname });
	}, [pathname]);

	return <></>;
};

export default RouteChangeTracker;
