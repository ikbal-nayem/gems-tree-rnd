import { ContentPreloader, toast } from "@gems/components";
import { IObject, isObjectNull, searchParamsToObject } from "@gems/utils";
import TemplateViewComponent from "@modules/organogram-template/components/templateViewComponent";
import { OMSService } from "@services/api/OMS.service";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const OrganogramTab = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<IObject>({});
  const [inventoryData, setInventoryData] = useState<IObject[]>([]);
  const [attachOrgData, setAttachOrgData] = useState<IObject>();
  const [manpowerData, setManpowerData] = useState<IObject>();
  const [parentOrganizationData, setParentOrganizationData] = useState<IObject>(
    {}
  );
  const [searchParam, setSearchParam] = useSearchParams();

  const [organogramId, setOrganogramId] = useState<string>(
    searchParam.get("id") || ""
  );
  useEffect(() => {
    getTemplateDetailsDetailsById();
    getTemplateInventoryById();
    getManpowerSummaryById();
    getAttachedOrganizationById();
  }, [organogramId]);

  const getTemplateDetailsDetailsById = () => {
    setIsLoading(true);
    OMSService.getOrganogramDetailsByOrganogramId(organogramId)
      .then((resp) => {
        setData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  const getTemplateInventoryById = () => {
    setIsLoading(true);
    OMSService.getTemplateInventoryByTemplateId(organogramId)
      .then((resp) => {
        setInventoryData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  const getManpowerSummaryById = () => {
    setIsLoading(true);
    OMSService.getTemplateManpowerSummaryById(organogramId)
      .then((resp) => {
        setManpowerData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  const getAttachedOrganizationById = () => {
    setIsLoading(true);
    OMSService.getAttachedOrganizationById(organogramId)
      .then((resp) => {
        setAttachOrgData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (data?.organization?.id) {
      getParentOrganization();
    }
  }, [data]);

  const getParentOrganization = () => {
    setIsLoading(true);
    OMSService.getOrganizationParentByOrgId(data?.organization?.id)
      .then((resp) => {
        setParentOrganizationData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  
  return (
    <>
      {isLoading && <ContentPreloader />}
      {!isLoading && !isObjectNull(data) && (
        <TemplateViewComponent
          updateData={data}
          inventoryData={inventoryData}
          manpowerData={manpowerData}
          attachedOrganizationData={attachOrgData}
          organogramView={true}
          parentOrganizationData={parentOrganizationData}
        />
      )}
    </>
  );
};

export default OrganogramTab;
