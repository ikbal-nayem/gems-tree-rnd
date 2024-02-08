import React from "react";
import NodeCreateUpdateForm from "./form";
import { useLocation } from "react-router-dom";

const CreateNode = () => {
  const { state } = useLocation();

  const onSubmit = (formData) => {
    console.log(formData);
  };
  return (
    <div>
      <NodeCreateUpdateForm
        onSubmit={onSubmit}
        isNotEnamCommittee={!state?.isEnamCommittee}
        organogramId={state?.id || ""}
      />
    </div>
  );
};

export default CreateNode;
