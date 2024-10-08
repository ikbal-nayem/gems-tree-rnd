import { DrawerComponent } from "assets/ts/components";
import clsx from "clsx";
import { FC, ReactNode, useEffect } from "react";
import { useLocation } from "react-router";
import { useLayout } from "../../core";

type ContentProps = {
	children: ReactNode;
};

const Content: FC<ContentProps> = ({ children }) => {
	const { config, classes } = useLayout();
	const location = useLocation();
	useEffect(() => {
		DrawerComponent.hideAll();
	}, [location]);

	const appContentContainer = config.app?.content?.container;
	return (
		<div
			id="kt_app_content"
			className={clsx(
				"app-content flex-column-fluid pt-0",
				classes.content.join(" "),
				config?.app?.content?.class
			)}
		>
			{appContentContainer ? (
				<div
					id="kt_app_content_container"
					className={clsx("app-container", classes.contentContainer.join(" "), {
						"container-xxl": appContentContainer === "fixed",
						"container-fluid": appContentContainer === "fluid",
					})}
				>
					{children}
				</div>
			) : (
				<>{children}</>
			)}
		</div>
	);
};

export { Content };
