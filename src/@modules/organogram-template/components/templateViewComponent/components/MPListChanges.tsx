import {
  Icon,
  Modal,
  ModalBody,
} from "@gems/components";
import { IObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import ManPowerList from "./ManPowerList";
import { LABELS } from "@constants/common.constant";

interface IForm {
  organogramId: any;
  currentManpower: any;
  isOpen: boolean;
  langEn: boolean;
  onClose: () => void;
}

const MPListChanges = ({
  organogramId,
  currentManpower,
  isOpen,
  onClose,
  langEn,
}: IForm) => {
  const [prevManpower, setPrevManpower] = useState<IObject>();

  useEffect(() => {
    OMSService.FETCH.manpowerDifferenceByOrganogram(organogramId).then((resp) => {
      setPrevManpower(resp?.body);
    });
  }, []);

  const LABEL = langEn ? LABELS.EN : LABELS.BN;

  return (
    <Modal isOpen={isOpen} handleClose={onClose} holdOn size="xl" title={LABEL.CHANGE_IN_MANPOWER}>
      <ModalBody>
        <div className="row">
          <div className="col-5">
            <ManPowerList
              isLoading={false}
              data={prevManpower}
              langEn={langEn}
              insideModal={true}
              title={LABEL.PREV_MANPOWER}
            />
          </div>
          <div className="col-2 d-flex justify-content-center align-items-center">
          <Icon
              icon="arrow_right_alt"
              variants="outlined"
              size={60}
            />
          </div>
          <div className="col-5">
          <ManPowerList
              isLoading={false}
              data={currentManpower}
              langEn={langEn}
              insideModal={true}
              title={LABEL.CURRENT_MANPOWER}
            />
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default MPListChanges;
