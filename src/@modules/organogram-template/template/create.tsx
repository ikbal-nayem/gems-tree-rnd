import { ROUTE_L2 } from "@constants/internal-route.constant";
import { toast } from "@gems/components";
import { OMSService } from "@services/api/OMS.service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TemplateComponent from "../components/templateComponent";
import { makeFormData } from "utility/makeObject";
// import { makeFormData } from "@gems/utils";

const TemplateCreate = () => {
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    // setIsSubmitLoading(true);

    // let test = data?.attachmentDtoList?.map((element) => {
    //   return makeFormData(element);
    // });
    // // console.log(test);

    // test.forEach(element => {
    //   for (const value of element.values()) {
    //     console.log(value);
    //   }
    // });

    let fileList =
      data?.attachmentDtoList?.length > 0 &&
      data?.attachmentDtoList?.map((item) => {
        return item.attachment;
      });

    let attachmentDto =
      data?.attachmentDtoList?.length > 0 &&
      data?.attachmentDtoList?.map((item) => {
        delete item.attachment;
        return item;
      });

    let reqPayload = {
      ...data,
      attachmentDtoList: attachmentDto,
      files: fileList,
      status: "NEW",
    };

    let fd = new FormData();

    fd.append("body", JSON.stringify(reqPayload));
    fileList.forEach((element) => {
      fd.append("files", element);
    });

    // let realTest = makeFormData(reqPayload);

    // console.log("test", reqPayload);
    for (const value of fd.values()) {
      console.log(value);
    }
    // console.log("jjkk", reqPayload);

    OMSService.templateCreate(fd)
      .then((res) => {
        toast.success(res?.message);
        navigate(ROUTE_L2.ORG_TEMPLATE_LIST);
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setIsSubmitLoading(false));
  };

  return (
    <TemplateComponent onSubmit={onSubmit} isSubmitLoading={isSubmitLoading} />
  );
};

export default TemplateCreate;
