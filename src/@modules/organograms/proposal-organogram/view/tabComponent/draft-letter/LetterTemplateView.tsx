import { COMMON_LABELS } from "@constants/common.constant";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  TextEditorPreview,
} from "@gems/components";
import { IObject } from "@gems/utils";

interface ICard {
  data: IObject;
  isOpen: boolean;
  onClose: () => void;
}

const LetterTemplateView = ({ data, isOpen, onClose }: ICard) => {
  return (
    <Modal
      title={"পত্রের টেমপ্লেট"}
      isOpen={isOpen}
      handleClose={onClose}
      holdOn
      size="lg"
    >
      <ModalBody>
        <TextEditorPreview html={data?.draftDoc} />
      </ModalBody>

      <ModalFooter>
        <div className="d-flex gap-3 justify-content-end">
          <Button color="secondary" onClick={onClose}>
            {COMMON_LABELS.CLOSE}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default LetterTemplateView;
