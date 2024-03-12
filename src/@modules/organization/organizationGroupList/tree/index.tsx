import { MENU } from "@constants/menu-titles.constant";
import { PageTitle } from "@context/PageData";
import {
  Autocomplete,
  ContentPreloader,
  Icon,
  NoData,
  toast,
} from "@gems/components";
import { IObject, numEnToBn } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useRef, useState } from "react";
import GroupWiseOrgListModal from "./groupWiseOrgListModal";

const Tree = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IObject>({});
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [organiztionaData, setOrganizationData] = useState<IObject>(null);
  const [organizationList, setOrganizationList] = useState<IObject[]>([]);
  const orgItemData = useRef();

  useEffect(() => {
    OMSService.FETCH.ministryDivisionDepartmentList()
      .then((resp) => setOrganizationList(resp?.body || []))
      .catch((err) => toast.error(err?.message));
  }, []);

  const onOrganizationChange = (e) => {
    setOrganizationData(e);
    if (e?.id) {
      setLoading(true);
      OMSService.FETCH.orgGroupTreeByOrganizationId(e?.id)
        .then((res) => {
          setData(res?.body || {});
        })
        .catch((err) => {
          toast.error(err?.message);
          setData({});
        })
        .finally(() => setLoading(false));
    } else setData({});
  };

  const onClose = () => {
    setIsOpen(false);
    orgItemData.current = null;
  };

  return (
    <>
      <PageTitle>{MENU.BN.ORANIZATION_GROUP_TREE}</PageTitle>
      <div className="row">
        <div className="col-xl-4 col-md-6 col-12">
          <Autocomplete
            placeholder="প্রতিষ্ঠান বাছাই করুন"
            options={organizationList || []}
            getOptionLabel={(op) => `${op.nameBn} (${op.nameEn})`}
            getOptionValue={(op) => op?.id}
            value={organiztionaData}
            onChange={(e) => onOrganizationChange(e)}
          />
        </div>
      </div>
      {loading && <ContentPreloader />}
      {!loading &&
        data?.length > 0 &&
        data?.map((item, i) => (
          <div key={i}>
            <div className="mb-6">
              <div className="d-flex mb-2">
                <Icon
                  icon={"add_circle_outline"}
                  className={`${!(item?.count > 0) ? "text-muted" : ""} me-2`}
                  size={20}
                  disabled={!(item?.count > 0)}
                  onClick={() => {
                    setIsOpen(true);
                    orgItemData.current = item;
                  }}
                />
                <div>
                  {item?.nameBn}
                  <span className="mb-0">
                    {" "}
                    {`(${numEnToBn(item?.count || 0)})`}
                  </span>
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
