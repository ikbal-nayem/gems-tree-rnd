import {
  Autocomplete,
  Button,
  DateInput,
  Modal,
  ModalBody,
  ModalFooter,
  toast,
} from "@gems/components";
import { COMMON_LABELS } from "@gems/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { OMSService } from "../../../../@services/api/OMS.service";

interface IForm {
  draftCloneData: any;
  isOpen: boolean;
  onClose: () => void;
  getDataList: () => void;
}

const DraftCloneModal = ({
  draftCloneData,
  isOpen,
  onClose,
  getDataList,
}: IForm) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const formProps = useForm<any>();

  const {
    handleSubmit,
    reset,
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
    body: { searchKey: "", orgCategoryGroupId: null },
  };
  const orgPayload = useRef(payload);

  useEffect(() => {
    if (isOpen) reset({});
  }, [isOpen, reset]);

  const onSubmit = (data) => {
    const templateOrganizationsDto = {
      organizationId: data?.organization?.id,
      organizationNameBn: data?.organization?.nameBn,
      organizationNameEn: data?.organization?.nameEn,
    };
    const reqPayload = {
      cloneIsEnamCommittee: null,
      cloneOrganogramDate: data?.organogramDate || null,
      cloneOrganizationGroupId: null,
      cloneRefTemplateId: draftCloneData?.id || null,
      cloneTemplateOrganizationsDtoList: [templateOrganizationsDto],
      cloneOrganogramChangeActionDtoList: null,
    };

    setIsSubmitLoading(true);

    OMSService.templateClone(reqPayload)
      .then((res) => {
        toast.success(res?.message);
        onClose();
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => {
        setIsSubmitLoading(false);
        // setIsNotEnamCommittee(true);
        getDataList();
      });
  };

  const getAsyncOranizationList = useCallback((searchKey, callback) => {
    orgPayload.current.body = {
      ...orgPayload.current.body,
      searchKey: searchKey ? searchKey?.trim() : "",
    };
    OMSService.getEnamOrganizationList(orgPayload?.current).then((resp) =>
      callback(resp?.body)
    );
  }, []);

  const MODAL_TITLE =
    (draftCloneData?.organizationNameBn
      ? "'" + draftCloneData?.organizationNameBn + "' এর "
      : "") + "ক্লোন-অর্গানোগ্রামের তথ্য প্রদান করুন";
  return (
    <Modal
      title={MODAL_TITLE}
      // title="অর্গানোগ্রামের তথ্য প্রদান করুন"
      isOpen={isOpen}
      handleClose={onClose}
      holdOn
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <ModalBody>
          {/* <Organizations
            formProps={formProps}
            organizationGroupList={organizationGroupList}
          /> */}
          <div className="row">
            <div className="col-md-6 col-12">
              <Autocomplete
                label="প্রতিষ্ঠান"
                placeholder="প্রতিষ্ঠান বাছাই করুন"
                isRequired="প্রতিষ্ঠান বাছাই করুন"
                isAsync
                control={control}
                noMargin
                // autoFocus
                getOptionLabel={(op) => op.nameBn}
                getOptionValue={(op) => op?.id}
                name="organization"
                loadOptions={getAsyncOranizationList}
                isError={!!errors?.organization}
                errorMessage={errors?.organization?.message as string}
              />
            </div>
            <div className="col-md-6 col-12">
              <DateInput
                label="অর্গানোগ্রাম তারিখ"
                isRequired="অর্গানোগ্রাম তারিখ বাছাই করুন"
                name="organogramDate"
                control={control}
                onChange={(e) => setValue("chosenDate", e.value)}
                blockFutureDate
                isError={!!errors?.organogramDate}
                errorMessage={errors?.organogramDate?.message as string}
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="d-flex gap-3 justify-content-end">
            <Button color="secondary" onClick={onClose}>
              {COMMON_LABELS.CANCEL}
            </Button>
            <Button color="primary" type="submit" isLoading={isSubmitLoading}>
              {COMMON_LABELS.SAVE}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default DraftCloneModal;
