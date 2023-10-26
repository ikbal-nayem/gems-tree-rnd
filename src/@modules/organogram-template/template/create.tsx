import { useState } from "react";
import TemplateComponent from "../templateComponent";
import { OMSService } from "@services/api/OMS.service";
import { toast } from "@gems/components";

const TemplateCreate = () => {
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const onSubmit = (data) => {
    setIsSubmitLoading(true);
    console.log("data", data);

    OMSService.templateCreate(data)
      .then((res) => {
        toast.success(res?.message);
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setIsSubmitLoading(false));
  };

  return (
    <TemplateComponent onSubmit={onSubmit} isSubmitLoading={isSubmitLoading} />
  );
};

export default TemplateCreate;
