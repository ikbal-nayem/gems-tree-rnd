import { LABELS } from "@constants/common.constant";
import { Icon, Modal, ModalBody } from "@gems/components";
import { IObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import EquipmentsList from "./EquipmentsList";

interface IForm {
  organogramId: any;
  currentEquipmentsData: any;
  isOpen: boolean;
  langEn: boolean;
  onClose: () => void;
}

const EquipmentsListChanges = ({
  organogramId,
  currentEquipmentsData,
  isOpen,
  onClose,
  langEn,
}: IForm) => {
  const [prevEquipmentsData, setPrevEquipmentsData] = useState<IObject>({});

  useEffect(() => {
    if (isOpen && organogramId)
      OMSService.FETCH.equipmentsDifferenceByOrganogramId(organogramId).then(
        (resp) => {
          setPrevEquipmentsData(resp?.body || []);
        }
      );
  }, [organogramId, isOpen]);

  const LABEL = langEn ? LABELS.EN : LABELS.BN;

  return (
    <Modal
      isOpen={isOpen}
      handleClose={onClose}
      holdOn
      size="xl"
      title={LABEL.CHANGE_IN_EQUIPMENTS}
    >
      <ModalBody>
        <div className="row">
          <div className="col-5">
            <EquipmentsList
              data={prevEquipmentsData?.miscellaneousPointDtoList || []}
              inventoryData={prevEquipmentsData?.inventoryTypeDtoList || []}
              langEn={langEn}
              title={LABEL.PREV_EQUIPMENTS}
            />
          </div>
          <div className="col-2 d-flex justify-content-center align-items-center">
            <Icon
              icon="arrow_right_alt"
              variants="outlined"
              color="info"
              size={60}
            />
          </div>
          <div className="col-5">
            <EquipmentsList
              data={currentEquipmentsData?.data || []}
              inventoryData={currentEquipmentsData?.inventoryData || []}
              langEn={langEn}
              title={LABEL.CURRENT_EQUIPMENTS}
            />
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default EquipmentsListChanges;
