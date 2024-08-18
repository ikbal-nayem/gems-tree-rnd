import { META_TYPE } from "@constants/common.constant";
import {
  Autocomplete,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
} from "@gems/components";
import { COMMON_LABELS, IObject } from "@gems/utils";
import { CoreService } from "@services/api/Core.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IForm {
  isOpen: boolean;
  onSubmit: (d) => void;
  onClose: () => void;
  isSubmitLoading: boolean;
}

const NewProposalModal = ({
  isOpen,
  onSubmit,
  onClose,
  isSubmitLoading,
}: IForm) => {
  const [organogramChangeActionList, setOrganogramChangeActionList] = useState<
    IObject[]
  >([]);

  const formProps = useForm<any>();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = formProps;

  useEffect(() => {
    CoreService.getByMetaTypeList(META_TYPE.ORGANOGRAM_CHANGE_ACTION).then(
      (resp) => {
        setOrganogramChangeActionList(resp?.body);
      }
    );
  }, []);

  useEffect(() => {
    reset({});
  }, [isOpen]);

  return (
    <Modal
      title="নতুন প্রস্তাব"
      isOpen={isOpen}
      handleClose={onClose}
      holdOn
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <ModalBody>
          <Autocomplete
            label="নতুন প্রস্তাবে অর্গানোগ্রামের পরিবর্তনসমূহ"
            placeholder="নতুন প্রস্তাবে অর্গানোগ্রামের পরিবর্তনসমূহ বাছাই করুন"
            isRequired="নতুন প্রস্তাবে অর্গানোগ্রামের পরিবর্তনসমূহ বাছাই করুন"
            options={organogramChangeActionList || []}
            getOptionLabel={(op) => op?.titleBn}
            getOptionValue={(op) => op?.titleEn}
            isMulti
            closeMenuOnSelect={false}
            name="subjects"
            control={control}
            isError={!!errors?.subjects}
            errorMessage={errors?.subjects?.message as string}
          />
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

export default NewProposalModal;
