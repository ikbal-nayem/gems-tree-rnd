import { ContentPreloader, NoData, toast } from "@gems/components";
import { IObject, isObjectNull } from "@gems/utils";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { OMSService } from "../../../@services/api/OMS.service";
import TemplateViewComponent from "../components/templateViewComponent";

const TemplateView = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<IObject>({});
  const [inventoryData, setInventoryData] = useState<IObject[]>([]);
  const [manpowerData, setManpowerData] = useState<IObject>();
  const [attachOrgData, setAttachOrgData] = useState<IObject>();
  const [searchParam] = useSearchParams();
  const { state } = useLocation();
  const templateId = searchParam.get("id") || "";
  const organizationId = state?.organizationData?.organizationId || "";

  useEffect(() => {
    getTemplateDetailsDetailsById();
    getTemplateInventoryById();
    getManpowerSummaryById();
    if (organizationId) getAttachedOrganizationById();
  }, []);

  const getTemplateDetailsDetailsById = () => {
    setIsLoading(true);
    OMSService.getTemplateDetailsByTemplateId(templateId)
      .then((resp) => {
        setData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  const getTemplateInventoryById = () => {
    setIsLoading(true);
    OMSService.getTemplateInventoryByTemplateId(templateId)
      .then((resp) => {
        setInventoryData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  const getManpowerSummaryById = () => {
    setIsLoading(true);
    OMSService.getTemplateManpowerSummaryById(templateId)
      .then((resp) => {
        setManpowerData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  const getAttachedOrganizationById = () => {
    setIsLoading(true);
    OMSService.getAttachedOrganizationByTemplateAndOrgId(
      templateId,
      organizationId
    )
      .then((resp) => {
        setAttachOrgData(resp?.body);
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
          stateOrganizationData={state?.organizationData || {}}
          fromList={state?.fromList}
          isFormDraft={state?.isFormDraft}
        />
      )}
      {!isLoading && isObjectNull(data) && (
        <NoData details="কোনো টেমপ্লেট তথ্য খুঁজে পাওয়া যায় নি !!" />
      )}
    </>
  );
};

export default TemplateView;
