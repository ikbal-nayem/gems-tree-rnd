import React, { useState } from "react";
import OrganizationTemplateTree from "./Tree";
import { COMMON_LABELS, IObject } from "@gems/utils";
import { orgData } from "./Tree/data";
import { Button } from "@gems/components";

const TemplateTree = () => {
  const [treeData, setTreeData] = useState<IObject>(orgData);
  const [data, setData] = useState<any>();

  const handleTemplaTreeData = (title: string, value) => {
    setData({ ...data, [title]: value });
  };

  const finalSubmit = () => {
    console.log("ddddddd", treeData);
  };

  return (
    <div>
      <OrganizationTemplateTree treeData={treeData} setTreeData={setTreeData} />
      <div className="d-flex gap-3 justify-content-center">
        <Button color="primary" onClick={finalSubmit}>
          {COMMON_LABELS.SAVE}
        </Button>
      </div>
    </div>
  );
};

export default TemplateTree;
