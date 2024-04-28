import { Autocomplete } from "@gems/components";
import { IObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useCallback, useRef } from "react";
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
    setValue,
    formState: { errors },
  } = formProps;

  const payload = {
    meta: {
      page: 0,
      limit: 1000,
      sort: [{ order: "asc", field: "serialNo" }],
    },
    body: { searchKey: "", organizationCategoryId: null },
  };
  const orgPayload = useRef(payload);

  const onOrgGroupChange = (OrgGroup) => {
    setValue("organization", null);
    orgPayload.current.body = {
      ...orgPayload.current.body,
      organizationCategoryId: OrgGroup?.id || null,
    };
  };

  const getAsyncOranizationList = useCallback((searchKey, callback) => {
    orgPayload.current.body = {
      ...orgPayload.current.body,
      searchKey: searchKey ? searchKey?.trim() : "",
    };
    OMSService.getOrganizationList(orgPayload?.current).then((resp) =>
      callback(resp?.body)
    );
  }, []);

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
          getOptionLabel={(op) => op?.nameBn}
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
          isAsync
          noMargin
          isRequired="প্রতিষ্ঠান বাছাই করুন"
          control={control}
          // autoFocus
          getOptionLabel={(op) => op.nameBn}
          getOptionValue={(op) => op?.id}
          loadOptions={getAsyncOranizationList}
          isError={!!errors?.organization}
          errorMessage={errors?.organization?.message as string}
        />
      </div>
    </div>
  );
};

export default Organizations;
