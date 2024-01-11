import { ROUTE_KEY } from "@constants/route-keys.constant";
import { PageTitle } from "@context/PageData";
import { Tab, TabBlock } from "@gems/components";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { checkTabPermission } from "utility/utils";
import List from "./list";
import Tree from "./tree";

const Organization = () => {
  const tabs = [
    {
      label: "তালিকা",
      key: "ORGANIZATION_LIST",
      isHide: checkTabPermission(ROUTE_KEY.OMS_MASTER_ORGANIZATION_LIST),
    },
    {
      label: "ট্রি",
      key: "ORGANIZATION_TREE",
      isHide: checkTabPermission(ROUTE_KEY.OMS_MASTER_ORGANIZATION_TREE),
    },
  ];
  const [searchParam, setSearchParam] = useSearchParams();
  const active = tabs.findIndex(
    (t) => !t?.isHide && t.key === searchParam.get("active")
  );
  const [activeTab, setActiveTab] = useState<number>(active > -1 ? active : 0);

  const handleTabIndex = (idx: number) => {
    setActiveTab(idx);
    setSearchParam({ active: tabs[idx].key });
  };

  return (
    <>
      <PageTitle>প্রতিষ্ঠান</PageTitle>
      <div className="card p-5">
        <Tab tabs={tabs} activeIndex={activeTab} onChange={handleTabIndex} />
        <div className="mt-4 bg-white">
          <TabBlock index={0} activeIndex={activeTab}>
            <List />
          </TabBlock>
          <TabBlock index={1} activeIndex={activeTab}>
            <Tree />
          </TabBlock>
        </div>
      </div>
    </>
  );
};
export default Organization;
