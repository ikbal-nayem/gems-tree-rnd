import { ContentPreloader, Tab, TabBlock, toast } from "@gems/components";
import { IObject, isObjectNull } from "@gems/utils";
import { ProposalService } from "@services/api/Proposal.service";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { sortBy } from "utility/utils";
import ProposedOrganogramViewComponent from "../components/proposed-organogram-view-component";
import ContentComparision from "../components/proposed-organogram-view-component/components/ContentComparision";
import { TAB_KEY, tabs } from "./configs";
import { OMSService } from "@services/api/OMS.service";

const ProposedOrganogramView = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inventoryData, setInventoryData] = useState<IObject[]>([]);
  const [attachOrgData, setAttachOrgData] = useState<IObject>();
  const [organogramData, setOrganogramData] = useState<IObject>();
  const [manpowerData, setManpowerData] = useState<IObject>();
  const [parentOrgData, setParentOrgData] = useState<IObject>({});
  const [activeTab, setActiveTab] = useState<number>(0);
  const { state } = useLocation();
  const organogramId = state?.organogramId;
  const subjects = state?.subjects;

  useEffect(() => {
    getOrganogramDetails();
    getTemplateInventoryById();
    getManpowerSummaryById();
    getAttachedOrganizationById();
  }, [organogramId]);

  const handleTabIndex = (idx: number) => {
    setActiveTab(idx);
  };

  const getOrganogramDetails = () => {
    setIsLoading(true);
    ProposalService.FETCH.organogramDetailsByOrganogramId(organogramId)
      .then((resp) => setOrganogramData(resp?.body))
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  const getTemplateInventoryById = () => {
    ProposalService.FETCH.inventoryByOrganogramId(organogramId)
      .then((resp) => {
        setInventoryData(resp?.body);
      })
      .catch((e) => toast.error(e?.message));
  };

  const getManpowerSummaryById = () => {
    OMSService.getTemplateManpowerSummaryById(organogramId)
      .then((resp) => {
        setManpowerData(resp?.body);
      })
      .catch((e) => toast.error(e?.message));
  };

  // const getManpowerProposedSummaryById = () => {
  //   setIsLoading(true);
  //   ProposalService.FETCH.manpowerProposedSummaryById(organogramId)
  //     .then((resp) => {
  //       setManpowerProposedSummaryData(resp?.body || []);
  //     })
  //     .catch((e) => toast.error(e?.message))
  //     .finally(() => setIsLoading(false));
  // };

  const getAttachedOrganizationById = () => {
    OMSService.getAttachedOrganizationById(organogramId)
      .then((resp) => {
        setAttachOrgData(resp?.body);
      })
      .catch((e) => toast.error(e?.message));
  };

  useEffect(() => {
    if (organogramData?.organization?.id) {
      getParentOrganization();
    }
  }, [organogramData]);

  const getParentOrganization = () => {
    ProposalService.FETCH.parentOrganizationByOrgId(
      organogramData?.organization?.id
    )
      .then((resp) => {
        setParentOrgData(resp?.body);
      })
      .catch((e) => toast.error(e?.message));
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
            {subjects?.map((p, idx) => {
              return (
                <li
                  className="dropdown-item text-hover-primary rounded-pill py-2 my-4 mx-1 fs-5 cursor-pointer w-150px"
                  onClick={() => onProposalChange(p?.metaKey)}
                  key={idx}
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
          {sortBy(tabs)?.map((t, idx) => (
            <TabBlock index={t?.displayOrder} activeIndex={activeTab} key={idx}>
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
                <ContentComparision
                  content="manpower"
                  organogramId={organogramId}
                />
              ) : t?.key === TAB_KEY.TASK_BUILDER ? (
                <>
                  <ContentComparision
                    data={organogramData?.mainActivitiesDtoList || []}
                    content="task_builder_main_activity"
                  />
                  <div className="mt-3">
                    <ContentComparision
                      data={organogramData?.businessAllocationDtoList || []}
                      content="task_builder_boa"
                    />
                  </div>
                </>
              ) : t?.key === TAB_KEY.SUMMARY_OF_MANPOWER ? (
                <ContentComparision
                  content="summary_of_manpower"
                  organogramId={organogramId}
                />
              ) : t?.key === TAB_KEY.INVENTORY ? (
                <ContentComparision
                  data={{
                    inventoryData: inventoryData,
                    data: organogramData?.miscellaneousPointDtoList,
                    othersData: {
                      isInventoryOthers: organogramData?.isInventoryOthers,
                      inventoryOthersObject:
                        organogramData?.inventoryOthersObject || "",
                    },
                  }}
                  content="equipments"
                />
              ) : t?.key === TAB_KEY.ABBREVIATION ? (
                <ContentComparision
                  data={organogramData?.abbreviationDtoList || []}
                  content="abbreviation"
                />
              ) : t?.key === TAB_KEY.ATTACHED_ORGANIZATION ? (
                <ContentComparision
                  data={attachOrgData}
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
