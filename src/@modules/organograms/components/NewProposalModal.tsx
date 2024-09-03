import {
  Autocomplete,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
} from "@gems/components";
import { COMMON_LABELS, IObject } from "@gems/utils";
import { ProposalService } from "@services/api/Proposal.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const payload = {
  meta: {
    page: 0,
    limit: 10,
    sort: [
      {
        field: "createdOn",
        order: "desc",
      },
    ],
  },
  body: {},
};
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
    if (isOpen)
      ProposalService.FETCH.organogramChangeTypeList(payload)
        .then((res) => {
          setOrganogramChangeActionList(res?.body || []);
        })
        .catch((err) => console.log(err?.message));
  }, [isOpen]);

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
            getOptionLabel={(op) => op?.titleBN}
            getOptionValue={(op) => op?.titleEN}
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
