import { ContentPreloader, Tab, TabBlock, toast } from "@gems/components";
import { IObject, isObjectNull } from "@gems/utils";
import TemplateViewComponent from "@modules/organogram-template/components/templateViewComponent";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { TaskBuilder } from "./taskBuilder";
import ManpowerRequest from "./manpowerRequest";
import { tabs } from "./configs";
import { sortBy } from "utility/utils";

const ProposedOrganogramView = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inventoryData, setInventoryData] = useState<IObject[]>([]);
  const [attachOrgData, setAttachOrgData] = useState<IObject>();
  const [organogramData, setOrganogramData] = useState<IObject>();
  const [manpowerData, setManpowerData] = useState<IObject>();
  const [nodeManpowerList, setNodeManpowerList] = useState<IObject[]>([]);
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
    getNodeWiseManpowerById();
  }, [organogramId]);

  const handleTabIndex = (idx: number) => {
    setActiveTab(idx);
  };

  const getOrganogramDetails = () => {
    OMSService.getOrganogramDetailsByOrganogramId(organogramId)
      .then((resp) => setOrganogramData(resp?.body))
      .catch((e) => toast.error(e?.message));
  };

  const getTemplateInventoryById = () => {
    setIsLoading(true);
    OMSService.getTemplateInventoryByTemplateId(organogramId)
      .then((resp) => {
        setInventoryData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  const getManpowerSummaryById = () => {
    setIsLoading(true);
    OMSService.getTemplateManpowerSummaryById(organogramId)
      .then((resp) => {
        setManpowerData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  const getNodeWiseManpowerById = () => {
    setIsLoading(true);
    OMSService.FETCH.nodeWiseManpowerById(organogramId)
      .then((resp) => {
        setNodeManpowerList(resp?.body);
        // console.log(resp?.body);
        
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  const getAttachedOrganizationById = () => {
    setIsLoading(true);
    OMSService.getAttachedOrganizationById(organogramId)
      .then((resp) => {
        setAttachOrgData(resp?.body);
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
    OMSService.getOrganizationParentByOrgId(organogramData?.organization?.id)
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
          <ul className="dropdown-menu ms-1 rounded-4 border border-gray-700 border-4 border-top-0" aria-labelledby="listOfProposal">
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
              {t?.key === "ORGANOGRAM" ? (
                <TemplateViewComponent
                  updateData={organogramData}
                  inventoryData={inventoryData}
                  manpowerData={manpowerData}
                  attachedOrganizationData={attachOrgData}
                  organogramView={true}
                  parentOrganizationData={parentOrgData}
                  isBeginningVersion={true}
                  organogramId={organogramId}
                />
              ) : t?.key === "MANPOWER" ? (
                <ManpowerRequest dataList={nodeManpowerList} isEnamCommittee={false} />
              ) : t?.key === "TASK_BUILDER" ? (
                <TaskBuilder />
              ) : null}
            </TabBlock>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposedOrganogramView;
