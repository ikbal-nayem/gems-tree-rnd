import { Button, Icon, IconButton } from "@gems/components";
import { useEffect, useRef, useState } from "react";
import { ChartContainer } from "../../../../../../@components/OrgChart/ChartContainer";
import { captureAndConvertToPDF } from "../local-util";
import ManPowerDetails from "./ManPowerDetails";
import MyNode from "./MyNode";
import NodeDetails from "./NodeDetails";

const OrganogramTree = ({
  treeData,
  langEn,
  setPDFLoading,
  pdfClass,
  headerData,
  isPDFLoading,
  organogramView = false,
}) => {
  const [formOpen, setFormOpen] = useState(false);
  const [manpowerListModalOpen, setManpowerListModalOpen] = useState(false);
  const [isDownloadButton, setIsDownlaodButton] = useState(true);
  const selectedNode = useRef(null);

  const onViewOrManPowertableView = (data, type) => {
    selectedNode.current = data;
    if (type === "view") {
      setFormOpen(true);
    } else {
      setManpowerListModalOpen(true);
    }
  };

  const onFormClose = () => {
    selectedNode.current = null;
    setFormOpen(false);
    setManpowerListModalOpen(false);
  };

  useEffect(() => {
    setIsDownlaodButton(false);
    setTimeout(() => {
      setIsDownlaodButton(true);
    }, 1500);
  }, []);

  const download = useRef();
  const onDownload = () => {
    captureAndConvertToPDF(setPDFLoading, "pdf");
  };

  const onPrint = () => {
    captureAndConvertToPDF(setPDFLoading, "print");
  };

  const onImageDownload = () => {
    captureAndConvertToPDF(setPDFLoading, "image-download");
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
            onViewOrManPowertableView={onViewOrManPowertableView}
          />
        )}
        ref={download}
        headerData={headerData}
        pan={true}
        zoom={true}
      />

      <NodeDetails
        isEn={langEn}
        data={selectedNode.current}
        isOpen={formOpen}
        onClose={onFormClose}
      />

      <ManPowerDetails
        isEn={langEn}
        data={selectedNode?.current || []}
        isOpen={manpowerListModalOpen}
        onClose={onFormClose}
      />

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
            isDisabled={!isDownloadButton}
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

export default OrganogramTree;
