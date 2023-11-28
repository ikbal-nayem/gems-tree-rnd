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

const OrganizationTemplateTree = ({ treeData, langEn, dataToPDF }) => {
  const [postList, setPostist] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [isDownloadButton, setIsDownlaodButton] = useState(false);
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

  const pdfCallRef = useRef();

  useEffect(() => {
    setIsDownlaodButton(false);
    setTimeout(() => {
      download.current.exportTo("Organogram", "pdf");
      setIsDownlaodButton(true);
    }, 1500);
  }, [langEn]);

  // Export PDF
  const exportPDF = async (canvas, exportFilename) => {
    const canvasWidth = Math.floor(canvas.width);
    const canvasHeight = Math.floor(canvas.height);
    const canW = canvasWidth > canvasHeight ? canvasWidth : canvasHeight;
    const canH = canvasWidth > canvasHeight ? canvasHeight : canvasWidth;
    const doc = new jsPDF({
      orientation: canvasWidth > canvasHeight ? "landscape" : "portrait",
      unit: "pt",
      format: [canW, canH],
      compress: true,
    });
    doc.addImage(canvas.toDataURL("image/png", 1.0), "PNG", 0, 0, canW, canH);
    // doc.save(exportFilename + ".pdf");
    pdfCallRef.current = { ...pdfCallRef.current, doc, exportFilename };
  };

  const download = useRef();
  const onDownload = () => {
    pdfCallRef.current.doc.save(pdfCallRef.current.exportFilename + ".pdf");
    dataToPDF.current.save("Data.pdf");
  };

  const onPrint = () => {
    pdfCallRef.current.doc.autoPrint();
    window.open(pdfCallRef.current.doc.output("bloburl"), "_blank");
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
      <div className="position-absolute" style={{ top: 0, right: 125 }}>
        <IconButton
          iconName="print"
          color="info"
          variant="fill"
          onClick={onPrint}
          isDisabled={!isDownloadButton}
        />
      </div>
      <div className="position-absolute" style={{ top: 0, right: 20 }}>
        <IconButton
          iconName="download"
          color="info"
          variant="fill"
          onClick={onDownload}
          isDisabled={!isDownloadButton}
        />
      </div>
    </div>
  );
};

export default OrganizationTemplateTree;
