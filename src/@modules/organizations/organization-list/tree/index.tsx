import {
  Autocomplete,
  ContentPreloader,
  NoData,
  toast,
} from "@gems/components";
import { IObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import ModuleNodeComponent from "./OrganizationNodeComponent";

const Tree = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IObject>({});
  const [organiztionaData, setOrganizationData] = useState<IObject>(null);
  const [organizationList, setOrganizationList] = useState<IObject[]>([]);

  useEffect(() => {
    OMSService.FETCH.ministryDivisionDepartmentList()
      .then((resp) => setOrganizationList(resp?.body || []))
      .catch((err) => toast.error(err?.message));
  }, []);

  const onOrganizationChange = (e) => {
    setOrganizationData(e);
    if (e?.id) {
      setLoading(true);
      OMSService.FETCH.oranizationTreeByOrganizationId(e?.id)
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

  return (
    <>
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
      {!loading && Object.keys(data)?.length > 0 && (
        // <OrganizationTemplateTree treeData={data || {}} />
        <ModuleNodeComponent data={data} />
      )}
      {!loading && !(Object.keys(data)?.length > 0) && (
        <NoData details="কোনো প্রতিষ্ঠানের ট্রি তথ্য পাওয়া যায় নি!" />
      )}
    </>
  );
};
export default Tree;
