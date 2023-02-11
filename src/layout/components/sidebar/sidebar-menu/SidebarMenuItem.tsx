import clsx from "clsx";
import { KTSVG } from "helpers";
import { FC, ReactNode } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { useLayout } from "../../../core";
import { checkIsActive } from "@gems-web/utils";
import { Icon } from "@gems-web/components";

type Props = {
	to: string;
	title: string;
	icon?: string;
	fontIcon?: string;
	hasBullet?: boolean;
	children?: ReactNode;
};

const SidebarMenuItem: FC<Props> = ({
	children,
	to,
	title,
	icon,
	fontIcon,
	hasBullet = false,
}) => {
	const { pathname } = useLocation();
	const isActive = checkIsActive(pathname, to);
	const { config } = useLayout();
	const { app } = config;

	return (
		<div className="menu-item">
			<Link
				className={clsx("menu-link without-sub", { active: isActive })}
				to={to}
			>
				{hasBullet && (
					<span className="menu-bullet">
						<span className="bullet bullet-dot"></span>
					</span>
				)}
				{icon && app?.sidebar?.default?.menu?.iconType === "svg" && (
					<span className="menu-icon">
						{" "}
						<KTSVG path={icon} className="svg-icon-2" />
					</span>
				)}
				{fontIcon && <Icon icon={fontIcon} size={25} className="me-3" />}
				<span className="menu-title">{title}</span>
			</Link>
			{children}
		</div>
	);
};

export { SidebarMenuItem };
