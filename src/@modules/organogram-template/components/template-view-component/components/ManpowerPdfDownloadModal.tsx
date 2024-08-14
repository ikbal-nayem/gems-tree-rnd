import { COMMON_LABELS, LABELS } from "@constants/common.constant";
import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalFooter,
} from "@gems/components";
import { useState } from "react";

interface ICard {
  isEn: any;
  isOpen: boolean;
  onClose: () => void;
  onModalSubmit: (data) => void;
}

const ManpowerPDFDownloadModal = ({
  isEn,
  isOpen,
  onClose,
  onModalSubmit,
}: ICard) => {
  const [isWithEquipment, setIsWithEquipment] = useState<boolean>(false);
  const COM_LABELS = isEn ? COMMON_LABELS.EN : COMMON_LABELS;
  const LABEL = isEn ? LABELS.EN : LABELS.BN;

  const onFormSubmit = () => {
    onModalSubmit(isWithEquipment);
    onClose();
    setIsWithEquipment(false);
  };

  return (
    <Modal
      title={LABEL.SUMMARY_OF_MANPOWER + " " + LABEL.DOWNLOAD_OPTION}
      isOpen={isOpen}
      handleClose={onClose}
      holdOn
      size="lg"
    >
      <ModalBody>
        <Checkbox
          noMargin
          label={
            isEn
              ? "With Transport and Office Equipment PDF"
              : "পরিবহণ ও অফিস সরঞ্জাম সহ পিডিএফ"
          }
          // isDisabled={isHeadIndex ? isHeadIndex !== index : false}
          onChange={(e) => setIsWithEquipment(e?.target?.checked)}
        />
      </ModalBody>

      <ModalFooter>
        <div className="d-flex gap-3 justify-content-end">
          <Button color="secondary" onClick={onClose}>
            {COM_LABELS.CLOSE}
          </Button>
          <Button color="secondary" onClick={onFormSubmit}>
            {COM_LABELS.DOWNLOAD}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ManpowerPDFDownloadModal;
