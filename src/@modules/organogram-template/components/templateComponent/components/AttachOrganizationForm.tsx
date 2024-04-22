import { LABELS } from "@constants/common.constant";
import { Autocomplete, Separator } from "@gems/components";
import { OMSService } from "@services/api/OMS.service";
import { useCallback, useRef } from "react";

interface IAttachOrganizationForm {
  formProps: any;
  isNotEnamCommittee?: boolean;
}
const AttachOrganizationForm = ({
  formProps,
  isNotEnamCommittee,
}: IAttachOrganizationForm) => {
  const {
    register,
    control,
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

  const getAsyncOranizationList = useCallback((searchKey, callback) => {
    orgPayload.current.body = {
      ...orgPayload.current.body,
      searchKey: searchKey,
    };
    OMSService.getOrganizationList(orgPayload?.current).then((resp) =>
      callback(resp?.body)
    );
  }, []);
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.ATTACHED_OFFICE}</h4>
      </div>
      <Separator className="mt-1 mb-2" />
      <Autocomplete
        // label="প্রতিষ্ঠান"
        placeholder="সংযুক্ত অফিসসমূহ বাছাই করুন"
        // isRequired="সংযুক্ত অফিসসমূহ বাছাই করুন"
        isAsync
        isMulti
        control={control}
        noMargin
        getOptionLabel={(op) => (isNotEnamCommittee ? op.nameBn : op?.nameEn)}
        getOptionValue={(op) => op?.id}
        name="attachedOrganizationDtoList"
        // onChange={() => setOrgTriggered(true)}
        loadOptions={getAsyncOranizationList}
        isError={!!errors?.templateOrganizationsDto}
        errorMessage={errors?.templateOrganizationsDto?.message as string}
      />
    </div>
  );
};

export default AttachOrganizationForm;
