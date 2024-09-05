import { ROUTE_L2 } from "@constants/internal-route.constant";
import { toast } from "@gems/components";
import { isListNull } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewProposalModal from "./NewProposalModal";

interface IMenu {
  organogramId: string;
  organizationId: string;
}
export const NewProposalMenu = ({ organogramId, organizationId }: IMenu) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onClose = () => setIsOpen(false);
  const navigate = useNavigate();
  const onSubmit = (data) => {
    const reqPayload = {
      organizationId: organizationId,
      previousOrganogramId: organogramId,
      orgmChangeActionList: !isListNull(data?.orgmChangeActionList)
        ? data?.orgmChangeActionList?.map((d) => ({
            titleEn: d?.titleEn || "",
            titleBn: d?.titleBn || "",
            organogramChangeTypeId: d?.id || "",
          }))
        : null,
      proposedDate: new Date(),
      status: "NEW",
    };

    setIsSubmitLoading(true);

    OMSService.SAVE.organogramProposal(reqPayload)
      .then((res) => {
        toast.success(res?.message);
        navigate(ROUTE_L2.OMS_PROPOSAL_LIST);
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => {
        setIsSubmitLoading(false);
        onClose();
      });
  };

  return (
    <div className={clsx("app-navbar-item")}>
      <div
        className="cursor-pointer"
        data-kt-menu-trigger="{default: 'click'}"
        onClick={() => setIsOpen(true)}
      >
        <span
          className={`nav-link text-active-primary cursor-pointer me-8 mt-2 fw-bold text-gray-700 fs-5`}
        >
          নতুন প্রস্তাব
        </span>
      </div>
      <NewProposalModal
        isOpen={isOpen}
        onSubmit={onSubmit}
        onClose={onClose}
        isSubmitLoading={isSubmitLoading}
      />
    </div>
  );
};
