import { Autocomplete } from "@gems/components";
import { IObject, notNullOrUndefined } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
interface IOrganizations {
  formProps: any;
  organizationGroupList?: IObject[];
}

const Organizations = ({
  formProps,
  organizationGroupList,
}: IOrganizations) => {
  const {
    control,
    formState: { errors },
  } = formProps;
  const [organizationList, setOrganizationList] = useState<IObject[]>([]);
  const [allOrganizationsCache, setAllOrganizationsCache] = useState<IObject[]>(
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

  useEffect(() => {
    getOrgList();
  }, []);

  const onOrgGroupChange = (OrgGroup) => {
    if (notNullOrUndefined(OrgGroup)) {
      OMSService.FETCH.organizationsByGroupId(OrgGroup?.id).then((resp) =>
        setOrganizationList(resp?.body)
      );
    } else setOrganizationList(allOrganizationsCache);
  };

  return (
    <div className="row">
      <div className="col-md-6 col-12 mb-4">
        <Autocomplete
          label="প্রতিষ্ঠানের গ্ৰুপ"
          placeholder="প্রতিষ্ঠানের গ্ৰুপ বাছাই করুন"
          name="organizationGroupDto"
          options={organizationGroupList}
          noMargin
          control={control}
          // autoFocus
          getOptionLabel={(op) => op?.orgGroupBn}
          getOptionValue={(op) => op?.id}
          onChange={(org) => onOrgGroupChange(org)}
          isError={!!errors?.organizationGroupDto}
          errorMessage={errors?.organizationGroupDto?.message as string}
        />
      </div>
      <div className="col-md-6 col-12">
        <Autocomplete
          label="প্রতিষ্ঠান"
          placeholder="প্রতিষ্ঠান বাছাই করুন"
          name="organization"
          options={organizationList}
          noMargin
          isRequired="প্রতিষ্ঠান বাছাই করুন"
          control={control}
          // autoFocus
          getOptionLabel={(op) => op.nameBn}
          getOptionValue={(op) => op?.id}
          isError={!!errors?.organization}
          errorMessage={errors?.organization?.message as string}
        />
      </div>
    </div>
  );
};

export default Organizations;
