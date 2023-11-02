import { useEffect, useState } from "react";
// import { OMSService } from "@services/api/OMS.service";
import { ContentPreloader, NoData, toast } from "@gems/components";
import { IObject, isObjectNull } from "@gems/utils";
import { OMSService } from "../../../@services/api/OMS.service";
import { useSearchParams } from "react-router-dom";
import TemplateViewComponent from "../components/templateViewComponent";

const TemplateView = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<IObject>({});
  const [inventoryData, setInventoryData] = useState<IObject[]>([]);
  const [manpowerData, setManpowerData] = useState<IObject[]>([]);
  const [searchParam] = useSearchParams();

  const templateId = searchParam.get("id") || "";

  useEffect(() => {
    getTemplateDetailsDetailsById();
    getTemplateInventoryById();
    getManpowerSummaryById();
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
  console.log('Manpower Data');
  console.log(manpowerData);
  console.log(templateId);

  return (
    <>
      {isLoading && <ContentPreloader />}
      {!isLoading && !isObjectNull(data) && (
        <TemplateViewComponent
          updateData={data}
          inventoryData={inventoryData}
        />
      )}
      {!isLoading && isObjectNull(data) && (
        <NoData details="কোনো টেমপ্লেট তথ্য খুঁজে পাওয়া যায় নি !!" />
      )}
    </>
  );
};

export default TemplateView;
