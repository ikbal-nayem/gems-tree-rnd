import { ContentPreloader, toast } from "@gems/components";
import { IObject, isObjectNull } from "@gems/utils";
import TemplateViewComponent from "@modules/organogram-template/components/templateViewComponent";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";

interface ITab {
  organogramData: IObject;
  organogramId: string;
  isBeginningVersion?: boolean;
}

const OrganogramTab = ({
  organogramId,
  organogramData,
  isBeginningVersion,
}: ITab) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [inventoryData, setInventoryData] = useState<IObject[]>([]);
  const [attachOrgData, setAttachOrgData] = useState<IObject>();
  const [manpowerData, setManpowerData] = useState<IObject>();
  // const [parentOrganizationData, setParentOrganizationData] = useState<IObject>(
  //   {}
  // );

  useEffect(() => {
    if (organogramId) {
      getTemplateInventoryById();
      getManpowerSummaryById();
      getAttachedOrganizationById();
    }
  }, [organogramId]);

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

  return (
    <div>
      {isLoading && <ContentPreloader />}
      {!isLoading && !isObjectNull(organogramData) && (
        <div>
          <TemplateViewComponent
            updateData={organogramData}
            inventoryData={inventoryData}
            manpowerData={manpowerData}
            attachedOrganizationData={attachOrgData}
            organogramView={true}
            // parentOrganizationData={parentOrganizationData}
            isBeginningVersion={isBeginningVersion}
            organogramId={organogramId}
          />
        </div>
      )}
    </div>
  );
};

export default OrganogramTab;
