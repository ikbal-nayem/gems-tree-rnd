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
import { CommentLog } from "../components/CommentLog/CommentLog";

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
  const [commentLogData, setCommentLogData] = useState<IObject[]>([]);
  const [isActivityLoading, setIsActivityLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      getActivityLogData();
      getCommentLogData();
    }
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

  const getCommentLogData = () => {
    setIsActivityLoading(true);
    OMSService.FETCH.getOrganogramCommentLogById(organogramId)
      .then((res) => setCommentLogData(res?.body || []))
      .catch((err) => toast.error(err?.message))
      .finally(() => {
        setIsActivityLoading(false);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      title={title || ""}
      handleClose={onClose}
      size="xl"
      scrollBody
    >
      <ModalBody>
        {isActivityLoading && <ContentPreloader />}
        {!isActivityLoading && activityLogData?.length > 0 ? (
          <div className="d-flex flex-column flex-lg-row gap-5">
            <div className="flex-fill">
              <ActivitesLog data={activityLogData} />
            </div>
            <div className="flex-fill">
              <CommentLog CommentData={commentLogData} />
            </div>
          </div>
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
