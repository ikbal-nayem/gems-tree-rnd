import { LABELS } from "@constants/common.constant";
import { Separator, Autocomplete } from "@gems/components";
import { IObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import OrgFromOrgtype from "./OrgFromOrgtype";
import OrgList from "./SelectedOrgView";
import { deFocusById } from "utility/utils";

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
  notOrganizationData: boolean;
  setNotOrganizationData: (validateCheck: boolean) => void;
}

const Organizations = ({
  formProps,
  notOrganizationData,
  setNotOrganizationData,
}: IOrganizations) => {
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
    setNotOrganizationData(false);
  };

  const onMultiOrgSelect = (selected: IObject[], isAdd: boolean) => {
    const currentOrg = getValues("templateOrganizationsDtoList") || [];
    selected?.forEach((s) => {
      const cIdx = currentOrg?.findIndex((co) => co?.id === s?.id);
      if (cIdx < 0 && isAdd) currentOrg.push(s);
      else if (cIdx >= 0 && !isAdd) currentOrg.splice(cIdx, 1);
    });
    setValue("templateOrganizationsDtoList", [...currentOrg]);
    setNotOrganizationData(false);
  };

  const onOrgCancle = (idx) => {
    const currentOrg = getValues("templateOrganizationsDtoList") || [];
    currentOrg?.splice(idx, 1);
    setValue("templateOrganizationsDtoList", [...currentOrg]);
  };

  const selectedOrgList = watch("templateOrganizationsDtoList");

  if (selectedOrgList?.length > 0) deFocusById("organizationBlock");
  // else focusById("organizationBlock", true);

  return (
    <div className="card border p-3" id="organizationBlock">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.ORGANIZATION}</h4>
      </div>
      <Separator className="mt-1" />
      <div className="row">
        <div className="col-md-6">
          <OrgFromOrgtype
            selectedOrgList={selectedOrgList}
            onOrgSelect={onOrgSelect}
            onMultiOrgSelect={onMultiOrgSelect}
          />
        </div>
        <div className="col-md-6">
          <Autocomplete
            placeholder="প্রতিষ্ঠান"
            isRequired
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
      {notOrganizationData && (
        <p className="text-danger fs-6 mb-0">প্রতিষ্ঠান যুক্ত করুন</p>
      )}
    </div>
  );
};

export default Organizations;
