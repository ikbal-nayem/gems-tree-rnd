import { Button, Tab, TabBlock, toast } from "@gems/components";
import { IObject, searchParamsToObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { NewProposalMenu } from "../components/NewProposalMenu";
import OrganogramTab from "./organogram";

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
  const [isPreviousVerison, setIsPreviousVersion] = useState<boolean>(false);
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
      <div className="d-flex justify-content-between bg-white rounded ps-4">
        <div className="d-flex">
          <Tab tabs={tabs} activeIndex={activeTab} onChange={handleTabIndex} />
          <Button
            onClick={() => {
              setIsPreviousVersion(!isPreviousVerison);
              if (isPreviousVerison)
                setOrganogramId(searchParam.get("id") || "");
            }}
            variant="fill"
          >
            <span className={`fs-5 ${isPreviousVerison ? "text-primary" : ""}`}>
              পূর্ববর্তী ভার্সন সমূহ
            </span>
          </Button>
        </div>
        {isLatestVersion && (
          <NewProposalMenu
            organogramId={organogramId}
            organizationId={organizationId}
          />
        )}
      </div>
      <div className="mt-3">
        <TabBlock index={0} activeIndex={activeTab}>
          <OrganogramTab
            templateData={templateData}
            isPreviousVerison={isPreviousVerison}
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
