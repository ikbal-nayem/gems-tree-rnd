import { ChartContainer } from "@components/OrgChart/ChartContainer";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useRef, useState } from "react";
import NodeDetails from "./node-details";
import MyNode from "./my-node";

// interface IOrganizationTemplateTree {
//   treeData: IObject;
//   langEn: boolean;
// }

const OrganizationTemplateTree = ({
  treeData,
  langEn,
}) => {
  const [postList, setPostist] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const selectedNode = useRef(null);

  useEffect(() => {
    OMSService.getPostList().then((resp) => setPostist(resp.body || []));
  }, []);

  const onView = (data) => {
    selectedNode.current = data;
    setFormOpen(true);
  };

  const onFormClose = () => {
    selectedNode.current = null;
    setFormOpen(false);
  };

  return (
    <>
      <ChartContainer
        // ref={orgchart}
        datasource={treeData}
        chartClass="myChart"
        NodeTemplate={({ nodeData }) => (
          <MyNode
            langEn={langEn}
            nodeData={nodeData}
            postList={postList}
            onView={onView}
          />
        )}
        pan={true}
      />
      <NodeDetails
        isEn={langEn}
        data={selectedNode.current}
        isOpen={formOpen}
        onClose={onFormClose}
      />
    </>
  );
};

export default OrganizationTemplateTree;
