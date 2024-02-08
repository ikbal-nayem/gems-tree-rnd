import React, { useState } from "react";
import NodeCreateUpdateForm from "./form";
import { useLocation } from "react-router-dom";

const CreateNode = () => {
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  console.log(state);
  

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
      />
    </div>
  );
};

export default CreateNode;
