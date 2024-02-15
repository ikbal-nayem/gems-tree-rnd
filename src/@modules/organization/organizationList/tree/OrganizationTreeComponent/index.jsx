import { ChartContainer } from "../../../../../@components/OrgChart/ChartContainer";
import { CoreService } from "../../../../../@services/api/Core.service";
import { useEffect, useState } from "react";
import MyNode from "./my-node";

const OrganizationTemplateTree = ({ treeData }) => {
  const [postList, setPostist] = useState([]);

  useEffect(() => {
    CoreService.getPostList().then((resp) => setPostist(resp.body || []));
  }, []);

  return (
    <div className="position-relative border">
      <ChartContainer
        datasource={treeData}
        chartClass={"myChart "}
        NodeTemplate={({ nodeData }) => (
          <MyNode
            // langEn={langEn}
            nodeData={nodeData}
            postList={postList}
            // onView={onView}
          />
        )}
        // ref={download}
        // headerData={headerData}
        // exportPDF={exportPDF}
        // pan={true}
        // zoom={true}
      />
    </div>
  );
};

export default OrganizationTemplateTree;
