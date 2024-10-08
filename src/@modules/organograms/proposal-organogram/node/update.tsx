import { ROUTE_L2 } from "@constants/internal-route.constant";
import { toast } from "@gems/components";
import { IObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import NodeCreateUpdateForm from "./form";

const UpdateNode = () => {
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<IObject>({});
  const [searchParams] = useSearchParams();
  const nodeId = searchParams.get("id");
  const navigate = useNavigate();
  const [maxManpowerCode, setMaxManpowerCode] = useState<number>(
    state?.proposedOrganogram?.maxManpowerCode || 1
  );

  useEffect(() => {
    getNodeDetailsById();
  }, []);

  const getNodeDetailsById = () => {
    OMSService.FETCH.nodeDetailsById(nodeId)
      .then((resp) => {
        setData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  const onSubmit = (item) => {
    setIsLoading(true);
    let reqData = {
      ...item,
      id: nodeId,
      organizationnodeId: state?.proposedOrganogram?.id || null,
      organizationId: state?.proposedOrganization?.id || null,
      organogramDate: state?.proposedDate || null,
      code:
        item?.code ||
        (state?.proposedOrganogram?.maxNodeCode
          ? state?.proposedOrganogram?.maxNodeCode + 1
          : 1),
      maxNodeCode: state?.proposedOrganogram?.maxNodeCode || null,
      maxManpowerCode: maxManpowerCode,
    };
    OMSService.UPDATE.organogramSingleNodeById(nodeId, reqData)
      .then((res) => {
        toast.success(res?.message);
        navigate(ROUTE_L2.OMS_ORGANOGRAM_PROPOSAL_NODE_LIST, {
          state: {
            ...state,
            proposedOrganogram: {
              ...state?.proposedOrganogram,
              maxNodeCode: state?.proposedOrganogram?.maxNodeCode,
              maxManpowerCode: maxManpowerCode,
            },
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
        updateData={data}
        maxManpowerCode={maxManpowerCode}
        setMaxManpowerCode={setMaxManpowerCode}
      />
    </div>
  );
};
export default UpdateNode;
