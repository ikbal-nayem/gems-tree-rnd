import { ContentPreloader, PageNotFound, useApp } from '@gems/components';
import { IAppRoutes, IObject, TopProgressCom } from '@gems/utils';
import MasterLayout from 'layout/MasterLayout';
import { Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppRouteList } from './routes/app.routes';

const routeList = (routes: IAppRoutes[], sitemapList: IObject[]) =>
	routes.map((route, index: number) => {
		const isUnauthorized = route?.routeKey && !sitemapList?.some((s) => s.routeKey === route.routeKey);

		if (route.childrens && route.childrens.length) {
			return (
				<Route
					path={route.link}
					element={
						route.element && !isUnauthorized ? (
							<Suspense fallback={<TopProgressCom />}>
								<route.element />
							</Suspense>
						) : isUnauthorized ? (
							<PageNotFound />
						) : (
							<>
								<Outlet />
							</>
						)
					}
					key={index}
				>
					{routeList(route.childrens, sitemapList)}
				</Route>
			);
		}

		return (
			<Route
				key={index}
				path={route.link}
				element={
					route.redirect ? (
						<Navigate to={route.redirect} replace />
					) : isUnauthorized ? (
						<PageNotFound />
					) : route.element ? (
						<Suspense fallback={<TopProgressCom />}>
							<route.element />
						</Suspense>
					) : (
						<></>
					)
				}
			/>
		);
	});

const PrivateRoutes = () => {
	const { isPermissionChecking, userPermissions } = useApp();
	const sitemapList = userPermissions?.sitemapList;

	if (isPermissionChecking) return <ContentPreloader loaderText='অনুমতি যাচাই করা হচ্ছে...' />;

	return (
		<Routes>
			<Route element={<MasterLayout />}>{routeList(AppRouteList, sitemapList)}</Route>
		</Routes>
	);
};

export { PrivateRoutes };
