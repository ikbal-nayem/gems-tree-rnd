import OrganizationChart from "@dabeng/react-orgchart";
import { IObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useRef, useState } from "react";
import MyNode from "./my-node";
import NodeDetails from "./node-details";

interface IOrganizationTemplateTree {
  treeData: IObject;
}

const OrganizationTemplateTree = ({ treeData }: IOrganizationTemplateTree) => {
  const [postList, setPostist] = useState<IObject[]>([]);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const selectedNode = useRef<IObject>(null);
  const isEn = false;

  useEffect(() => {
    OMSService.getPostList().then((resp) => setPostist(resp.body || []));
  }, []);

  const onView = (data: IObject) => {
    selectedNode.current = data;
    setFormOpen(true);
  };

  const onFormClose = () => {
    selectedNode.current = null;
    setFormOpen(false);
  };

  return (
    <>
      <OrganizationChart
        // ref={orgchart}
        datasource={treeData}
        chartClass="myChart"
        NodeTemplate={({ nodeData }) => (
          <MyNode isEn={isEn} nodeData={nodeData} postList={postList} onView={onView} />
        )}
      />
      <NodeDetails isEn={isEn} data={selectedNode.current} isOpen={formOpen} onClose={onFormClose} />
    </>
  );
};

export default OrganizationTemplateTree;
