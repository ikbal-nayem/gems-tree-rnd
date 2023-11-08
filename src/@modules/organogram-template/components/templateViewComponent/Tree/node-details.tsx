import { COMMON_LABELS, LABELS } from "@constants/common.constant";
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
  const COM_LABELS = isEn ? COMMON_LABELS.EN : COMMON_LABELS;
  const LABEL = isEn ? LABELS.EN : LABELS.BN;

  return (
    <Modal
      title={LABEL.ACTIVITIES}
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
              <NoData details={COM_LABELS.NOT_ASSIGN} />
            )}
          </ol>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="d-flex gap-3 justify-content-end">
          <Button color="secondary" onClick={onClose}>
            {COM_LABELS.CLOSE}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default NodeDetails;
