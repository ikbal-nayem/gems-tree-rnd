import { ChartContainer } from "@components/OrgChart/ChartContainer";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useRef, useState } from "react";
import NodeDetails from "./node-details";
import jsPDF from "jspdf";
import MyNode from "./my-node";
import { IconButton } from "@gems/components";

// interface IOrganizationTemplateTree {
//   treeData: IObject;
//   langEn: boolean;
// }

const OrganizationTemplateTree = ({ treeData, langEn }) => {
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

  // Direct Print
  // doc.autoPrint();
  // window.open(doc.output("bloburl"), "_blank");

  // Export PDF
  const exportPDF = (canvas, exportFilename) => {
    const canvasWidth = Math.floor(canvas.width);
    const canvasHeight = Math.floor(canvas.height);
    const canW = canvasWidth > canvasHeight ? canvasWidth : canvasHeight;
    const canH = canvasWidth > canvasHeight ? canvasHeight : canvasWidth;
    const doc = new jsPDF({
      orientation: canvasWidth > canvasHeight ? "landscape" : "portrait",
      unit: "pt",
      format: [canW, canH],
    });
    doc.addImage(canvas.toDataURL("image/jpeg", 1.0), "PNG", 0, 0, canW, canH);
    doc.save(exportFilename + ".pdf");
  };

  const download = useRef();
  const onDownload = () => {
    download.current.exportTo("Organogram", "pdf");
  };

  return (
    <div className="position-relative">
      <ChartContainer
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
        ref={download}
        exportPDF={exportPDF}
        pan={true}
        zoom={true}
      />
      <NodeDetails
        isEn={langEn}
        data={selectedNode.current}
        isOpen={formOpen}
        onClose={onFormClose}
      />
      <div className="position-absolute" style={{ top: 0, right: 20 }}>
        <IconButton
          iconName="download"
          color="info"
          variant="fill"
          onClick={onDownload}
        />
      </div>
    </div>
  );
};

export default OrganizationTemplateTree;
