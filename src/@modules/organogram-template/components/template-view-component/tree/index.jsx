import { Button, Icon, IconButton } from "@gems/components";
import { useEffect, useRef, useState } from "react";
import { ChartContainer } from "../../../../../@components/OrgChart/ChartContainer";
import { CoreService } from "../../../../../@services/api/Core.service";
import MyNode from "./MyNode";
import NodeDetails from "./NodeDetails";
import ManPowerDetails from "./ManPowerDetails";

const OrganizationTemplateTree = ({
  treeData,
  langEn,
  onCapturePDF,
  pdfClass,
  headerData,
  isPDFLoading,
  organogramView = false,
}) => {
  const [postList, setPostist] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [manpowerListModalOpen, setManpowerListModalOpen] = useState(false);
  const [isDownloadButton, setIsDownlaodButton] = useState(true);
  const selectedNode = useRef(null);

  useEffect(() => {
    CoreService.getPostList().then((resp) => setPostist(resp.body || []));
  }, []);

  const onViewOrManPowertableView = (data, type) => {
    selectedNode.current = data;
    if (type === 'view') {
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
            organogramView={organogramView}
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
