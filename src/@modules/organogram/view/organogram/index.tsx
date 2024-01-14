import { Button, ContentPreloader, toast } from "@gems/components";
import {
  DATE_PATTERN,
  IObject,
  generateDateFormat,
  isObjectNull,
} from "@gems/utils";
import TemplateViewComponent from "@modules/organogram-template/components/templateViewComponent";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface ITab {
  templateData: IObject;
  setIsLatestVersion: (d) => void;
}

const OrganogramTab = ({ templateData, setIsLatestVersion }: ITab) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBeginningVersion, setIsBeginningVersion] = useState<boolean>(false);
  const [inventoryData, setInventoryData] = useState<IObject[]>([]);
  const [attachOrgData, setAttachOrgData] = useState<IObject>();
  const [manpowerData, setManpowerData] = useState<IObject>();
  const [parentOrganizationData, setParentOrganizationData] = useState<IObject>(
    {}
  );
  const [verisonList, setVersionList] = useState<IObject[]>([]);
  const [searchParam] = useSearchParams();

  const [organogramId, setOrganogramId] = useState<string>(
    searchParam.get("id") || ""
  );
  useEffect(() => {
    getTemplateInventoryById();
    getManpowerSummaryById();
    getAttachedOrganizationById();
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

  useEffect(() => {
    if (templateData?.organization?.id) {
      getParentOrganization();
    }
  }, [templateData]);

  const getParentOrganization = () => {
    setIsLoading(true);
    OMSService.getOrganizationParentByOrgId(templateData?.organization?.id)
      .then((resp) => {
        setParentOrganizationData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getVersionListById();
  }, []);

  const getVersionListById = () => {
    OMSService.getVersionListByOrganogramId(organogramId)
      .then((resp) => {
        setVersionList(resp?.body);
        setIsBeginningVersion(
          resp?.body?.length &&
            (resp?.body.length < 2 ||
              resp?.body[resp?.body.length - 1]?.organogramId === organogramId)
        );
        setIsLatestVersion(
          resp?.body?.length &&
            (resp?.body.length < 2 ||
              resp?.body[0]?.organogramId === organogramId)
        );
      })
      .catch((e) => toast.error(e?.message));
  };

  const handleVersionChange = (item) => {
    setOrganogramId(item?.organogramId);
    setIsBeginningVersion(
      verisonList?.length &&
        verisonList[verisonList.length - 1]?.organogramId === item?.organogramId
    );
    setIsLatestVersion(
      verisonList?.length && verisonList[0]?.organogramId === item?.organogramId
    );
  };
  return (
    <div>
      {verisonList?.length > 0 && (
        <div className="d-flex bg-white rounded mb-3 overflow-auto">
          {verisonList?.map((d, idx) => {
            return (
              <Button onClick={() => handleVersionChange(d)} key={idx}>
                <span
                  className={`fs-5 ${
                    organogramId === d?.organogramId ? "text-primary" : ""
                  }`}
                >
                  {d?.organogramDate &&
                    generateDateFormat(
                      d?.organogramDate,
                      DATE_PATTERN.GOVT_STANDARD
                    )}
                </span>
              </Button>
            );
          })}
        </div>
      )}
      {isLoading && <ContentPreloader />}
      {!isLoading && !isObjectNull(templateData) && (
        <div>
          <TemplateViewComponent
            updateData={templateData}
            inventoryData={inventoryData}
            manpowerData={manpowerData}
            attachedOrganizationData={attachOrgData}
            organogramView={true}
            parentOrganizationData={parentOrganizationData}
            isBeginningVersion={isBeginningVersion}
            organogramId={organogramId}
          />
        </div>
      )}
    </div>
  );
};

export default OrganogramTab;
