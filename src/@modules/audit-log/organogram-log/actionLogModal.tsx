import { COMMON_LABELS } from "@constants/common.constant";
import {
  Button,
  ContentPreloader,
  Modal,
  ModalBody,
  ModalFooter,
  NoData,
  Separator,
  Textarea,
  toast,
} from "@gems/components";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivitesLog } from "../components/ActivityLogs/ActivityLog";
import { IObject } from "@gems/utils";

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

  // useEffect(() => {
  //   getActivityLogData();
  //   getRemarksData();
  // }, []);

  // const getActivityLogData = () => {
  //   setIsActivityLoading(true);
  //   ACRService.FETCH.shortLogByACRId(acrId)
  //     .then((res) => setActivityLogData(res?.body || []))
  //     .catch((err) => toast.error(err?.message))
  //     .finally(() => {
  //       setIsActivityLoading(false);
  //     });
  // };

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
          <ActivitesLog applicationComments={activityLogData} />
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
