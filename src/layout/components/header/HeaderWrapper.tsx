/* eslint-disable react-hooks/exhaustive-deps */
import clsx from "clsx";
import { useThemeMode } from "partials";
import { Link } from "react-router-dom";
import { useLayout } from "../../core";
import { Header } from "./Header";
import { Navbar } from "./Navbar";
import { Icon } from "@gems/components";
import { toAbsoluteUrl } from "@gems/utils";
import { ROUTE_L1 } from "@constants/internal-route.constant";

export function HeaderWrapper() {
	const { config, classes } = useLayout();
	const { mode } = useThemeMode();
	if (!config.app?.header?.display) {
		return null;
	}

	return (
		<div id="kt_app_header" className="app-header">
			<div
				id="kt_app_header_container"
				className={clsx(
					"app-container flex-lg-grow-1 w-100",
					classes.headerContainer.join(" "),
					config.app?.header?.default?.containerClass
				)}
			>
				{config.app.sidebar?.display && (
					<>
						<div
							className="d-flex align-items-center d-lg-none ms-n2 me-2"
							title="Show sidebar menu"
						>
							<div
								className="btn btn-icon btn-active-color-primary w-35px h-35px"
								id="kt_app_sidebar_mobile_toggle"
							>
								<Icon icon="view_headline" size={25} className="svg-icon-1" />
							</div>
							<div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
								<Link to={ROUTE_L1.DASHBOARD} className="d-lg-none">
									<img
										alt="Logo"
										src={
											mode === "dark"
												? toAbsoluteUrl("/media/auth/gov-logo.png")
												: toAbsoluteUrl("/media/logos/default-large.png")
										}
										className="h-40px"
									/>
								</Link>
							</div>
						</div>
					</>
				)}

				{!config.app.sidebar?.display && (
					<div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15">
						<Link to={ROUTE_L1.DASHBOARD}>
							{config.layoutType !== "dark-header" ? (
								<img
									alt="Logo"
									src={toAbsoluteUrl("/media/logos/default-large.png")}
									className="h-20px h-lg-30px app-sidebar-logo-default"
								/>
							) : (
								<>
									<img
										alt="Logo"
										src={toAbsoluteUrl("/media/auth/gov-logo.png")}
										className="h-20px h-lg-30px app-sidebar-logo-default theme-light-show"
									/>
									<img
										alt="Logo"
										src={toAbsoluteUrl("/media/auth/gov-logo.png")}
										className="h-20px h-lg-30px app-sidebar-logo-default theme-dark-show"
									/>
								</>
							)}
						</Link>
					</div>
				)}

				<div
					id="kt_app_header_wrapper"
					className="d-flex align-items-stretch justify-content-between flex-lg-grow-1"
				>
					{config.app.header.default?.content === "menu" &&
						config.app.header.default.menu?.display && (
							<div
								className="app-header-menu app-header-mobile-drawer align-items-stretch"
								data-kt-drawer="true"
								data-kt-drawer-name="app-header-menu"
								data-kt-drawer-activate="{default: true, lg: false}"
								data-kt-drawer-overlay="true"
								data-kt-drawer-width="225px"
								data-kt-drawer-direction="end"
								data-kt-drawer-toggle="#kt_app_header_menu_toggle"
								data-kt-swapper="true"
								data-kt-swapper-mode="{default: 'append', lg: 'prepend'}"
								data-kt-swapper-parent="{default: '#kt_app_body', lg: '#kt_app_header_wrapper'}"
							>
								<Header />
							</div>
						)}
					<Navbar />
				</div>
			</div>
		</div>
	);
}
