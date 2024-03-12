import { Icon, Modal } from "@gems/components";
import { COMMON_LABELS, numEnToBn } from "@gems/utils";
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
    <Modal
      title={`${data?.nameBn} গ্রুপের প্রতিষ্ঠান তালিকা (${numEnToBn(
        data?.count
      )} টি)`}
      isOpen={isOpen}
      handleClose={onClose}
      size="lg"
      scrollBody
    >
      <ModalBody>
        {data && data?.orgList && data?.orgList?.length > 0 && (
          <div className="row">
            {data?.orgList?.map((item, i) => (
              <div className="col-xl-4 col-md-6 px-1" key={i}>
                <Icon icon={"check"} className={`me-1`} size={16} />
                <span className="pb-5">
                  {item?.nameBn || COMMON_LABELS.NOT_ASSIGN}
                </span>
              </div>
            ))}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default GroupWiseOrgListModal;
