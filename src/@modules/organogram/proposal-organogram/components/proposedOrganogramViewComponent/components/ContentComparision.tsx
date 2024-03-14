import { Icon } from "@gems/components";
import { ProposalService } from "@services/api/Proposal.service";
import { useEffect, useState } from "react";
import { LABEL } from "../local-constants";
import EquipmentsList from "./EquipmentsList";
import ManPowerList from "./ManPowerList";

interface IForm {
  previousOrganogramId: any;
  proposedData: any;
  langEn?: boolean;
  content: "manpower" | "equipments" | "abbr" | "attached_org";
}

const ContentComparision = ({
  previousOrganogramId,
  proposedData,
  langEn,
  content,
}: IForm) => {
  const [previousApprovedData, setPreviousApprovedData] = useState<any>();
  const [sameData, setSameData] = useState<boolean>(true);
  const SERVICE = ProposalService.FETCH;

  useEffect(() => {
    if (previousOrganogramId)
      switch (content) {
        case "abbr":
          break;
        case "attached_org":
          break;
        case "equipments":
          // Approved Inventory Data
          SERVICE.inventoryByOrganogramId(previousOrganogramId).then((resp) => {
            setPreviousApprovedData(resp?.body);
            setSameData(
              JSON.stringify(resp?.body) === JSON.stringify(proposedData)
            );
          });
          break;
        case "manpower":
          // Approved Manpower Data
          SERVICE.manpowerSummaryById(previousOrganogramId).then((resp) => {
            setPreviousApprovedData(resp?.body);
            setSameData(
              JSON.stringify(resp?.body) === JSON.stringify(proposedData)
            );
          });
          break;
      }
  }, [previousOrganogramId]);

  return (
    <div className=" card border p-3">
      <div className="row d-flex align-items-center">
        {!sameData && (
          <>
            <div className="col-12 col-md-5">
              {content === "manpower" ? (
                <ManPowerList
                  isLoading={false}
                  data={previousApprovedData}
                  langEn={langEn}
                  isTabContent={true}
                  title={LABEL.CURRENT_MANPOWER}
                />
              ) : content === "equipments" ? (
                <EquipmentsList
                  data={[]}
                  inventoryData={previousApprovedData || []}
                  langEn={langEn}
                  isTabContent={true}
                  title={LABEL.CURRENT_INVENTORY}
                />
              ) : null}
            </div>
            <div className="col-12 col-md-2 d-none d-md-block">
              <span className="d-flex justify-content-center">
                <Icon
                  icon="arrow_right_alt"
                  variants="outlined"
                  color="info"
                  size={60}
                />
              </span>
            </div>
            <div className="col-12 d-block d-md-none px-20">
              <Icon
                icon="arrow_downward_alt"
                variants="outlined"
                color="info"
                size={60}
                className="mx-20"
              />
            </div>
          </>
        )}
        <div className="col-12 col-md-5">
          {content === "manpower" ? (
            <ManPowerList
              isLoading={false}
              data={proposedData}
              langEn={langEn}
              isTabContent={true}
              title={LABEL.PROPOSED_MANPOWER}
            />
          ) : content === "equipments" ? (
            <EquipmentsList
              data={proposedData?.data || []}
              inventoryData={proposedData?.inventoryData || []}
              langEn={langEn}
              isTabContent={true}
              title={LABEL.PROPOSED_INVENTORY}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ContentComparision;
