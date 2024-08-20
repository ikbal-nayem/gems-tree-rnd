import { ROUTE_L2 } from "@constants/internal-route.constant";
import { toast } from "@gems/components";
import { OMSService } from "@services/api/OMS.service";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NodeCreateUpdateForm from "./form";

const CreateNode = () => {
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [maxManpowerCode, setMaxManpowerCode] = useState<number>(
    state?.proposedOrganogram?.maxManpowerCode + 1 || 1
  );

  const navigate = useNavigate();

  const onSubmit = (data) => {
    setIsLoading(true);
    let reqData = {
      ...data,
      organizationOrganogramId: state?.proposedOrganogram?.id || null,
      organizationId: state?.proposedOrganization?.id || null,
      organogramDate: state?.proposedDate || null,
      code: state?.proposedOrganogram?.maxNodeCode
        ? state?.proposedOrganogram?.maxNodeCode + 1
        : 1,
      maxNodeCode: state?.proposedOrganogram?.maxNodeCode
        ? state?.proposedOrganogram?.maxNodeCode + 1
        : 1,
      maxManpowerCode: maxManpowerCode,
    };
    OMSService.SAVE.organogramSingleNodeCreate(reqData)
      .then((res) => {
        toast.success(res?.message);
        navigate(ROUTE_L2.OMS_ORGANOGRAM_PROPOSAL_NODE_LIST, {
          state: {
            ...state,
            maxNodeCode: state?.proposedOrganogram?.maxNodeCode
              ? state?.proposedOrganogram?.maxNodeCode + 1
              : 1,
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
