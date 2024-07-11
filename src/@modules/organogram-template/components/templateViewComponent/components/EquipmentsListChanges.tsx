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
  const [prevInventoryData, setPrevInventoryData] = useState<IObject[]>();
  const [prevMiscellaneousData, setPrevMiscellaneousData] =
    useState<IObject[]>();

  useEffect(() => {
    if (isOpen && organogramId) {
      getPreviousInventoryList();
      // getPreviousMiscellaneousList();
    }
  }, [organogramId, isOpen]);

  const getPreviousInventoryList = () => {
    OMSService.FETCH.inventoryDifferenceByOrganogramId(organogramId)
      .then((resp) => {
        setPrevInventoryData(resp?.body || []);
      })
      .catch((e) => console.log(e?.message));
  };

  // const getPreviousMiscellaneousList = () => {
  //   OMSService.FETCH.inventoryDifferenceByOrganogramId(organogramId)
  //     .then((resp) => {
  //       setPrevMiscellaneousData(resp?.body || []);
  //     })
  //     .catch((e) => console.log(e?.message));
  // };

  const LABEL = langEn ? LABELS.EN : LABELS.BN;

  console.log("latest", currentEquipmentsData?.data);

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
              data={prevMiscellaneousData || []}
              inventoryData={prevInventoryData || []}
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
