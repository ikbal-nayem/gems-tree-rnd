import { COMMON_LABELS } from "@constants/common.constant";
import {
  Button,
  ContentPreloader,
  Modal,
  ModalBody,
  ModalFooter,
  NoData,
  toast,
} from "@gems/components";
import { IObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { ActivitesLog } from "../components/ActivityLogs/ActivityLog";

interface ActionLogModalProps {
  title?: string;
  isOpen: boolean;
  onClose?: () => void;
  organogramId: string;
}

export const ActionLogModal = ({
  isOpen,
  title,
  onClose,
  organogramId,
}: ActionLogModalProps) => {
  const [activityLogData, setActivityLogData] = useState<IObject[]>([]);
  const [isActivityLoading, setIsActivityLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) getActivityLogData();
  }, [isOpen, organogramId]);

  const getActivityLogData = () => {
    setIsActivityLoading(true);
    OMSService.FETCH.getOrganogramLogById(organogramId)
      .then((res) => setActivityLogData(res?.body || []))
      .catch((err) => toast.error(err?.message))
      .finally(() => {
        setIsActivityLoading(false);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      // holdOn={holdOn}
      title={title || ""}
      handleClose={onClose}
      size="lg"
      scrollBody
    >
      <ModalBody>
        {isActivityLoading && <ContentPreloader />}
        {!isActivityLoading && activityLogData?.length > 0 ? (
          <ActivitesLog data={activityLogData} />
        ) : null}
        {!isActivityLoading && !(activityLogData?.length > 0) && (
          <NoData details="কোনো কার্যক্রম তথ্য পাওয়া যাচ্ছে না!" />
        )}
      </ModalBody>

      <ModalFooter>
        <div className="d-flex justify-content-end">
          <Button
            className="me-3 fs-normal"
            variant="outline"
            color="secondary"
            onClick={() => onClose && onClose()}
          >
            {COMMON_LABELS.CLOSE}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};
