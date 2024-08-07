import { ContentPreloader, toast } from "@gems/components";
import { IObject, isObjectNull } from "@gems/utils";
import TemplateViewComponent from "@modules/organogram-template/components/templateViewComponent";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const OrganogramView = () => {
  const [searchParam] = useSearchParams();
  const [isOrganogramLoading, setOrganogramLoading] = useState<boolean>(false);
  const [organogramData, setOrganogramData] = useState<IObject>({});

  const [inventoryData, setInventoryData] = useState<IObject[]>([]);
  const [attachOrgData, setAttachOrgData] = useState<IObject>();
  const [manpowerData, setManpowerData] = useState<IObject>();
  const organogramId = searchParam.get("id") || "";

  useEffect(() => {
    if (organogramId) {
      getOrganogramVersionDetailsById();
      getTemplateInventoryById();
      getManpowerSummaryById();
      getAttachedOrganizationById();
    }
  }, [organogramId]);

  const getOrganogramVersionDetailsById = () => {
    setOrganogramLoading(true);
    OMSService.getOrganogramDetailsByOrganogramId(organogramId)
      .then((resp) => {
        setOrganogramData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setOrganogramLoading(false));
  };

  const getTemplateInventoryById = () => {
    OMSService.getTemplateInventoryByTemplateId(organogramId)
      .then((resp) => {
        setInventoryData(resp?.body);
      })
      .catch((e) => toast.error(e?.message));
  };

  const getManpowerSummaryById = () => {
    OMSService.getTemplateManpowerSummaryById(organogramId)
      .then((resp) => {
        setManpowerData(resp?.body);
      })
      .catch((e) => toast.error(e?.message));
  };

  const getAttachedOrganizationById = () => {
    OMSService.getAttachedOrganizationById(organogramId)
      .then((resp) => {
        setAttachOrgData(resp?.body);
      })
      .catch((e) => toast.error(e?.message));
  };

  return (
    <div>
      {isOrganogramLoading && <ContentPreloader />}
      {!isOrganogramLoading && !isObjectNull(organogramData) && (
        <div>
          <TemplateViewComponent
            updateData={organogramData}
            inventoryData={inventoryData}
            manpowerData={manpowerData}
            attachedOrganizationData={attachOrgData}
            organogramView={true}
            // parentOrganizationData={parentOrganizationData}
            isBeginningVersion={true}
            organogramId={organogramId}
          />
        </div>
      )}
    </div>
  );
};

export default OrganogramView;
