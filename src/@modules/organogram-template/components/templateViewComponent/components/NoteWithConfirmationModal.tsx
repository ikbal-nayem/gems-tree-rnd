import { COMMON_LABELS } from "@constants/common.constant";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Textarea,
} from "@gems/components";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";

interface NoteWithConfirmationModalProps {
  title?: string;
  children?: ReactNode;
  onConfirm?: any;
  onConfirmLabel?: string;
  isOpen: boolean;
  onClose?: () => void;
  isSubmitting?: boolean;
  holdOn?: boolean;
  isEng?: boolean;
  modalAction?: string;
}

export const NoteWithConfirmationModal = ({
  isOpen,
  isSubmitting,
  title,
  children,
  onClose,
  onConfirm,
  onConfirmLabel,
  holdOn,
  isEng,
  modalAction,
}: NoteWithConfirmationModalProps) => {
  const LABEL = isEng ? COMMON_LABELS.EN : COMMON_LABELS;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const onSubmit = (data) => {
    onConfirm(data?.note ? data?.note : null);
  };
  return (
    <Modal
      isOpen={isOpen}
      holdOn={holdOn}
      title={title || isEng ? "Confirmation" : "নিশ্চিতকরণ"}
      handleClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <ModalBody>
          <p>{children || "আপনি কি নিশ্চিত আপনি এটি মুছে ফেলতে চান?"}</p>
          {(modalAction === "BACK_TO_NEW" ||
            modalAction === "BACK_TO_REVIEW") && (
            <Textarea
              placeholder={"মন্তব্য লিখুন"}
              isRequired
              noMargin
              registerProperty={{
                ...register(`note`, {
                  required: "মন্তব্য লিখুন",
                }),
              }}
              isError={!!errors?.note}
              errorMessage={errors?.note?.message as string}
            />
          )}
        </ModalBody>

        <ModalFooter>
          <div className="d-flex justify-content-end">
            <Button
              className="me-3 fs-normal"
              variant="outline"
              color="secondary"
              onClick={() => onClose && onClose()}
              isDisabled={isSubmitting}
            >
              {LABEL.CLOSE}
            </Button>
            <Button
              className="fs-normal"
              color="info"
              type="submit"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            >
              {onConfirmLabel || LABEL.DELETE}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};
