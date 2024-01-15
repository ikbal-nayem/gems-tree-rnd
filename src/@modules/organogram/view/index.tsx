import { useEffect, useState } from "react";
import { Tab, TabBlock, toast } from "@gems/components";
import { IObject, searchParamsToObject } from "@gems/utils";
import { useSearchParams } from "react-router-dom";
import { NewProposalMenu } from "../components/NewProposalMenu";
import OrganogramTab from "./organogram";
import { OMSService } from "@services/api/OMS.service";

const tabs = [
  {
    label: "অর্গানোগ্রাম",
    key: "ORGANOGRAM",
  },
];

const OrganogramView = () => {
  const [searchParam, setSearchParam] = useSearchParams();
  const [templateData, setTemplateData] = useState<IObject>({});
  const [isLatestVersion, setIsLatestVersion] = useState<boolean>(true);
  const [organizationId, setOrganizationId] = useState<string>();
  const active = tabs.findIndex((t) => t.key === searchParam.get("active"));
  const [activeTab, setActiveTab] = useState<number>(active > -1 ? active : 0);
  const [organogramId, setOrganogramId] = useState<string>(
    searchParam.get("id") || ""
  );
  const handleTabIndex = (idx: number) => {
    setActiveTab(idx);
    setSearchParam({
      ...searchParamsToObject(searchParam),
      active: tabs[idx].key,
    });
  };

  useEffect(() => {
    getTemplateDetailsDetailsById();
  }, [organogramId]);

  const getTemplateDetailsDetailsById = () => {
    OMSService.getOrganogramDetailsByOrganogramId(organogramId)
      .then((resp) => {
        setTemplateData(resp?.body);
        if (resp?.body?.organization?.id)
          setOrganizationId(resp?.body?.organization?.id);
      })
      .catch((e) => toast.error(e?.message));
  };

  return (
    <div className="p-5">
      <div className="d-flex bg-white rounded ps-4">
        {isLatestVersion && (
          <NewProposalMenu
            organogramId={organogramId}
            organizationId={organizationId}
          />
        )}
        <Tab tabs={tabs} activeIndex={activeTab} onChange={handleTabIndex} />
      </div>
      <div className="mt-3">
        <TabBlock index={0} activeIndex={activeTab}>
          <OrganogramTab
            templateData={templateData}
            setIsLatestVersion={setIsLatestVersion}
            organogramId={organogramId}
            setOrganogramId={setOrganogramId}
          />
        </TabBlock>
      </div>
    </div>
  );
};

export default OrganogramView;
