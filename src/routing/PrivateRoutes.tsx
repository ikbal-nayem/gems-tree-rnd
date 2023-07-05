import { TopProgressCom } from "@gems/components";
import { IAppRoutes } from "@interface/common.interface";
import MasterLayout from "layout/MasterLayout";
import { Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppRouteList } from "./routes/app.routes";

const routeList = (routes: IAppRoutes[]) =>
	routes.map((route, index: number) => {
		if (route.childrens && route.childrens.length) {
			return (
				<Route
					path={route.link}
					element={
						route.element ? (
							<Suspense fallback={<TopProgressCom />}>
								<route.element />
							</Suspense>
						) : (
							<Outlet />
						)
					}
					key={index}
				>
					{routeList(route.childrens)}
				</Route>
			);
		}

		return (
			<Route
				key={index}
				path={route.link}
				element={
					route.redirect ? (
						<Navigate to={route.redirect} />
					) : (
						<Suspense fallback={<TopProgressCom />}>
							<route.element />
						</Suspense>
					)
				}
			/>
		);
	});

const PrivateRoutes = () => (
	<Routes>
		<Route element={<MasterLayout />}>{routeList(AppRouteList)}</Route>
	</Routes>
);

export { PrivateRoutes, routeList };
