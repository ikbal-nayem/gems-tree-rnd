import React, { useState } from "react";
import OrganizationTemplateTree from "./Tree";
import { COMMON_LABELS, IObject } from "@gems/utils";
import { orgData } from "./Tree/data";
import { Button, Input, Separator } from "@gems/components";
import Activities from "./activities";
import Equipments from "./equipments";
import Abbreviations from "./abbreviation";
import AllocationOfBusiness from "./allocationOfBusiness";
import CheckList from "./checkList";

const TemplateTree = () => {
  const [title, setTitle] = useState<string>("");
  const [treeData, setTreeData] = useState<IObject>(orgData);
  const [data, setData] = useState<any>();

  const onOtherDataSet = (title: string, value) => {
    setData({ ...data, [title]: value });
  };

  const onFinalSubmit = () => {
    console.log("ddddddd", treeData);
  };

  console.log("Shoronjam: ", data);

  console.log("tree", treeData);

  return (
    <div>
      <OrganizationTemplateTree treeData={treeData} setTreeData={setTreeData} />
      <div className="row">
        <div className="col-md-6">
          <div className="card border p-3">
            <div className="card-head d-flex justify-content-between align-items-center">
              <h4 className="m-0">টেমপ্লেট নাম</h4>
            </div>
            <Separator className="mt-1 mb-2" />
            <Input
              type="search"
              noMargin
              placeholder="টেমপ্লেট নাম"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <Activities
              data={data?.activities}
              onOtherDataSet={onOtherDataSet}
            />
          </div>
          <div className="mt-3">
            <AllocationOfBusiness data={data} onOtherDataSet={onOtherDataSet} />
          </div>
          <div className="mt-3">
            <CheckList data={data} onOtherDataSet={onOtherDataSet} />
          </div>
        </div>
        <div className="col-md-6">
          <Equipments data={data} onOtherDataSet={onOtherDataSet} />
          <div className="mt-3">
            <Abbreviations data={data} onOtherDataSet={onOtherDataSet} />
          </div>
        </div>
      </div>
      <div className="d-flex gap-3 justify-content-center mt-5">
        <Button color="primary" onClick={onFinalSubmit}>
          {COMMON_LABELS.SAVE}
        </Button>
      </div>
    </div>
  );
};

export default TemplateTree;
