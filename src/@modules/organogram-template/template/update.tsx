import { useEffect, useState } from "react";
import TemplateComponent from "../templateComponent";
// import { OMSService } from "@services/api/OMS.service";
import { ContentPreloader, NoData, toast } from "@gems/components";
import { IObject, isObjectNull } from "@gems/utils";
import { OMSService } from "../../../@services/api/OMS.service";
import { useSearchParams } from "react-router-dom";

const TemplateUpdate = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [data, setData] = useState<IObject>({});
  const [searchParam] = useSearchParams();

  const templateId = searchParam.get("id") || "";

  useEffect(() => {
    getTemplateDetailsDetailsById();
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

  const onSubmit = (templateData) => {
    setIsSubmitLoading(true);
    console.log("data", templateData);

    OMSService.templateUpdate(templateData, templateId)
      .then((res) => {
        toast.success(res?.message);
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setIsSubmitLoading(false));
  };

  return (
    <>
      {isLoading && <ContentPreloader />}
      {!isLoading && !isObjectNull(data) && (
        <TemplateComponent
          onSubmit={onSubmit}
          isSubmitLoading={isSubmitLoading}
          updateData={data}
        />
      )}
      {!isLoading && isObjectNull(data) && (
        <NoData details="কোনো টেমপ্লেট তথ্য খুঁজে পাওয়া যায় নি !!" />
      )}
    </>
  );
};

export default TemplateUpdate;
