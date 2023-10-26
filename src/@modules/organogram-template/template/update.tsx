import { useState } from "react";
import TemplateComponent from "../templateComponent";
// import { OMSService } from "@services/api/OMS.service";
import { toast } from "@gems/components";
import { IObject } from "@gems/utils";
import { OMSService } from "../../../@services/api/OMS.service";

const TemplateUpdate = () => {
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [data, setData] = useState<IObject>({});
  // const [searchParam] = useSearchParams();

  // const templateId = searchParam.get("id") || "";

  // useEffect(() => {
  //   getRoleDetailsById();
  // }, []);

  // const getRoleDetailsById = () => {
  //   setLoading(true);
  //   CoreService.getRoleById(templateId)
  //     .then((resp) => {
  //       setRoleDetails({ ...resp?.body } || {});
  //       if (resp?.body?.moduleDTOList) {
  //         reset({
  //           modules: resp?.body?.moduleDTOList || [],
  //         });
  //       }
  //     })
  //     .finally(() => setLoading(false));
  // };

  const onSubmit = (templateData) => {
    setIsSubmitLoading(true);
    console.log("data", templateData);

    OMSService.templateCreate(templateData)
      .then((res) => {
        toast.success(res?.message);
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setIsSubmitLoading(false));
  };

  return (
    <TemplateComponent
      onSubmit={onSubmit}
      isSubmitLoading={isSubmitLoading}
      updateData={data}
    />
  );
};

export default TemplateUpdate;
