import { ROUTE_L2 } from "@constants/internal-route.constant";
import { toast } from "@gems/components";
import { OMSService } from "@services/api/OMS.service";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NodeCreateUpdateForm from "./Form";

const CreateNode = () => {
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [maxManpowerCode, setMaxManpowerCode] = useState<number>(
    state?.maxManpowerCode + 1 || 1
  );

  const navigate = useNavigate();

  const onSubmit = (data) => {
    setIsLoading(true);
    let reqData = {
      ...data,
      organizationOrganogramId: state?.id || null,
      organizationId: state?.orgId || null,
      organogramDate: state?.organogramDate || null,
      code: state?.maxNodeCode ? state?.maxNodeCode + 1 : 1,
      maxNodeCode: state?.maxNodeCode ? state?.maxNodeCode + 1 : 1,
      maxManpowerCode: maxManpowerCode,
    };
    OMSService.SAVE.organogramSingleNodeCreate(reqData)
      .then((res) => {
        toast.success(res?.message);
        navigate(ROUTE_L2.OMS_ORGANOGRAM_NODE_LIST, {
          state: {
            ...state,
            maxNodeCode: state?.maxNodeCode ? state?.maxNodeCode + 1 : 1,
            maxManpowerCode: maxManpowerCode,
          },
        });
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setIsLoading(false));
  };
  return (
    <div>
      <NodeCreateUpdateForm
        onSubmit={onSubmit}
        isNotEnamCommittee={!state?.isEnamCommittee}
        organogramData={state}
        isLoading={isLoading}
        maxManpowerCode={maxManpowerCode}
        setMaxManpowerCode={setMaxManpowerCode}
      />
    </div>
  );
};

export default CreateNode;
