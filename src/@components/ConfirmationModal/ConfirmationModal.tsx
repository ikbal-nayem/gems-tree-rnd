import { COMMON_LABELS } from "@constants/common.constant";
import { Button, Modal, ModalBody, ModalFooter } from "@gems/components";
import { ReactNode } from "react";

interface ConfirmationModalProps {
  title?: string;
  children?: ReactNode;
  onConfirm?: any;
  onConfirmLabel?: string;
  isOpen: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  onClose?: () => void;
  isSubmitting?: boolean;
  holdOn?: boolean;
  isEng?: boolean;
}

export const ConfirmationModal = ({
  isOpen,
  isSubmitting,
  setIsOpen,
  title,
  children,
  onClose,
  onConfirm,
  onConfirmLabel,
  holdOn,
  isEng,
}: ConfirmationModalProps) => {
  const LABEL = isEng ? COMMON_LABELS.EN : COMMON_LABELS;
  return (
    <Modal
      isOpen={isOpen}
      holdOn={holdOn}
      title={title || isEng ? "Confirmation" : "নিশ্চিতকরণ"}
      handleClose={onClose}
    >
      <ModalBody>
        <p>{children || "আপনি কি নিশ্চিত আপনি এটি মুছে ফেলতে চান?"}</p>
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
            onClick={() => onConfirm()}
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {onConfirmLabel || LABEL.DELETE}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};
