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
      title="অর্গানোগ্রাম পরিবর্তনের কারণসমূহ"
      isOpen={isOpen}
      handleClose={onClose}
      holdOn
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <ModalBody>
          <Autocomplete
            label="অর্গানোগ্রাম পরিবর্তনের কারণসমূহ"
            placeholder="অর্গানোগ্রাম পরিবর্তনের কারণসমূহ বাছাই করুন"
            isRequired="অর্গানোগ্রাম পরিবর্তনের কারণসমূহ বাছাই করুন"
            options={organogramChangeActionList || []}
            getOptionLabel={(op) => op?.titleBn}
            getOptionValue={(op) => op?.titleEn}
            isMulti
            closeMenuOnSelect={false}
            name="organogramChangeActionDtoList"
            control={control}
            isError={!!errors?.organogramChangeActionDtoList}
            errorMessage={
              errors?.organogramChangeActionDtoList?.message as string
            }
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
