import { LABELS } from "@constants/common.constant";
import { ContentPreloader, Icon, Modal, ModalBody } from "@gems/components";
import { IObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import ManPowerList from "./ManPowerList";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && organogramId) {
      setIsLoading(true);
      OMSService.FETCH.manpowerDifferenceByOrganogram(organogramId)
        .then((resp) => {
          setPrevManpower(resp?.body);
        })
        .catch((e) => console.log(e?.message))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, organogramId]);

  const LABEL = langEn ? LABELS.EN : LABELS.BN;

  return (
    <Modal
      isOpen={isOpen}
      handleClose={onClose}
      holdOn
      size="xl"
      title={LABEL.CHANGE_IN_MANPOWER}
    >
      <ModalBody className="min-h-300px">
        {isLoading && <ContentPreloader />}
        {!isLoading && (
          <div className="row">
            <div className="col-5">
              <ManPowerList
                isLoading={false}
                data={prevManpower}
                langEn={prevManpower?.isEnamCommittee ? true : false}
                insideModal={true}
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
                insideModal={true}
                title={LABEL.CURRENT_MANPOWER}
              />
            </div>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default MPListChanges;
