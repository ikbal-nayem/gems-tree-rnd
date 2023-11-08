import { COMMON_LABELS } from "@constants/common.constant";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  NoData,
} from "@gems/components";
import { IObject } from "@gems/utils";

interface ICard {
  isEn: any;
  data: IObject;
  isOpen: boolean;
  onClose: () => void;
}

const NodeDetails = ({ isEn, data, isOpen, onClose }: ICard) => {
  const list = data?.postFunctionalityList;
  const LABELS = isEn ? COMMON_LABELS.EN : COMMON_LABELS;

  return (
    <Modal
      title={isEn ? "Job Responsibility" : "কার্যাবলি"}
      isOpen={isOpen}
      handleClose={onClose}
      holdOn
      size="lg"
    >
      <ModalBody>
        <div className="p-2">
          <ol className={isEn ? "" : "bn_ol"}>
            {list?.length > 0 ? (
              list?.map((item, i) => {
                return (
                  <li key={i} className="fs-5">
                    &nbsp;&nbsp;
                    {isEn ? item?.functionalityEn : item?.functionalityBn}
                  </li>
                );
              })
            ) : (
              <NoData details={LABELS.NOT_ASSIGN} />
            )}
          </ol>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="d-flex gap-3 justify-content-end">
          <Button color="secondary" onClick={onClose}>
            {LABELS.CLOSE}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default NodeDetails;
