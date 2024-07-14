import {
  Button,
  DateInput,
  Modal,
  ModalBody,
  ModalFooter,
  toast,
} from "@gems/components";
import { COMMON_LABELS, IObject } from "@gems/utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { OMSService } from "../../../../@services/api/OMS.service";
import Organizations from "./organization";

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
  const [organizationGroupList, setOrganizationGroupList] =
    useState<IObject[]>();
  const navigate = useNavigate();
  const formProps = useForm<any>();

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = formProps;

  useEffect(() => {
    if (isOpen) {
      OMSService.FETCH.organizationGroupList()
        .then((resp) => setOrganizationGroupList(resp?.body))
        .catch((e) => console.log(e?.message));
    }
    reset({});
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
      cloneOrganizationGroupId: data?.organizationGroupDto?.id,
      cloneRefTemplateId: draftCloneData?.id,
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
          <Organizations
            formProps={formProps}
            organizationGroupList={organizationGroupList}
          />
          <div className="row">
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
