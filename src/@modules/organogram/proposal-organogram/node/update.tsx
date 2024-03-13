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
  const organogramId = searchParams.get("id");
  const navigate = useNavigate();

  useEffect(() => {
    getNodeDetailsById();
  }, []);

  const getNodeDetailsById = () => {
    OMSService.FETCH.nodeDetailsById(organogramId)
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
      id: organogramId,
      organizationOrganogramId: state?.id || null,
      organizationId: state?.orgId || null,
      organogramDate: state?.organogramDate || null,
    };
    OMSService.UPDATE.organogramSingleNodeById(organogramId, reqData)
      .then((res) => {
        toast.success(res?.message);
        navigate(ROUTE_L2.OMS_ORGANOGRAM_PROPOSAL_NODE_LIST, { state: state });
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
      />
    </div>
  );
};
export default UpdateNode;
