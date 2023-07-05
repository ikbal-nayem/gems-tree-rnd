import { EMSPMIS_SERVICE, OMS_SERVICE } from "@gems/utils";
import { axiosIns } from "config/api.config";

export const CommonService = {
	checkDraft: async (): Promise<any> =>
		await axiosIns.get(EMSPMIS_SERVICE + "draft/has-draft"),

	getOrganizationByTagname: async (tag: string): Promise<any> =>
		await axiosIns.get(
			OMS_SERVICE + "organization/get-Organization-by-tagName/" + tag
		),

	getOrganizationByTraningTag: async (
		orgId: string,
		traningTag: string
	): Promise<any> =>
		await axiosIns.get(
			OMS_SERVICE +
				`organization/get-list-by-parent-training-tag/${orgId}/${traningTag}`
		),
};
