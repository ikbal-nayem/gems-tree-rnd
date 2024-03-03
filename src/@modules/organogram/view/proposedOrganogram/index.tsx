import { ContentPreloader, Tab, TabBlock, toast } from "@gems/components";
import { IObject, isObjectNull } from "@gems/utils";
import TemplateViewComponent from "@modules/organogram-template/components/templateViewComponent";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { TaskBuilder } from "./taskBuilder";
import ManpowerRequest from "./manpowerRequest";
import { tabs } from "./configs";

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

  return (
    <div>
      <div className="d-flex bg-white rounded mb-3 overflow-auto fs-5 px-4 gap-3">
        <div
          className="cursor-pointer pe-6"
          data-kt-menu-trigger="{default: 'click'}"
        >
          <span
            className={`nav-link text-active-primary cursor-pointer my-2 fw-bold text-gray-700`}
          >
            প্রস্তাবিত পরিবর্তনসমূহ
          </span>
          <div
            className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-700 menu-state-bg menu-state-primary fw-bold py-2 fs-6 w-200px"
            data-kt-menu="true"
          >
            {subjects?.map((p) => {
              return (
                <div className="menu-item px-2">
                  <div className="menu-link">{p.titleBn}</div>
                </div>
              );
            })}
          </div>
        </div>
        <Tab tabs={tabs} activeIndex={activeTab} onChange={handleTabIndex} />
      </div>
      {isLoading && <ContentPreloader />}
      {!isLoading && !isObjectNull(organogramData) && (
        <div className="mt-3">
          <TabBlock index={0} activeIndex={activeTab}>
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
          </TabBlock>
          <TabBlock index={1} activeIndex={activeTab}>
            <ManpowerRequest dataList={null} isEnamCommittee={true} />
          </TabBlock>
          <TabBlock index={2} activeIndex={activeTab}>
            <TaskBuilder />
          </TabBlock>
          <TabBlock index={3} activeIndex={activeTab}></TabBlock>
          <TabBlock index={4} activeIndex={activeTab}></TabBlock>
          <TabBlock index={5} activeIndex={activeTab}></TabBlock>
          <TabBlock index={6} activeIndex={activeTab}></TabBlock>
          <TabBlock index={7} activeIndex={activeTab}></TabBlock>
        </div>
      )}
    </div>
  );
};

export default ProposedOrganogramView;
