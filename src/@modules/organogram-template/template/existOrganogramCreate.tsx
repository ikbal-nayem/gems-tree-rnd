import { ROUTE_L2 } from "@constants/internal-route.constant";
import { toast } from "@gems/components";
import { OMSService } from "@services/api/OMS.service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TemplateComponent from "../components/templateComponent";

const ExistOrganogramCreate = () => {
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    setIsSubmitLoading(true);

    let fileList =
      (data?.attachmentDtoList?.length > 0 &&
        data?.attachmentDtoList?.map((item) => {
          return item.checkAttachmentFile;
        })) ||
      [];

    let attachmentDto =
      (data?.attachmentDtoList?.length > 0 &&
        data?.attachmentDtoList?.map((item) => {
          delete item.checkAttachmentFile;
          return item;
        })) ||
      [];

    let reqPayload = {
      ...data,
      attachmentDtoList: attachmentDto,
      isTemplate: false,
      status: "NEW",
    };

    let fd = new FormData();

    fd.append("body", JSON.stringify(reqPayload));
    fileList.forEach((element) => {
      fd.append("files", element);
    });

    OMSService.templateCreate(fd)
      .then((res) => {
        toast.success(res?.message);
        navigate(ROUTE_L2.OMS_ORGANOGRAM_DRAFT_LIST);
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setIsSubmitLoading(false));
  };

  return (
    <TemplateComponent
      onSubmit={onSubmit}
      isSubmitLoading={isSubmitLoading}
      isExistOrganogramCreate={true}
    />
  );
};

export default ExistOrganogramCreate;
