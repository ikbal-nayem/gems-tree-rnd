import { ChartContainer } from "../../../../../../@components/OrgChart/ChartContainer";
import { Button, Icon, IconButton } from "@gems/components";
import { CoreService } from "../../../../../../@services/api/Core.service";
import { useEffect, useRef, useState } from "react";
import MyNode from "./my-node";
import NodeDetails from "./node-details";
import { captureAndConvertToPDF } from "../local-util";

const OrganogramTree = ({
  treeData,
  langEn,
  setPDFLoading,
  pdfClass,
  headerData,
  isPDFLoading,
  organogramView = false,
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


  const download = useRef();
  const onDownload = () => {
    captureAndConvertToPDF(false, setPDFLoading);
  };

  const onPrint = () => {
    captureAndConvertToPDF(true, setPDFLoading);
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
            onView={onView}
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
