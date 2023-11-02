import { useState } from "react";
import TemplateComponent from "../components/templateComponent";
import { OMSService } from "@services/api/OMS.service";
import { toast } from "@gems/components";
import { useNavigate } from "react-router-dom";
import { ROUTE } from "@constants/internal-route.constant";

const TemplateCreate = () => {
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    setIsSubmitLoading(true);

    OMSService.templateCreate(data)
      .then((res) => {
        toast.success(res?.message);
        navigate(ROUTE.ORG_TEMPLATE_LIST);
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setIsSubmitLoading(false));
  };

  return (
    <TemplateComponent onSubmit={onSubmit} isSubmitLoading={isSubmitLoading} />
  );
};

export default TemplateCreate;
