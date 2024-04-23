import { LABELS } from "@constants/common.constant";
import { Autocomplete, Separator } from "@gems/components";
import { IObject, notNullOrUndefined } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [organizationGroupList, setOrganizationGroupList] = useState<IObject[]>(
    []
  );
  const payload = {
    meta: {
      page: 0,
      limit: 1000,
      sort: [{ order: "asc", field: "serialNo" }],
    },
    body: { searchKey: "", organizationCategoryId: null },
  };
  const orgPayload = useRef(payload);

  const getOrgGroupList = () => {
    OMSService.FETCH.organizationGroupList().then((resp) =>
      setOrganizationGroupList(resp?.body)
    );
  };
  useEffect(() => {
    getOrgGroupList();
  }, []);

  useEffect(() => {
    onOrgGroupChange(watch("organizationGroupDto"));
  }, [watch("organizationGroupDto")]);

  const onOrgGroupChange = (OrgGroup) => {
    if (!isTemplate) {
      orgPayload.current.body = {
        ...orgPayload.current.body,
        organizationCategoryId: OrgGroup?.id || null,
      };
      if (notNullOrUndefined(OrgGroup)) {
        setOrgGroupTriggered(true);

        // OMSService.FETCH.organizationsByGroupId(OrgGroup?.id).then((resp) =>
        //   setOrganizationList(resp?.body)
        // );
      }
    }
  };

  if (watch("organizationGroupDto")) {
    deFocusById("organizationBlock");
  }

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
            {/* <Autocomplete
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
            /> */}
            <Autocomplete
              label="প্রতিষ্ঠান"
              placeholder="প্রতিষ্ঠান বাছাই করুন"
              isRequired="প্রতিষ্ঠান বাছাই করুন"
              isAsync
              // isMulti
              control={control}
              noMargin
              getOptionLabel={(op) => op.nameBn}
              getOptionValue={(op) => op?.id}
              name="templateOrganizationsDto"
              onChange={() => setOrgTriggered(true)}
              loadOptions={getAsyncOranizationList}
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
