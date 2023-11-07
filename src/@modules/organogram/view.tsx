import { useEffect, useState } from "react";
// import { OMSService } from "@services/api/OMS.service";
import {
  ContentPreloader,
  NoData,
  Tab,
  TabBlock,
  toast,
} from "@gems/components";
import { IObject, isObjectNull, searchParamsToObject } from "@gems/utils";
import { useSearchParams } from "react-router-dom";
import { OMSService } from "../../@services/api/OMS.service";
import { NewProposalMenu } from "./components/NewProposalMenu";
import OrganogramViewComponent from "./components/organogramViewComponent";

const tabs = [
  {
    label: "অর্গানোগ্রাম",
    key: "ORGANOGRAM",
  },
  {
    label: "জনবল",
    key: "Manpower",
  },
];

const OrganogramView = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<IObject>({});
  const [searchParam, setSearchParam] = useSearchParams();

  const organogramId = searchParam.get("id") || "";

  const active = tabs.findIndex((t) => t.key === searchParam.get("active"));
  const [activeTab, setActiveTab] = useState<number>(active > -1 ? active : 0);

  const handleTabIndex = (idx: number) => {
    setActiveTab(idx);
    setSearchParam({
      ...searchParamsToObject(searchParam),
      active: tabs[idx].key,
    });
  };

  useEffect(() => {
    getTemplateDetailsDetailsById();
  }, []);

  const getTemplateDetailsDetailsById = () => {
    setIsLoading(true);
    OMSService.getOrganogramDetailsByOrganogramId(organogramId)
      .then((resp) => {
        setData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      {isLoading && <ContentPreloader />}
      {!isLoading && !isObjectNull(data) && (
        <div className="p-5">
          <div className="d-flex bg-white rounded ps-4">
            <NewProposalMenu />
            <Tab
              tabs={tabs}
              activeIndex={activeTab}
              onChange={handleTabIndex}
            />
          </div>
          <div className="mt-3">
            <TabBlock index={0} activeIndex={activeTab}>
              <OrganogramViewComponent
                updateData={data}
              />
            </TabBlock>
            <TabBlock index={1} activeIndex={activeTab}>
              Manpower
            </TabBlock>
          </div>
        </div>
      )}
      {!isLoading && isObjectNull(data) && (
        <NoData details="কোনো টেমপ্লেট তথ্য খুঁজে পাওয়া যায় নি !!" />
      )}
    </>
  );
};

export default OrganogramView;
