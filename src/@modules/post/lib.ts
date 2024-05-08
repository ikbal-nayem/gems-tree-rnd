import { IMeta, IMetaKeyResponse } from "@gems/utils";

export type IOptions = {
	gradeList: IMetaKeyResponse[];
	serviceList: IMetaKeyResponse[];
	cadreList: IMetaKeyResponse[];
};

export const initMeta: IMeta = {
	page: 0,
	limit: 10,
	sort: [
		{
			order: "desc",
			field: "createdOn",
		},
	],
};