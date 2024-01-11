import {
  Autocomplete,
  ContentPreloader,
  NoData,
  toast,
} from "@gems/components";
import { IObject } from "@gems/utils";
import React, { useEffect, useState } from "react";
import ModuleNodeComponent from "./organizationNodeComponent";
import { OMSService } from "@services/api/OMS.service";

const Tree = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IObject>({});
  const [organiztionaData, setOrganizationData] = useState<IObject>(null);
  const [organizationList, setOrganizationList] = useState<IObject[]>([]);

  useEffect(() => {
    OMSService.getOrganizationByType("ORG_TYPE_MINISTRY").then((resp) => {
      setOrganizationList(resp?.body || []);
    });
  }, []);

  const onOrganizationChange = (e) => {
    setOrganizationData(e);
    if (e?.id) {
      setLoading(true);
      OMSService.getTreeByParentOrganization(e?.id)
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
        <ModuleNodeComponent data={data || {}} />
      )}
      {!loading && !(Object.keys(data)?.length > 0) && (
        <NoData details="কোনো প্রতিষ্ঠানের ট্রি তথ্য পাওয়া যায় নি!" />
      )}
    </>
  );
};
export default Tree;
