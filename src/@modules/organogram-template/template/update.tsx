import { useEffect, useState } from "react";
import TemplateComponent from "../components/templateComponent";
// import { OMSService } from "@services/api/OMS.service";
import { ContentPreloader, NoData, toast } from "@gems/components";
import { IObject, isObjectNull } from "@gems/utils";
import { OMSService } from "../../../@services/api/OMS.service";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTE_L2 } from "@constants/internal-route.constant";

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
      templateData?.attachmentDtoList?.length > 0 &&
      templateData?.attachmentDtoList?.map((item) => {
        if (item?.fileName) return item.checkAttachmentFile;
        return null
      });

    let attachmentDto =
      templateData?.attachmentDtoList?.length > 0 &&
      templateData?.attachmentDtoList?.map((item) => {
        if (item?.fileName) delete item.checkAttachmentFile;
        return item;
      });

    let reqPayload = {
      ...templateData,
      attachmentDtoList: attachmentDto,
      // status: "NEW",
    };

    console.log(fileList);
    

    let fd = new FormData();

    fd.append("body", JSON.stringify(reqPayload));
    fileList.forEach((element) => {
      fd.append("files", element);
    });

    for (const value of fd.values()) {
      console.log(value);
    }

    // let reqPayload = {
    //   ...templateData,
    //   status: data?.status,
    // };

    // OMSService.templateUpdate(fd, templateId)
    //   .then((res) => {
    //     toast.success(res?.message);
    //     navigate(ROUTE_L2.ORG_TEMPLATE_LIST);
    //   })
    //   .catch((error) => toast.error(error?.message))
    //   .finally(() => setIsSubmitLoading(false));
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
