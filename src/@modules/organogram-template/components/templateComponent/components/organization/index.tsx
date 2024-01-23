import { LABELS } from "@constants/common.constant";
import { Separator, Autocomplete } from "@gems/components";
import { IObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { deFocusById } from "utility/utils";
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
  const { watch, control } = formProps;
  const [organizationList, setOrganizationList] = useState<IObject[]>([]);
  const [organizationGroupList, setOrganizationGroupList] = useState<IObject[]>(
    []
  );
  const getOrgList = () => {
    const payload = {
      meta: {
        page: 0,
        limit: 1000,
        sort: [{ order: "asc", field: "serialNo" }],
      },
      body: { searchKey: "" },
    };
    OMSService.getOrganizationList(payload).then((resp) =>
      setOrganizationList(resp?.body)
    );
  };

  const getOrgGroupList = () => {
    const payload = {
      meta: {
        page: 0,
        limit: 500,
        sort: [{ order: "asc", field: "createdOn" }],
      },
      body: { searchKey: "" },
    };
    OMSService.getOrganizationTypeList(payload).then((resp) =>
      setOrganizationGroupList(resp?.body)
    );
  };
  useEffect(() => {
    getOrgList();
    getOrgGroupList();
  }, []);

  const onOrgGroupChange = (OrgGroup) => {
    OMSService.FETCH.organizationsByGroupId(OrgGroup?.id).then((resp) =>
      setOrganizationList(resp?.body)
    );
  };

  if (watch("organizationGroup")) {
    deFocusById("organizationBlock");
    setNotOrganizationData(false);
    // alert(watch("organizationGroup")?.orgTypeBn);
  }

  return (
    <div className="card border p-3" id="organizationBlock">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.ORGANIZATION}</h4>
      </div>
      <Separator className="mt-1" />
      <div className="row">
        <div className="col-md-6">
          <Autocomplete
            placeholder="প্রতিষ্ঠানের ধরণ"
            options={organizationGroupList}
            name="organizationGroup"
            noMargin
            control={control}
            getOptionLabel={(op) => op?.orgGroupBn}
            getOptionValue={(op) => op?.orgGroupBn}
            onChange={(org) => onOrgGroupChange(org)}
          />
        </div>
        <div className="col-md-6">
          <Autocomplete
            placeholder="প্রতিষ্ঠান"
            name="organization"
            options={organizationList}
            noMargin
            control={control}
            getOptionLabel={(op) => op.nameBn}
            getOptionValue={(op) => op?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default Organizations;
