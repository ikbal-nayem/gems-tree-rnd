import { IObject } from "@gems/utils";
import ManPowerList from "./ManPowerList";
import { useEffect, useState } from "react";
import { LABELS } from "@constants/common.constant";
import { ProposalService } from "@services/api/Proposal.service";
import { Icon, Modal, ModalBody } from "@gems/components";

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
    if (organogramId)
    ProposalService.FETCH.manpowerDifferenceByOrganogram(organogramId).then(
        (resp) => {
          setPrevManpower(resp?.body);
        }
      );
  }, [organogramId]);

  const LABEL = langEn ? LABELS.EN : LABELS.BN;

  return (
    <Modal
      isOpen={isOpen}
      handleClose={onClose}
      holdOn
      size="xl"
      title={LABEL.CHANGE_IN_MANPOWER}
    >
      <ModalBody>
        <div className="row">
          <div className="col-5">
            <ManPowerList
              isLoading={false}
              data={prevManpower}
              langEn={langEn}
              isTabContent={true}
              title={LABEL.PREV_MANPOWER}
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
            <ManPowerList
              isLoading={false}
              data={currentManpower}
              langEn={langEn}
              isTabContent={true}
              title={LABEL.CURRENT_MANPOWER}
            />
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default MPListChanges;
