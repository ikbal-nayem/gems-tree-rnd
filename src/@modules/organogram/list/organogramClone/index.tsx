import { META_TYPE } from "@constants/common.constant";
import {
  Autocomplete,
  Button,
  DateInput,
  Modal,
  ModalBody,
  ModalFooter,
  toast,
} from "@gems/components";
import { COMMON_LABELS, IObject, notNullOrUndefined } from "@gems/utils";
import { CoreService } from "@services/api/Core.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { OMSService } from "../../../../@services/api/OMS.service";
import WorkSpaceComponent from "./WorkSpaceComponent";
import { useNavigate } from "react-router-dom";
import { ROUTE_L2 } from "@constants/internal-route.constant";

interface IForm {
  template: any;
  isOpen: boolean;
  onClose: () => void;
  getDataList: () => void;
}

const OrganogramClone = ({ template, isOpen, onClose, getDataList }: IForm) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [organogramChangeActionList, setOrganogramChangeActionList] = useState<
    IObject[]
  >([]);

  const formProps = useForm<any>();

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = formProps;
  const navigate = useNavigate();
  useEffect(() => {
    CoreService.getByMetaTypeList(META_TYPE.ORGANOGRAM_CHANGE_ACTION).then(
      (resp) => {
        setOrganogramChangeActionList(resp?.body);
      }
    );
  }, []);

  useEffect(() => {
    reset({});
    getDataList();
  }, [isOpen]);

  const onSubmit = (data) => {
    if (data) {
      const reqPayload = {
        cloneOrganogramDate: data.organogramDate,
        refTemplateId: template?.id,

        organogramChangeActionDtoList:
          data?.organogramChangeActionDtoList?.length > 0
            ? data?.organogramChangeActionDtoList?.map((d) => ({
                titleEn: d?.titleEn,
                titleBn: d?.titleBn,
              }))
            : null,

        organization: data?.organization || null,
        organizationId: data?.organizationId || null,
      };

      setIsSubmitLoading(true);

      OMSService.templateClone(reqPayload)
        .then((res) => toast.success(res?.message))
        .catch((error) => toast.error(error?.message))
        .finally(() => {
          setIsSubmitLoading(false);
          // onClose();
          navigate(ROUTE_L2.ORG_TEMPLATE_LIST);
        });
    }
  };

  const MODAL_TITLE =
    (template?.titleBn ? "'" + template?.titleBn + "' এর " : "") +
    "ডুপ্লিকেটের তথ্য প্রদান করুন :-";
  return (
    <Modal
      title={MODAL_TITLE}
      isOpen={isOpen}
      handleClose={onClose}
      holdOn
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <ModalBody>
          <div className="row">
            <div className="col-md-6 col-12">
              <WorkSpaceComponent
                {...formProps}
                isRequired="প্রতিষ্ঠান বাছাই করুন"
              />
            </div>
            <div className="col-md-6 col-12">
              <DateInput
                label="অর্গানোগ্রাম তারিখ"
                isRequired={true}
                name="organogramDate"
                control={control}
                onChange={(e) => setValue("chosenDate", e.value)}
                blockFutureDate
                isError={!!errors?.organogramDate}
              />
            </div>
            <div className="col-12">
              <Autocomplete
                label="অর্গানোগ্রামের পরিবর্তনসমূহ"
                placeholder="অর্গানোগ্রামের পরিবর্তনসমূহ বাছাই করুন"
                isRequired={true}
                name="organogramChangeActionDtoList"
                isMulti
                options={organogramChangeActionList || []}
                getOptionLabel={(op) => op?.titleBn}
                getOptionValue={(op) => op?.titleEn}
                closeMenuOnSelect={false}
                control={control}
                isError={!!errors?.organogramChangeActionDtoList}
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

export default OrganogramClone;
