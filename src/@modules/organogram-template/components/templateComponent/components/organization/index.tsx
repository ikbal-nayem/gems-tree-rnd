import { LABELS } from "@constants/common.constant";
import { Autocomplete, Separator } from "@gems/components";
import { IObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useCallback } from "react";
import OrgList from "./OrgList";

const initPayload = {
	meta: {
		page: 0,
		limit: 100,
		sort: [{ order: "asc", field: "serialNo" }],
	},
	body: { searchKey: "" },
};

interface IOrganizations {
	formProps: any;
}

const Organizations = ({ formProps }: IOrganizations) => {
	const { setValue, getValues, watch } = formProps;

	const onOrgSelect = (selected: IObject[]) => {
		const currentOrg = getValues("organizationList") || [];
		selected?.forEach((so) => {
			const cIdx = currentOrg?.findIndex((co) => co?.id === so?.id);
			if (cIdx < 0) currentOrg.push(so);
		});
		setValue("organizationList", [...currentOrg]);
	};

	const onOrgCancle = (idx) => {
		const currentOrg = getValues("organizationList") || [];
		currentOrg?.splice(idx, 1);
		setValue("organizationList", [...currentOrg]);
	};

	const getOrgList = useCallback(
		(searchKey) =>
			new Promise((resolve) => {
				initPayload.body = { searchKey };
				OMSService.getOrganizationList(initPayload).then((resp) =>
					resolve(resp?.body)
				);
			}),
		[]
	);

	return (
		<div className="card border p-3">
			<div className="card-head d-flex justify-content-between align-items-center">
				<h4 className="m-0">{LABELS.BN.ORGANIZATION}</h4>
			</div>
			<Separator className="mt-1" />
			<div className="border p-3 bg-gray-100 rounded">
				<div className="row">
					<div className="col-md-6">
						<Autocomplete
							label="প্রতিষ্ঠান টাইপ"
							placeholder="প্রতিষ্ঠান টাইপ বাছাই করুন"
							options={[]}
							noMargin
							getOptionLabel={(op) => op.nameBn}
							getOptionValue={(op) => op?.id}
							name="postDTO"
						/>
					</div>
					<div className="col-md-6">
						<Autocomplete
							label="প্রতিষ্ঠান"
							placeholder="প্রতিষ্ঠান বাছাই করুন"
							isAsync
							noMargin
							getOptionLabel={(op) => op.nameBn}
							getOptionValue={(op) => op?.id}
							loadOptions={getOrgList}
							onChange={(org) => onOrgSelect([org])}
						/>
					</div>
				</div>
			</div>
			<OrgList
				selectedOrgList={watch("organizationList")}
				onOrgCancle={onOrgCancle}
			/>
		</div>
	);
};

export default Organizations;
