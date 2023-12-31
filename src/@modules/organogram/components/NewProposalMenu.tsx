import clsx from "clsx";
import NewProposalModal from "./NewProposalModal";
import { useState } from "react";
import { OMSService } from "@services/api/OMS.service";
import { toast } from "@gems/components";

export const NewProposalMenu = (organogramId, organizationId) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onProposalClose = () => setIsOpen(false);
  // alert(organizationId);
  const onSubmit = (data) => {
    const reqPayload = {
      organizationId: organizationId,
      subjects: data?.subjects?.length > 0 ? data?.subjects : null,
      proposedDate: new Date(),
      status: "NEW",
    };

    setIsSubmitLoading(true);

    OMSService.SAVE.proposal(reqPayload)
      .then((res) => toast.success(res?.message))
      .catch((error) => toast.error(error?.message))
      .finally(() => {
        setIsSubmitLoading(false);
        onProposalClose();
      });
  };
  return (
    <div className={clsx("app-navbar-item")}>
      <div
        className="cursor-pointer"
        data-kt-menu-trigger="{default: 'click'}"
        // data-kt-menu-attach="parent"
        // data-kt-menu-placement="bottom-start"
        onClick={() => setIsOpen(true)}
      >
        <span
          className={`nav-link text-active-primary cursor-pointer me-8 mt-2 fw-bold text-gray-700 fs-5`}
        >
          নতুন প্রস্তাব
        </span>
        {/* <div
          className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-700 menu-state-bg menu-state-primary fw-bold py-2 fs-6 w-200px"
          data-kt-menu="true"
        >
          <div className="menu-item px-2">
            <div className="menu-link">পদ সৃজন</div>
          </div>

          <div className="menu-item px-2">
            <div className="menu-link">পদের মেয়াদ সংরক্ষণ</div>
          </div>
          <div className="menu-item px-2">
            <div className="menu-link">পদ স্থায়ীকরণ</div>
          </div>
          <div className="menu-item px-2">
            <div className="menu-link">পদ বিলুপ্ত করুন</div>
          </div>
          <div className="menu-item px-2">
            <div className="menu-link">
              যানবাহন, অফিস সরঞ্জাম টিওএন্ডই-তে অন্তর্ভুক্তিকরণ
            </div>
          </div>
          <div className="menu-item px-2">
            <div className="menu-link">
              পদবি/পদনাম পরিবর্তন এবং পদমর্যাদা/বেতন স্কেল উন্নীতকরণ
            </div>
          </div>
          <div className="menu-item px-2">
            <div className="menu-link">১০% সংরক্ষিত শূন্যপদ পূরণ</div>
          </div>
        </div> */}
        <NewProposalModal
          isOpen={isOpen}
          onSubmit={onSubmit}
          onProposalClose={onProposalClose}
          isSubmitLoading={isSubmitLoading}
        />
      </div>
    </div>
  );
};
