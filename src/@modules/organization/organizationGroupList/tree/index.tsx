import { MENU } from "@constants/menu-titles.constant";
import { PageTitle } from "@context/PageData";
import { ContentPreloader, NoData } from "@gems/components";
import { IObject } from "@gems/utils";
import { useEffect, useState } from "react";
import CountTreeComponent from "./countTreeComponent";

const Tree = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IObject>({});

  useEffect(() => {
    getTreeData();
  }, []);

  const getTreeData = () => {
    // setLoading(true);
    // OMSService.FETCH.oranizationTreeByOrganizationId(e?.id)
    //   .then((res) => {
    //     setData(res?.body || {});
    //   })
    //   .catch((err) => {
    //     toast.error(err?.message);
    //     setData({});
    //   })
    //   .finally(() => setLoading(false));
  };

  return (
    <>
      <PageTitle>{MENU.BN.ORANIZATION_TYPE_TREE}</PageTitle>
      {loading && <ContentPreloader />}
      {!loading && data?.length > 0 && <CountTreeComponent data={data || {}} />}
      {!loading && !(data?.length > 0) && (
        <NoData details="কোনো প্রতিষ্ঠানের ধরণের ট্রি তথ্য পাওয়া যায় নি!" />
      )}
    </>
  );
};
export default Tree;
