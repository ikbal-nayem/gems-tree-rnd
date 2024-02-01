import { LABELS } from "@constants/common.constant";
import { Autocomplete, Separator } from "@gems/components";
import { IObject, notNullOrUndefined } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { deFocusById } from "utility/utils";
interface IOrganizations {
  formProps: any;
  isTemplate: boolean;
  setOrgGroupTriggered?: (flag: boolean) => void;
  setOrgTriggered?: (flag: boolean) => void;
}

const Organizations = ({
  formProps,
  isTemplate,
  setOrgTriggered,
  setOrgGroupTriggered,
}: IOrganizations) => {
  const {
    watch,
    control,
    formState: { errors },
  } = formProps;
  const [organizationList, setOrganizationList] = useState<IObject[]>([]);
  const [allOrganizationsCache, setAllOrganizationsCache] = useState<IObject[]>(
    []
  );
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
    OMSService.getOrganizationList(payload).then((resp) => {
      setOrganizationList(resp?.body);
      setAllOrganizationsCache(resp?.body); // Caching all_Orgs
    });
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

  useEffect(() => {
    onOrgGroupChange(watch("organizationGroupDto"));
  }, [watch("organizationGroupDto")]);

  const onOrgGroupChange = (OrgGroup) => {
    if (!isTemplate) {
      if (notNullOrUndefined(OrgGroup)) {
        setOrgGroupTriggered(true);
        OMSService.FETCH.organizationsByGroupId(OrgGroup?.id).then((resp) =>
          setOrganizationList(resp?.body)
        );
      } else setOrganizationList(allOrganizationsCache);
    }
  };

  if (watch("organizationGroupDto")) {
    deFocusById("organizationBlock");
    // setNotOrganizationData(false);
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
            label="প্রতিষ্ঠানের গ্ৰুপ"
            placeholder="প্রতিষ্ঠানের গ্ৰুপ বাছাই করুন"
            name="organizationGroupDto"
            options={organizationGroupList}
            noMargin
            isRequired={isTemplate ? "প্রতিষ্ঠানের গ্ৰুপ বাছাই করুন" : false}
            control={control}
            // autoFocus
            getOptionLabel={(op) => op?.nameBn}
            getOptionValue={(op) => op?.id}
            onChange={(org) => onOrgGroupChange(org)}
            isError={!!errors?.organizationGroupDto}
            errorMessage={errors?.organizationGroupDto?.message as string}
          />
        </div>
        {!isTemplate && (
          <div className="col-md-6">
            <Autocomplete
              label="প্রতিষ্ঠান"
              placeholder="প্রতিষ্ঠান বাছাই করুন"
              name="templateOrganizationsDto"
              options={organizationList}
              noMargin
              isRequired="প্রতিষ্ঠান বাছাই করুন"
              control={control}
              // autoFocus
              getOptionLabel={(op) => op.nameBn}
              getOptionValue={(op) => op?.id}
              onChange={() => setOrgTriggered(true)}
              isError={!!errors?.templateOrganizationsDto}
              errorMessage={errors?.templateOrganizationsDto?.message as string}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Organizations;
