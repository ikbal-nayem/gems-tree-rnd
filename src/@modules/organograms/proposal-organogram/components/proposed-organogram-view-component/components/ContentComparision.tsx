import { toast } from "@gems/components";
import Manpower from "@modules/organograms/proposal-organogram/view/tabComponent/manpower";
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
  data?: any;
  langEn?: boolean;
  content:
    | "manpower"
    | "task_builder_main_activity"
    | "task_builder_boa"
    | "summary_of_manpower"
    | "equipments"
    | "abbreviation"
    | "attached_org";
  organogramId?: string;
}

const ContentComparision = ({ data, langEn, content, organogramId }: IForm) => {
  const [proposedAPIData, setProposedAPIData] = useState<any>();
  const [presentAPIData, setPresentAPIData] = useState<any>();

  useEffect(() => {
    if (organogramId && content === "manpower") {
      ProposalService.FETCH.nodeWiseProposedManpowerById(organogramId)
        .then((resp) => {
          setProposedAPIData(resp?.body);
        })
        .catch((e) => toast.error(e?.message));

      ProposalService.FETCH.nodeWisePresentManpowerById(organogramId)
        .then((resp) => {
          setPresentAPIData(resp?.body);
        })
        .catch((e) => toast.error(e?.message));
    }

    if (organogramId && content === "summary_of_manpower") {
      ProposalService.FETCH.manpowerProposedSummaryById(organogramId)
        .then((resp) => {
          setProposedAPIData(resp?.body || []);
        })
        .catch((e) => toast.error(e?.message));

      ProposalService.FETCH.manpowerPresentSummaryById(organogramId)
        .then((resp) => {
          setPresentAPIData(resp?.body || []);
        })
        .catch((e) => toast.error(e?.message));
    }

    if (organogramId && content === "equipments") {
      ProposalService.FETCH.equipmentsProposedById(organogramId)
        .then((resp) => {
          setProposedAPIData(resp?.body || []);
        })
        .catch((e) => toast.error(e?.message));

      ProposalService.FETCH.equipmentsPresentById(organogramId)
        .then((resp) => {
          setPresentAPIData(resp?.body || []);
        })
        .catch((e) => toast.error(e?.message));
    }

    if (organogramId && content === "attached_org") {
      ProposalService.FETCH.attachOrganizationsProposedById(organogramId)
        .then((resp) => {
          setProposedAPIData(resp?.body || {});
        })
        .catch((e) => toast.error(e?.message));

      ProposalService.FETCH.attachOrganizationsPresentById(organogramId)
        .then((resp) => {
          setPresentAPIData(resp?.body || {});
        })
        .catch((e) => toast.error(e?.message));
    }
  }, [organogramId]);

  let proposeData =
    data?.length > 0
      ? data?.filter((pd) => pd?.isAddition || pd?.isDeleted || pd?.isModified)
      : data;

  let currentData =
    data?.length > 0
      ? data?.filter(
          (pd) => !(pd?.isAddition || pd?.isDeleted || pd?.isModified)
        )
      : data;

  return (
    <div className=" card border p-3">
      <div className="d-flex flex-wrap flex-md-nowrap">
        <>
          <div className="w-100 px-md-1 pb-2 pb-md-0">
            {content === "manpower" ? (
              <Manpower
                dataList={presentAPIData || []}
                isEnamCommittee={false}
                isTabContent={true}
                title={LABEL.CURRENT_MANPOWER}
              />
            ) : content === "task_builder_main_activity" ? (
              <ActivitiesList
                data={currentData || []}
                langEn={langEn}
                isTabContent={true}
                title={LABEL.CURRENT_MAIN_ACTIVITY}
              />
            ) : content === "task_builder_boa" ? (
              <AllocationOfBusinessList
                data={currentData || []}
                langEn={langEn}
                isTabContent={true}
                title={LABEL.CURRENT_BUSINESS_OF_ALLOCATION}
              />
            ) : content === "summary_of_manpower" ? (
              <ManPowerList
                isLoading={false}
                data={presentAPIData || {}}
                isSummaryOfManPowerObject={
                  presentAPIData?.isSummaryOfManPowerObject
                }
                summaryOfManPowerObject={
                  presentAPIData?.summaryOfManPowerObject
                }
                langEn={langEn}
                isTabContent={true}
                title={LABEL.CURRENT_SUMMARY_MANPOWER}
              />
            ) : content === "equipments" ? (
              <EquipmentsList
                data={
                  presentAPIData?.proposalMiscellaneousPostDto
                    ?.miscellaneousPointDtoList || []
                }
                inventoryData={
                  presentAPIData?.proposalInventoryTypeDto
                    ?.inventoryTypeDtoList || []
                }
                othersData={{
                  isInventoryOthers:
                    presentAPIData?.proposalInventoryTypeDto?.isInventoryOthers,
                  inventoryOthersObject:
                    presentAPIData?.proposalInventoryTypeDto
                      ?.inventoryOthersObject,
                }}
                langEn={langEn}
                isTabContent={true}
                title={LABEL.CURRENT_INVENTORY}
              />
            ) : content === "abbreviation" ? (
              <AbbreviationList
                data={currentData || []}
                langEn={langEn}
                isTabContent={true}
                title={LABEL.CURRENT_ABBREVIATION}
              />
            ) : content === "attached_org" ? (
              <AttachedOrgList
                data={presentAPIData?.attachedOrganization || []}
                langEn={langEn}
                isTabContent={true}
                title={LABEL.CURRENT_ATTACHED_ORGANIZATION}
              />
            ) : null}
          </div>
          {/* <div className="d-none d-md-block px-5">
            <span className="d-flex justify-content-center">
              <Icon
                icon="arrow_right_alt"
                variants="outlined"
                color="primary"
                size={60}
              />
            </span>
          </div>
          <div className="d-block d-md-none w-100 text-center">
            <Icon
              icon="arrow_downward"
              variants="outlined"
              color="primary"
              size={40}
            />
          </div> */}
        </>
        <div className="w-100 px-md-1">
          {content === "manpower" ? (
            <Manpower
              dataList={proposedAPIData || []}
              isEnamCommittee={false}
              isTabContent={true}
              title={LABEL.PROPOSED_MANPOWER}
            />
          ) : content === "task_builder_main_activity" ? (
            <ActivitiesList
              data={proposeData || []}
              langEn={langEn}
              isTabContent={true}
              title={LABEL.PROPOSED_MAIN_ACTIVITY}
            />
          ) : content === "task_builder_boa" ? (
            <AllocationOfBusinessList
              data={proposeData || []}
              langEn={langEn}
              isTabContent={true}
              title={LABEL.PROPOSED_BUSINESS_OF_ALLOCATION}
            />
          ) : content === "summary_of_manpower" ? (
            <ManPowerList
              isLoading={false}
              data={proposedAPIData || []}
              isSummaryOfManPowerObject={
                proposedAPIData?.isSummaryOfManPowerObject
              }
              summaryOfManPowerObject={proposedAPIData?.summaryOfManPowerObject}
              langEn={langEn}
              isTabContent={true}
              title={LABEL.PROPOSED_SUMMARY_MANPOWER}
            />
          ) : content === "equipments" ? (
            <EquipmentsList
              data={
                proposedAPIData?.proposalMiscellaneousPostDto
                  ?.miscellaneousPointDtoList || []
              }
              inventoryData={
                proposedAPIData?.proposalInventoryTypeDto
                  ?.inventoryTypeDtoList || []
              }
              othersData={{
                isInventoryOthers:
                  proposedAPIData?.proposalInventoryTypeDto?.isInventoryOthers,
                inventoryOthersObject:
                  proposedAPIData?.proposalInventoryTypeDto
                    ?.inventoryOthersObject,
              }}
              langEn={langEn}
              isTabContent={true}
              title={LABEL.PROPOSED_INVENTORY}
            />
          ) : content === "abbreviation" ? (
            <AbbreviationList
              data={proposeData || []}
              langEn={langEn}
              isTabContent={true}
              title={LABEL.PROPOSED_ABBREVIATION}
            />
          ) : content === "attached_org" ? (
            <AttachedOrgList
              data={proposedAPIData?.attachedOrganization || []}
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
