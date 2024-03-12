import { MENU } from "@constants/menu-titles.constant";
import { PageTitle } from "@context/PageData";
import { ContentPreloader, Icon, NoData } from "@gems/components";
import { IObject } from "@gems/utils";
import { useEffect, useRef, useState } from "react";
import GroupWiseOrgListModal from "./groupWiseOrgListModal";

const Tree = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IObject>({});
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const orgItemData = useRef();

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

  const onClose = () => {
    setIsOpen(false);
    orgItemData.current = null;
  };

  return (
    <>
      <PageTitle>{MENU.BN.ORANIZATION_GROUP_TREE}</PageTitle>
      {loading && <ContentPreloader />}
      {!loading &&
        data?.length > 0 &&
        data?.map((item, i) => (
          <div key={i}>
            <div className="mb-6">
              <div className="d-flex mb-2">
                <Icon
                  icon={"add_circle_outline"}
                  className={`${item?.count > 0 ? "text-muted" : ""} me-2`}
                  size={20}
                  disabled={!(item?.count > 0)}
                  onClick={() => {
                    setIsOpen(true);
                    orgItemData.current = item;
                  }}
                />
                <div>
                  {item?.nameBn}
                  <span className="mb-0 text-gray-600"> {item?.count}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      {!loading && !(data?.length > 0) && (
        <NoData details="কোনো প্রতিষ্ঠানের ধরণের ট্রি তথ্য পাওয়া যায় নি!" />
      )}
      <GroupWiseOrgListModal
        isOpen={isOpen}
        onClose={onClose}
        data={orgItemData.current}
      />
    </>
  );
};
export default Tree;
