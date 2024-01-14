import { ROUTE_L2 } from "@constants/internal-route.constant";
import { ContentPreloader, Modal, ModalBody, NoData } from "@gems/components";
import { IObject } from "@gems/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { objectToQueryString } from "utility/makeObject";

interface IForm {
  templateId: string;
  orgList: IObject[];
  isOpen: boolean;
  onClose: () => void;
}

const OrganizationReport = ({
  templateId,
  orgList,
  isOpen,
  onClose,
}: IForm) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const onOrgSelect = (org) => {
    navigate(ROUTE_L2.ORG_TEMPLATE_VIEW + "?id=" + templateId, {
      state: org,
    });
  };
  return (
    <Modal
      title={"কোন প্রতিষ্ঠানের অর্গানোগ্রাম দেখতে চান ?"}
      isOpen={isOpen}
      handleClose={onClose}
      scrollBody
    >
      <ModalBody className="min-h-200px p-0">
        <ul className="list-group list-group-flush">
          {orgList?.map((org, i) => {
            return (
              <li
                className="list-group-item list-group-item-action cursor-pointer d-flex align-items-center gap-2"
                onClick={() => onOrgSelect(org)}
                key={i}
              >
                {org?.organizationNameBn}
              </li>
            );
          })}
        </ul>
        <ContentPreloader show={isLoading} />
        {!orgList?.length && !isLoading && (
          <NoData details="কোনো প্রতিষ্ঠান পাওয়া যায়নি!" />
        )}
      </ModalBody>
    </Modal>
  );
};

export default OrganizationReport;
