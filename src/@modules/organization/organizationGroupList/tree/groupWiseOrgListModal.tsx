// import { ROLES_PERMISSION_TYPES } from "@constants/common.constant";
import { Icon, Modal } from "@gems/components";
import { ModalBody } from "react-bootstrap";

interface IGroupWiseOrgListModal {
  data?: any;
  isOpen: boolean;
  onClose: () => void;
}

const GroupWiseOrgListModal = ({
  data,
  isOpen,
  onClose,
}: IGroupWiseOrgListModal) => {
  return (
    <Modal title={``} isOpen={isOpen} handleClose={onClose}>
      <ModalBody></ModalBody>
    </Modal>
  );
};

export default GroupWiseOrgListModal;
