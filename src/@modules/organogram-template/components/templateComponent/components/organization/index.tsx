import { LABELS } from "@constants/common.constant";
import { Separator, Autocomplete } from "@gems/components";
import { IObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import OrgFromOrgtype from "./OrgFromOrgtype";
import OrgList from "./SelectedOrgView";

const initPayload = {
	meta: {
		page: 0,
		limit: 25,
		sort: [{ order: "asc", field: "serialNo" }],
	},
	body: { searchKey: "" },
};

interface IOrganizations {
	formProps: any;
}

const Organizations = ({ formProps }: IOrganizations) => {
	const { setValue, getValues, watch } = formProps;

	const getOrgList = (searchKey, callback) => {
		initPayload.body = { searchKey };
		OMSService.getOrganizationList(initPayload).then((resp) =>
			callback(resp?.body)
		);
	};

	const onOrgSelect = (selected: IObject, toggle: boolean = false) => {
		const currentOrg = getValues("templateOrganizationsDtoList") || [];
		const cIdx = currentOrg?.findIndex((co) => co?.id === selected?.id);
		if (cIdx < 0) currentOrg.push(selected);
		else if (toggle) currentOrg.splice(cIdx, 1);
		setValue("templateOrganizationsDtoList", [...currentOrg]);
	};

	const onOrgCancle = (idx) => {
		const currentOrg = getValues("templateOrganizationsDtoList") || [];
		currentOrg?.splice(idx, 1);
		setValue("templateOrganizationsDtoList", [...currentOrg]);
	};

	const selectedOrgList = watch("templateOrganizationsDtoList");

	return (
		<div className="card border p-3">
			<div className="card-head d-flex justify-content-between align-items-center">
				<h4 className="m-0">{LABELS.BN.ORGANIZATION}</h4>
			</div>
			<Separator className="mt-1" />
			<div className="row">
				<div className="col-md-6">
					<OrgFromOrgtype
						selectedOrgList={selectedOrgList}
						onOrgSelect={onOrgSelect}
					/>
				</div>
				<div className="col-md-6">
					<Autocomplete
						placeholder="প্রতিষ্ঠান"
						isAsync
						noMargin
						closeMenuOnSelect={false}
						getOptionLabel={(op) => op.nameBn}
						getOptionValue={(op) => op?.id}
						loadOptions={getOrgList}
						onChange={(org) => onOrgSelect(org, false)}
					/>
				</div>
			</div>
			<OrgList selectedOrgList={selectedOrgList} onOrgCancle={onOrgCancle} />
		</div>
	);
};

export default Organizations;
