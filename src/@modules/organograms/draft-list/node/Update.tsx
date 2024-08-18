import { ROUTE_L2 } from "@constants/internal-route.constant";
import { toast } from "@gems/components";
import { IObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import NodeCreateUpdateForm from "./Form";

const UpdateNode = () => {
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<IObject>({});
  const [searchParams] = useSearchParams();
  const organogramId = searchParams.get("id");
  // const [maxNodeCode, setMaxNodeCode] = useState<number>(
  //   state?.maxNodeCode || 1
  // );
  const [maxManpowerCode, setMaxManpowerCode] = useState<number>(
    state?.maxManpowerCode || 1
  );
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
      code: item?.code || state?.maxNodeCode ? state?.maxNodeCode + 1 : 1,
      maxNodeCode: state?.maxNodeCode || null,
      maxManpowerCode: maxManpowerCode,
    };
    OMSService.UPDATE.organogramSingleNodeById(organogramId, reqData)
      .then((res) => {
        toast.success(res?.message);
        navigate(ROUTE_L2.OMS_ORGANOGRAM_NODE_LIST, {
          state: {
            ...state,
            maxNodeCode: state?.maxNodeCode || null,
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
        updateData={data}
      />
    </div>
  );
};
export default UpdateNode;
