import { ChartContainer } from "@components/OrgChart/ChartContainer";
import { generateUUID, isObjectNull, notNullOrUndefined } from "@gems/utils";
import { useEffect, useRef, useState } from "react";
import NodeForm from "./Form";
import MyNode from "./my-node";
import { OMSService } from "@services/api/OMS.service";
import { ConfirmationModal } from "@gems/components";

const addNode = (nd, parentId, templateData) => {
  if (nd.id === parentId) {
    nd.children = [
      ...nd.children,
      {
        ...templateData,
        id: generateUUID(),
        // displayOrder: nd.children.length + 1 || 1,
        children: [],
      },
    ];
    return nd;
  }
  nd.children.forEach((cnd) => {
    cnd = addNode(cnd, parentId, templateData);
  });
  return { ...nd };
};

const editNode = (nd, nodeId, updateData) => {
  if (nd.id === nodeId) {
    return { ...nd, ...updateData };
  }
  for (var i = 0; i < nd.children.length; i++) {
    nd.children[i] = editNode(nd.children[i], nodeId, updateData);
  }
  return { ...nd };
};

const deleteNode = (nd, nodeId) => {
  if (nd.id === nodeId) {
    return null;
  }
  for (var i = 0; i < nd.children.length; i++) {
    const nodeState = deleteNode(nd.children[i], nodeId);

    if (!nodeState) {
      nd.children.splice(i, 1);
      break;
    }
  }
  return { ...nd };
};

const OrganizationTemplateTree = ({
  treeData,
  setTreeData,
  isNotEnamCommittee,
}) => {
  const [formOpen, setFormOpen] = useState(false);
  // const [isSaving, setSaving] = useState<boolean>(false);
  const selectedNode = useRef(null);
  const updateNodeData = useRef(null);

  const [postList, setPostist] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState();
  const [displayOrder, setDisplayOrder] = useState(1);

  useEffect(() => {
    OMSService.getPostList().then((resp) => setPostist(resp.body || []));
  }, []);

  const treeDispatch = (actionType, data) => {
    switch (actionType) {
      case "ADD":
        selectedNode.current = data;
        setDisplayOrder(selectedNode.current?.children?.length + 1 || 1);
        setFormOpen(true);
        break;
      case "EDIT":
        updateNodeData.current = data;
        setFormOpen(true);
        break;
      case "REMOVE":
        setIsDeleteModal(true);
        setDeleteData(data);
        break;
      default:
        return;
    }
  };

  const onCancelDelete = () => {
    setIsDeleteModal(false);
  };
  const onConfirmDelete = () => {
    setTreeData(deleteNode(treeData, deleteData.id));
    setIsDeleteModal(false);
  };

  const onFormClose = () => {
    selectedNode.current = null;
    updateNodeData.current = null;
    setDisplayOrder(displayOrder > 1 ? displayOrder - 1 : 1);
    setFormOpen(false);
  };

  const onSubmit = (formData) => {
    let tempChildList = [],
      duplicateOrderFound = false;
    selectedNode.current?.children?.forEach((cnd, idx) => {
      if (
        +formData?.displayOrder === cnd?.displayOrder ||
        duplicateOrderFound
      ) {
        // selectedNode.current?.children[idx]?.displayOrder =  cnd?.displayOrder + 1
        console.log("============= DUPLICATE FOUND ==============");
        duplicateOrderFound = true;
        // todo: Re-Ordering
        tempChildList.push({
          ...cnd,
          displayOrder: +cnd?.displayOrder + 1,
        });
      } else {
        tempChildList.push(cnd);
      }
    });
    // console.log("duplicate Order Found", duplicateOrderFound);
    selectedNode.current = duplicateOrderFound
      ? {
          ...selectedNode.current,
          children: tempChildList,
        }
      : selectedNode.current;

    console.log("selected Node current: " , selectedNode.current);

    const ad = isObjectNull(updateNodeData.current)
      ? addNode(treeData, selectedNode.current?.id, formData)
      : editNode(treeData, updateNodeData.current?.id, formData);
    setTreeData(ad);
    // selectedNode.current?.children?.forEach((cnd) => console.log(cnd?.displayOrder));
    onFormClose();
  };

  return (
    <div>
      {/* <section className="toolbar">
        <label htmlFor="txt-filename">Filename:</label>
        <input
          id="txt-filename"
          type="text"
          value={filename}
          onChange={onNameChange}
          style={{ fontSize: "1rem", marginRight: "2rem" }}
        />
        <span>Fileextension: </span>
        <input
          id="rd-png"
          type="radio"
          value="png"
          checked={fileextension === "png"}
          onChange={onExtensionChange}
        />
        <label htmlFor="rd-png">png</label>
        <input
          style={{ marginLeft: "1rem" }}
          id="rd-pdf"
          type="radio"
          value="pdf"
          checked={fileextension === "pdf"}
          onChange={onExtensionChange}
        />
        <label htmlFor="rd-pdf">pdf</label>
        <button onClick={exportTot} style={{ marginLeft: "2rem" }}>
          Export
        </button>
      </section> */}
      <div>
        <ChartContainer
          // ref={orgchart}
          datasource={treeData}
          chartClass="myChart"
          NodeTemplate={({ nodeData }) => (
            <MyNode
              nodeData={nodeData}
              treeDispatch={treeDispatch}
              postList={postList}
              firstNode={treeData?.id === nodeData?.id}
              isNotEnamCommittee={isNotEnamCommittee}
            />
          )}
          // draggable={true}
          // zoom={true}
        />
        <NodeForm
          isOpen={formOpen}
          postList={postList}
          updateData={updateNodeData.current}
          defaultDisplayOrder={displayOrder}
          onClose={onFormClose}
          onSubmit={onSubmit}
          isNotEnamCommittee={isNotEnamCommittee}
        />
      </div>
      <ConfirmationModal
        isOpen={isDeleteModal}
        onClose={onCancelDelete}
        onConfirm={onConfirmDelete}
        onConfirmLabel={"মুছে ফেলুন"}
      >
        আপনি কি আসলেই <b>{deleteData?.titleBn || null}</b> মুছে ফেলতে চাচ্ছেন ?
      </ConfirmationModal>
    </div>
  );
};

export default OrganizationTemplateTree;
