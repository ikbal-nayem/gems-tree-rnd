import { ContentPreloader, Tab, TabBlock, toast } from "@gems/components";
import { IObject, isObjectNull } from "@gems/utils";
import { ProposalService } from "@services/api/Proposal.service";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { sortBy } from "utility/utils";
import ProposedOrganogramViewComponent from "../components/proposedOrganogramViewComponent";
import ContentComparision from "../components/proposedOrganogramViewComponent/components/ContentComparision";
import { TAB_KEY, tabs } from "./configs";
import Manpower from "./tabComponent/manpower";

const ProposedOrganogramView = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inventoryData, setInventoryData] = useState<IObject[]>([]);
  const [attachOrgData, setAttachOrgData] = useState<IObject>();
  const [organogramData, setOrganogramData] = useState<IObject>();
  const [manpowerData, setManpowerData] = useState<IObject>();
  const [nodeManpowerList, setNodeManpowerList] = useState<IObject[]>([]);
  const [abbreviationList, setAbbreviationList] = useState<IObject[]>([]);
  const [parentOrgData, setParentOrgData] = useState<IObject>({});
  const [activeTab, setActiveTab] = useState<number>(0);
  const { state } = useLocation();
  const organogramId = state?.organogramId;
  const previousOrganogramId = state?.previousOrganogramId;
  const subjects = state?.subjects;

  useEffect(() => {
    getOrganogramDetails();
    getTemplateInventoryById();
    getManpowerSummaryById();
    getAttachedOrganizationById();
    getNodeWiseManpowerById();
    getAbbreviationByById();
  }, [organogramId]);

  const handleTabIndex = (idx: number) => {
    setActiveTab(idx);
  };

  const getOrganogramDetails = () => {
    ProposalService.FETCH.organogramDetailsByOrganogramId(organogramId)
      .then((resp) => setOrganogramData(resp?.body))
      .catch((e) => toast.error(e?.message));
  };

  const getTemplateInventoryById = () => {
    setIsLoading(true);
    ProposalService.FETCH.inventoryByOrganogramId(organogramId)
      .then((resp) => {
        setInventoryData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  const getManpowerSummaryById = () => {
    setIsLoading(true);
    ProposalService.FETCH.manpowerSummaryById(organogramId)
      .then((resp) => {
        setManpowerData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  const getNodeWiseManpowerById = () => {
    setIsLoading(true);
    ProposalService.FETCH.nodeWiseManpowerById(organogramId)
      .then((resp) => {
        setNodeManpowerList(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  const getAttachedOrganizationById = () => {
    setIsLoading(true);
    ProposalService.FETCH.attachedOrganizationById(organogramId)
      .then((resp) => {
        setAttachOrgData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  const getAbbreviationByById = () => {
    setIsLoading(true);
    ProposalService.FETCH.abbreviationByOrganogramId(organogramId)
      .then((resp) => {
        setAbbreviationList(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (organogramData?.organization?.id) {
      getParentOrganization();
    }
  }, [organogramData]);

  const getParentOrganization = () => {
    setIsLoading(true);
    ProposalService.FETCH.parentOrganizationByOrgId(
      organogramData?.organization?.id
    )
      .then((resp) => {
        setParentOrgData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  const onProposalChange = (proposalKey: string) => {
    console.log("proposal-Key: ", proposalKey);
  };

  return (
    <div>
      <div className="d-flex bg-white rounded mb-3 fs-5 gap-5">
        <div className="dropdown">
          <button
            className="btn dropdown-toggle fs-5 fw-bold text-hover-info text-gray-700 overflow-auto"
            type="button"
            id="listOfProposal"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            প্রস্তাবিত পরিবর্তনসমূহ
          </button>
          <ul
            className="dropdown-menu ms-1 rounded-4 border border-gray-700 border-4 border-top-0"
            aria-labelledby="listOfProposal"
          >
            {subjects?.map((p) => {
              return (
                <li
                  className="dropdown-item text-hover-primary rounded-pill py-2 my-4 mx-1 fs-5 cursor-pointer w-150px"
                  onClick={() => onProposalChange(p?.metaKey)}
                >
                  {p.titleBn}
                </li>
              );
            })}
          </ul>
        </div>
        <Tab
          tabs={sortBy(tabs)}
          activeIndex={activeTab}
          onChange={handleTabIndex}
        />
      </div>
      {isLoading && <ContentPreloader />}
      {!isLoading && !isObjectNull(organogramData) && (
        <div className="mt-3">
          {sortBy(tabs)?.map((t) => (
            <TabBlock index={t?.displayOrder} activeIndex={activeTab}>
              {t?.key === TAB_KEY.ORGANOGRAM ? (
                <ProposedOrganogramViewComponent
                  organogramData={organogramData}
                  inventoryData={inventoryData}
                  manpowerData={manpowerData}
                  attachedOrganizationData={attachOrgData}
                  organogramView={true}
                  parentOrganizationData={parentOrgData}
                />
              ) : t?.key === TAB_KEY.MANPOWER ? (
                <Manpower
                  dataList={nodeManpowerList}
                  previousOrganogramId={previousOrganogramId}
                  isEnamCommittee={false}
                />
              ) : t?.key === TAB_KEY.TASK_BUILDER ? (
                <ContentComparision
                  previousOrganogramId={previousOrganogramId}
                  proposedData={{
                    mainActivityData:
                      organogramData?.mainActivitiesDtoList || [],
                    businessOfAllocationData:
                      organogramData?.businessAllocationDtoList || [],
                  }}
                  content="task_builder"
                />
              ) : t?.key === TAB_KEY.SUMMARY_OF_MANPOWER ? (
                <ContentComparision
                  previousOrganogramId={previousOrganogramId}
                  proposedData={manpowerData}
                  content="manpower"
                />
              ) : t?.key === TAB_KEY.INVENTORY ? (
                <ContentComparision
                  previousOrganogramId={previousOrganogramId}
                  proposedData={{
                    inventoryData: inventoryData,
                    data: organogramData?.miscellaneousPointDtoList,
                  }}
                  content="equipments"
                />
              ) : t?.key === TAB_KEY.ABBREVIATION ? (
                <ContentComparision
                  previousOrganogramId={previousOrganogramId}
                  proposedData={abbreviationList}
                  content="abbreviation"
                />
              ) : t?.key === TAB_KEY.ATTACHED_ORGANIZATION ? (
                <ContentComparision
                  previousOrganogramId={previousOrganogramId}
                  proposedData={attachOrgData}
                  content="attached_org"
                />
              ) : null}
            </TabBlock>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposedOrganogramView;
