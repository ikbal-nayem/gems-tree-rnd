import { Icon, toast } from "@gems/components";
import { ProposalService } from "@services/api/Proposal.service";
import { useEffect, useState } from "react";
import { LABEL } from "../local-constants";
import AbbreviationList from "./AbbreviationList";
import ActivitiesList from "./ActivitesList";
import AllocationOfBusinessList from "./AllocationOfBusinessList";
import AttachedOrgList from "./AttachedOrgList";
import EquipmentsList from "./EquipmentsList";
import ManPowerList from "./ManPowerList";

interface IForm {
  previousOrganogramId: any;
  proposedData: any;
  langEn?: boolean;
  content:
    | "manpower"
    | "task_builder_main_activity"
    | "task_builder_boa"
    | "equipments"
    | "abbreviation"
    | "attached_org";
}

const ContentComparision = ({
  previousOrganogramId,
  proposedData,
  langEn,
  content,
}: IForm) => {
  const [previousApprovedData, setPreviousApprovedData] = useState<any>();
  // const [sameData, setSameData] = useState<boolean>(true);
  const SERVICE = ProposalService.FETCH;

  useEffect(() => {
    if (previousOrganogramId)
      switch (content) {
        case "abbreviation":
          // Approved abbreviation Data
          SERVICE.abbreviationByOrganogramId(previousOrganogramId)
            .then((resp) => {
              setPreviousApprovedData(resp?.body);
            })
            .catch((e) => toast.error(e?.message));
          break;

        case "task_builder_main_activity":
          // Approved Main Acitivities Data
          SERVICE.mainActivityByOrganogramId(previousOrganogramId)
            .then((resp) => {
              setPreviousApprovedData(resp?.body);
            })
            .catch((e) => toast.error(e?.message));
          break;

        case "task_builder_boa":
          // Approved Business of Allocation Data
          SERVICE.businessOfAllocationByOrganogramId(previousOrganogramId)
            .then((resp) => {
              setPreviousApprovedData(resp?.body);
            })
            .catch((e) => toast.error(e?.message));
          break;

        case "attached_org":
          // Approved Attached Organization Data
          SERVICE.attachedOrganizationById(previousOrganogramId)
            .then((resp) => {
              setPreviousApprovedData(resp?.body);
            })
            .catch((e) => toast.error(e?.message));
          break;

        case "equipments":
          // Approved Inventory Data
          SERVICE.inventoryByOrganogramId(previousOrganogramId).then((resp) => {
            SERVICE.miscellaneousPointByOrganogramId(previousOrganogramId).then(
              (resp1) => {
                setPreviousApprovedData({
                  data: resp1?.body,
                  inventoryData: resp?.body,
                });
              }
            );
          });
          break;

        case "manpower":
          // Approved Manpower Data
          SERVICE.manpowerSummaryById(previousOrganogramId)
            .then((resp) => {
              setPreviousApprovedData(resp?.body);
            })
            .catch((e) => toast.error(e?.message));
          break;
      }
  }, [previousOrganogramId]);

  return (
    <div className=" card border p-3">
      <div className="d-flex flex-wrap flex-md-nowrap align-items-center px-md-10">
        {/* {!sameData && ( */}
        <>
          <div className="w-100">
            {content === "manpower" ? (
              <ManPowerList
                isLoading={false}
                data={previousApprovedData}
                langEn={langEn}
                isTabContent={true}
                title={LABEL.CURRENT_MANPOWER}
              />
            ) : content === "task_builder_main_activity" ? (
              <ActivitiesList
                data={previousApprovedData || []}
                langEn={langEn}
                isTabContent={true}
                title={LABEL.CURRENT_MAIN_ACTIVITY}
              />
            ) : content === "task_builder_boa" ? (
              <AllocationOfBusinessList
                data={previousApprovedData || []}
                langEn={langEn}
                isTabContent={true}
                title={LABEL.CURRENT_BUSINESS_OF_ALLOCATION}
              />
            ) : content === "equipments" ? (
              <EquipmentsList
                data={previousApprovedData?.data || []}
                inventoryData={previousApprovedData?.inventoryData || []}
                langEn={langEn}
                isTabContent={true}
                title={LABEL.CURRENT_INVENTORY}
              />
            ) : content === "abbreviation" ? (
              <AbbreviationList
                data={previousApprovedData || []}
                langEn={langEn}
                isTabContent={true}
                title={LABEL.CURRENT_ABBREVIATION}
              />
            ) : content === "attached_org" ? (
              <AttachedOrgList
                data={previousApprovedData || []}
                langEn={langEn}
                isTabContent={true}
                title={LABEL.CURRENT_ATTACHED_ORGANIZATION}
              />
            ) : null}
          </div>
          <div className="d-none d-md-block px-5">
            <span className="d-flex justify-content-center">
              <Icon
                icon="arrow_right_alt"
                variants="outlined"
                color="info"
                size={60}
              />
            </span>
          </div>
          <div className="d-block d-md-none px-20">
            <Icon
              icon="arrow_downward_alt"
              variants="outlined"
              color="info"
              size={60}
              className="mx-20"
            />
          </div>
        </>
        {/* )} */}
        <div className="w-100">
          {content === "manpower" ? (
            <ManPowerList
              isLoading={false}
              data={proposedData}
              langEn={langEn}
              isTabContent={true}
              title={LABEL.PROPOSED_MANPOWER}
            />
          ) : content === "task_builder_main_activity" ? (
            <ActivitiesList
              data={proposedData || []}
              langEn={langEn}
              isTabContent={true}
              title={LABEL.PROPOSED_MAIN_ACTIVITY}
            />
          ) : content === "task_builder_boa" ? (
            <AllocationOfBusinessList
              data={proposedData || []}
              langEn={langEn}
              isTabContent={true}
              title={LABEL.PROPOSED_BUSINESS_OF_ALLOCATION}
            />
          ) : content === "equipments" ? (
            <EquipmentsList
              data={proposedData?.data || []}
              inventoryData={proposedData?.inventoryData || []}
              langEn={langEn}
              isTabContent={true}
              title={LABEL.PROPOSED_INVENTORY}
            />
          ) : content === "abbreviation" ? (
            <AbbreviationList
              data={proposedData || []}
              langEn={langEn}
              isTabContent={true}
              title={LABEL.PROPOSED_ABBREVIATION}
            />
          ) : content === "attached_org" ? (
            <AttachedOrgList
              data={proposedData || []}
              langEn={langEn}
              isTabContent={true}
              title={LABEL.PROPOSED_ATTACHED_ORGANIZATION}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ContentComparision;
