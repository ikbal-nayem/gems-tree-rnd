import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import NodeCreateUpdateForm from "./form";
import { IObject } from "@gems/utils";

const UpdateNode = () => {
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<IObject>({});

  //   const getNodeDetailsById = () => {
  //     setIsLoading(true);
  //     OMSService.getTemplateDetailsByTemplateId(templateId)
  //       .then((resp) => {
  //         setData(resp?.body);
  //       })
  //       .catch((e) => toast.error(e?.message))
  //       .finally(() => setIsLoading(false));
  //   };

  const onSubmit = (data) => {
    setIsLoading(true);
    let reqData = {
      ...data,
      organizationOrganogramId: state?.id || null,
      organizationId: state?.organizationId || null,
      organogramDate: state?.organogramDate || null,
    };
    console.log(reqData);
    setIsLoading(false);
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
