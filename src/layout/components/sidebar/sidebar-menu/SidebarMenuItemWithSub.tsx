import clsx from "clsx";
import { KTSVG } from "helpers";
import React, { ReactNode } from "react";
import { useLocation } from "react-router";
import { useLayout } from "../../../core";
import { checkIsActive } from "@gems/utils";
import { Icon } from "@gems/components";

type Props = {
	to: string;
	title: string;
	icon?: string;
	fontIcon?: string;
	hasBullet?: boolean;
	children: ReactNode;
};

const SidebarMenuItemWithSub: React.FC<Props> = ({
	children,
	to,
	title,
	icon,
	fontIcon,
	hasBullet,
}) => {
	const { pathname } = useLocation();
	const isActive = checkIsActive(pathname, to);
	const { config } = useLayout();
	const { app } = config;

	return (
		<div
			className={clsx("menu-item", { "here show": isActive }, "menu-accordion")}
			data-kt-menu-trigger="click"
		>
			<span className="menu-link">
				{hasBullet && (
					<span className="menu-bullet">
						<span className="bullet bullet-dot"></span>
					</span>
				)}
				{icon && app?.sidebar?.default?.menu?.iconType === "svg" && (
					<span className="menu-icon">
						<KTSVG path={icon} className="svg-icon-2" />
					</span>
				)}
				{fontIcon && <Icon icon={fontIcon} size={25} className="me-3" />}
				<span className="menu-title">{title}</span>
				<span className="menu-arrow"></span>
			</span>
			<div
				className={clsx("menu-sub menu-sub-accordion", {
					"menu-active-bg": isActive,
				})}
			>
				{children}
			</div>
		</div>
	);
};

export { SidebarMenuItemWithSub };
