import { ChartContainer } from "../../../../../@components/OrgChart/ChartContainer";
import { Button, Icon, IconButton } from "@gems/components";
import { CoreService } from "../../../../../@services/api/Core.service";
import { useEffect, useRef, useState } from "react";
import MyNode from "./my-node";
import NodeDetails from "./node-details";

const OrganizationTemplateTree = ({
  treeData,
  langEn,
  onCapturePDF,
  pdfClass,
  headerData,
  isPDFLoading,
  organogramView = false,
  isPreviousVerison = false,
  isOrgangramTab = false,
}) => {
  const [postList, setPostist] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [isDownloadButton, setIsDownlaodButton] = useState(true);
  const selectedNode = useRef(null);

  useEffect(() => {
    CoreService.getPostList().then((resp) => setPostist(resp.body || []));
  }, []);

  const onView = (data) => {
    selectedNode.current = data;
    setFormOpen(true);
  };

  const onFormClose = () => {
    selectedNode.current = null;
    setFormOpen(false);
  };

  useEffect(() => {
    setIsDownlaodButton(false);
    setTimeout(() => {
      setIsDownlaodButton(true);
    }, 1500);
  }, []);

  // // Export PDF
  // const exportPDF = async (canvas, exportFilename) => {
  //   const canvasWidth = Math.floor(canvas.width);
  //   const canvasHeight = Math.floor(canvas.height);
  //   const canW = canvasWidth > canvasHeight ? canvasWidth : canvasHeight;
  //   const canH = canvasWidth > canvasHeight ? canvasHeight : canvasWidth;
  //   const doc = new jsPDF({
  //     orientation: canvasWidth > canvasHeight ? "landscape" : "portrait",
  //     unit: "pt",
  //     format: [canW, canH],
  //     compress: true,
  //   });
  //   doc.addImage(canvas.toDataURL("image/png", 1.0), "PNG", 0, 0, canW, canH);
  //   pdfCallRef.current = { ...pdfCallRef.current, doc, exportFilename };
  // };

  const download = useRef();
  const onDownload = () => {
    onCapturePDF("pdf");
  };

  const onPrint = () => {
    onCapturePDF("print");
  };

  const onImageDownload = () => {
    onCapturePDF("image-download");
  };

  return (
    <div className="position-relative">
      <ChartContainer
        datasource={treeData}
        chartClass={"myChart " + pdfClass}
        NodeTemplate={({ nodeData }) => (
          <MyNode
            langEn={langEn}
            nodeData={nodeData}
            postList={postList}
            isPreviousVerison={isPreviousVerison}
            isOrgangramTab={isOrgangramTab}
            organogramView={organogramView}
            onView={onView}
          />
        )}
        ref={download}
        headerData={headerData}
        // exportPDF={exportPDF}
        pan={true}
        zoom={true}
      />
      <NodeDetails
        isEn={langEn}
        data={selectedNode.current}
        isOpen={formOpen}
        onClose={onFormClose}
      />

      {/* =========================  IMAGE DOWNLOAD BUTTON ========================== */}

      {organogramView && (
        <div className="position-absolute" style={{ top: 0, right: 175 }}>
          <IconButton
            iconName="add_a_photo"
            color="info"
            variant="fill"
            onClick={onImageDownload}
            isDisabled={!isDownloadButton || isPDFLoading}
          />
        </div>
      )}

      {/* =========================  PRINT BUTTON ========================== */}

      {organogramView && (
        <div className="position-absolute" style={{ top: 0, right: 125 }}>
          <IconButton
            iconName="print"
            color="info"
            variant="fill"
            onClick={onPrint}
            isDisabled={!isDownloadButton || isPDFLoading}
          />
        </div>
      )}

      {/* =========================  DOWNLOAD BUTTON ========================== */}
      {organogramView && (
        <div className="position-absolute" style={{ top: 0, right: 20 }}>
          <Button
            color="info"
            className="rounded-circle px-3 py-3"
            isDisabled={!isDownloadButton || isPDFLoading}
            size="sm"
            onClick={onDownload}
          >
            {isPDFLoading ? (
              <span
                className={`spinner-border spinner-border-md align-middle`}
              ></span>
            ) : (
              <Icon icon="download" className="" size={20} />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrganizationTemplateTree;
