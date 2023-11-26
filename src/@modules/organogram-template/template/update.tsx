import { useEffect, useState } from "react";
import TemplateComponent from "../components/templateComponent";
// import { OMSService } from "@services/api/OMS.service";
import { ROUTE_L2 } from "@constants/internal-route.constant";
import { ContentPreloader, NoData, toast } from "@gems/components";
import { IObject, isObjectNull } from "@gems/utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import { OMSService } from "../../../@services/api/OMS.service";

const TemplateUpdate = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [data, setData] = useState<IObject>({});
  const [searchParam] = useSearchParams();
  const navigate = useNavigate();

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
    // setIsSubmitLoading(true);

    let fileList =
      (templateData?.attachmentDtoList?.length > 0 &&
        templateData?.attachmentDtoList?.map((item) => {
          if (item?.fileName) return item.checkAttachmentFile;
          return undefined;
        })) ||
      [];

    let attachmentDto =
      templateData?.attachmentDtoList?.length > 0 &&
      templateData?.attachmentDtoList?.map((item) => {
        if (item?.fileName) delete item.checkAttachmentFile;
        return item;
      });

    let reqPayload = {
      ...templateData,
      attachmentDtoList: attachmentDto,
      id: templateId,
      status: data?.status,
    };

    let fd = new FormData();

    fd.append("body", JSON.stringify(reqPayload));
    fileList?.length > 0 &&
      fileList.forEach((element) => {
        if (element !== undefined) fd.append("files", element);
      });

    OMSService.templateUpdate(fd)
      .then((res) => {
        toast.success(res?.message);
        navigate(ROUTE_L2.ORG_TEMPLATE_VIEW + "?id=" + templateId);
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
