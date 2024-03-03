import { ContentPreloader, toast } from "@gems/components";
import { IObject, isObjectNull } from "@gems/utils";
import TemplateViewComponent from "@modules/organogram-template/components/templateViewComponent";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ProposedOrganogramView = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inventoryData, setInventoryData] = useState<IObject[]>([]);
  const [attachOrgData, setAttachOrgData] = useState<IObject>();
  const [organogramData, setOrganogramData] = useState<IObject>();
  const [manpowerData, setManpowerData] = useState<IObject>();
  const [parentOrganizationData, setParentOrganizationData] = useState<IObject>(
    {}
  );

  const { state } = useLocation();
  const organogramId = state?.organogramId;
  const subjects = state?.subjects;

  useEffect(() => {
    getOrganogramDetails();
    getTemplateInventoryById();
    getManpowerSummaryById();
    getAttachedOrganizationById();
  }, [organogramId]);

  const getOrganogramDetails = () => {
    OMSService.getOrganogramDetailsByOrganogramId(organogramId)
      .then((resp) => setOrganogramData(resp?.body))
      .catch((e) => toast.error(e?.message));
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
    if (organogramData?.organization?.id) {
      getParentOrganization();
    }
  }, [organogramData]);

  const getParentOrganization = () => {
    setIsLoading(true);
    OMSService.getOrganizationParentByOrgId(organogramData?.organization?.id)
      .then((resp) => {
        setParentOrganizationData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <div>
      <div className="d-flex bg-white rounded mb-3 overflow-auto fs-4 p-2 py-4 gap-3">
        <div
          className="cursor-pointer"
          data-kt-menu-trigger="{default: 'click'}"
        >
          <span
            className={`nav-link text-active-primary cursor-pointer ms-4 fw-bold text-gray-700`}
          >
            প্রস্তাবিত পরিবর্তনসমূহ
          </span>
          <div
            className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-700 menu-state-bg menu-state-primary fw-bold py-2 fs-6 w-200px"
            data-kt-menu="true"
          >
            {subjects?.map((p) => {
              return (
                <div className="menu-item px-2">
                  <div className="menu-link">{p.titleBn}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {isLoading && <ContentPreloader />}
      {!isLoading && !isObjectNull(organogramData) && (
        <div>
          <TemplateViewComponent
            updateData={organogramData}
            inventoryData={inventoryData}
            manpowerData={manpowerData}
            attachedOrganizationData={attachOrgData}
            organogramView={true}
            parentOrganizationData={parentOrganizationData}
            isBeginningVersion={true}
            organogramId={organogramId}
          />
        </div>
      )}
    </div>
  );
};

export default ProposedOrganogramView;
