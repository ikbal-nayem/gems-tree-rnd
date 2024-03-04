import { Button, Tab, TabBlock, toast } from "@gems/components";
import { IObject, searchParamsToObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { NewProposalMenu } from "../components/NewProposalMenu";
import OrganogramTab from "./organogram";

// const tabs = [
//   {
//     label: "অর্গানোগ্রাম",
//     key: "ORGANOGRAM",
//   },
// ];

const OrganogramView = () => {
  const [searchParam] = useSearchParams();
  const [templateData, setTemplateData] = useState<IObject>({});
  // const [isLatestVersion, setIsLatestVersion] = useState<boolean>(true);
  const [organizationId, setOrganizationId] = useState<string>();
  // const active = tabs.findIndex((t) => t.key === searchParam.get("active"));
  // const [activeTab, setActiveTab] = useState<number>(active > -1 ? active : 0);
  const [organogramId, setOrganogramId] = useState<string>(
    searchParam.get("id") || ""
  );
  const [isPreviousVerison, setIsPreviousVersion] = useState<boolean>(false);
  const [isOrgangramTab, setIsOrgangramTab] = useState<boolean>(true);
  // const handleTabIndex = (idx: number) => {
  //   setActiveTab(idx);
  //   setSearchParam({
  //     ...searchParamsToObject(searchParam),
  //     active: tabs[idx].key,
  //   });
  // };

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
          {/* <Tab tabs={tabs} activeIndex={activeTab} onChange={handleTabIndex} /> */}
          <Button
            onClick={() => {
              setIsOrgangramTab(true);
              setOrganogramId(searchParam.get("id") || "");
              setIsPreviousVersion(false);
            }}
            className={`
              ${
                isOrgangramTab ? "border-bottom border-primary rounded-0" : ""
              } px-2`}
            variant="fill"
          >
            <span
              className={`fs-5 ${
                isOrgangramTab ? "text-primary text-bold" : ""
              }`}
            >
              অর্গানোগ্রাম
            </span>
          </Button>
          <Button
            onClick={() => {
              setIsPreviousVersion(true);
              if (!isPreviousVerison) setIsOrgangramTab(false);
            }}
            className={`
              ${
                isPreviousVerison ? "border-bottom border-primary rounded-0" : ""
              } px-2 ms-2`}
            variant="fill"
          >
            <span
              className={`fs-5 ${
                isPreviousVerison ? "text-primary text-bold" : ""
              }`}
            >
              {isPreviousVerison ? "ভার্সন সমূহ" : "পূর্ববর্তী ভার্সন সমূহ"}
            </span>
          </Button>
        </div>
        {!isPreviousVerison && (
          <NewProposalMenu
            organogramId={organogramId}
            organizationId={organizationId}
          />
        )}
      </div>
      <div className="mt-3">
        {/* <TabBlock index={0} activeIndex={activeTab}> */}
        <OrganogramTab
          templateData={templateData}
          isPreviousVerison={isPreviousVerison}
          // isLatestVersion={isLatestVersion}
          // setIsLatestVersion={setIsLatestVersion}
          organogramId={organogramId}
          setOrganogramId={setOrganogramId}
        />
        {/* </TabBlock> */}
      </div>
    </div>
  );
};

export default OrganogramView;
