import { useState } from "react";
// import { OMSService } from "@services/api/OMS.service";
import { Tab, TabBlock } from "@gems/components";
import { searchParamsToObject } from "@gems/utils";
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

  const active = tabs.findIndex((t) => t.key === searchParam.get("active"));
  const [activeTab, setActiveTab] = useState<number>(active > -1 ? active : 0);

  const handleTabIndex = (idx: number) => {
    setActiveTab(idx);
    setSearchParam({
      ...searchParamsToObject(searchParam),
      active: tabs[idx].key,
    });
  };

  return (
    <>
      {/* {isLoading && <ContentPreloader />}
      {!isLoading && !isObjectNull(data) && ( */}
      <div className="p-5">
        <div className="d-flex bg-white rounded ps-4">
          <NewProposalMenu />
          <Tab tabs={tabs} activeIndex={activeTab} onChange={handleTabIndex} />
        </div>
        <div className="mt-3">
          <TabBlock index={0} activeIndex={activeTab}>
            {" "}
            <OrganogramTab />
          </TabBlock>
        </div>
      </div>
      {/* )} */}
      {/* {!isLoading && isObjectNull(data) && (
        <NoData details="কোনো টেমপ্লেট তথ্য খুঁজে পাওয়া যায় নি !!" />
      )} */}
    </>
  );
};

export default OrganogramView;
