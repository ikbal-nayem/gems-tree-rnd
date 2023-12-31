import { USER_INFO, numEnToBn } from "@gems/utils";
import { LocalStorageService } from "@services/utils/localStorage.service";

export const tooltip_box = (
	label: string,
	value: any,
	singleLine: boolean = true,
	className?: string
) => {
	return (
		'<div class="arrow_box ' +
		className +
		'">' +
		label +
		(singleLine ? " : " : "<br/>") +
		value +
		"</div>"
	);
};

export const COMMON_ICONS = {
	RESET: '<span class="material-icons-outlined text-primary">restart_alt</span>',
	ZOOM: '<span class="material-icons-outlined text-primary">zoom_in</span>',
};

export const bnFont = "Kalpurush";

export const yaxis = {
	labels: {
		show: true,
		formatter(value: number): any {
			return numEnToBn(value);
		},
	},
};

const userInfo = LocalStorageService.get(USER_INFO);

export const requestBody = {
	rankIds: null,
	cadreKey: null,
	organizationId: userInfo?.organization?.id,
	controllingOrganizationId: userInfo?.controllingAuthority?.id
};

export interface IChartSpec {
	size: number;
	fontSize: number;
	isZoomed: boolean;
}