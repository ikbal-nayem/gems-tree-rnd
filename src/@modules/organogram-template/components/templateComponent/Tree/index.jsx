import { ChartContainer } from "@components/OrgChart/ChartContainer";
import { generateUUID, isObjectNull } from "@gems/utils";
import { useEffect, useRef, useState } from "react";
import NodeForm from "./Form";
import MyNode from "./my-node";
import { OMSService } from "@services/api/OMS.service";
import { ConfirmationModal } from "@gems/components";

const addNode = (nd, parent, templateData) => {
  if (nd.id === parent?.id) {
    nd.children = [
      ...parent.children,
      {
        ...templateData,
        id: generateUUID(),
        // displayOrder: nd.children.length + 1 || 1,
        children: [],
      },
    ];
    return childSerializer(nd);
  }
  nd.children.forEach((cnd) => {
    cnd = addNode(cnd, parent, templateData);
  });
  return { ...nd };
};

const editNode = (nd, node, updateData) => {
  if (nd.id === node?.id) {
    return { ...node, ...updateData };
  }
  for (var i = 0; i < nd.children.length; i++) {
    nd.children[i] = editNode(nd.children[i], node, updateData);
    if (
      nd.children[i].id === node.id &&
      node.displayOrder !== updateData.displayOrder
    ) {
      nd = reOrder(
        nd,
        updateData,
        "update",
        node.displayOrder < updateData.displayOrder
          ? "pushForward"
          : "pullBackward"
      );
      nd = childSerializer(nd);
    }
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
  nd = childSerializer(nd);
  return { ...nd };
};

const childSerializer = (parent) => {
  let tempChildList = [];
  parent?.children.sort((a, b) => (a.displayOrder > b.displayOrder ? 1 : -1));
  parent?.children?.forEach((cnd, i) => {
    tempChildList.push({
      ...cnd,
      displayOrder: i + 1,
    });
  });
  return {
    ...parent,
    children: tempChildList,
  };
};

const reOrder = (parent, formData, mode, direction) => {
  let tempChildList = [],
    // tempOrderList = [],
    duplicateOrderFound = false;
  parent?.children.sort((a, b) => (a.displayOrder > b.displayOrder ? 1 : -1));
  parent?.children?.forEach((cnd) => {
    if (+formData?.displayOrder === +cnd?.displayOrder || duplicateOrderFound) {
      // console.log("============= DUPLICATE FOUND ==============");
      duplicateOrderFound = true;
      if (mode === "add") {
        tempChildList.push({
          ...cnd,
          displayOrder: +cnd?.displayOrder + 1,
        });
      } else {
        // UPDATE MODE
        if (cnd?.id === formData?.id) {
          if (direction === "pushForward") {
            // PUSH_FORWARD >>>>>>>>>>>>>>>>>>>>>
            tempChildList.push({
              ...cnd,
              displayOrder: +formData?.displayOrder + 1,
            });
            // tempOrderList.push(+formData?.displayOrder + 1);
          } else {
            // <<<<<<<<<<<<<<<<<<<<< PULL_BACKWARD
            tempChildList.push({
              ...cnd,
              displayOrder: +cnd?.displayOrder,
            });
            // tempOrderList.push(+formData?.displayOrder);
          }
        } else {
          // Children Otherthan the matched node
          if (direction === "pushForward") {
            if (+cnd?.displayOrder > +formData?.displayOrder) {
              tempChildList.push({
                ...cnd,
                displayOrder: +cnd?.displayOrder + 1,
              });
              // tempOrderList.push(+cnd?.displayOrder + 1);
            } else {
              tempChildList.push({
                ...cnd,
                displayOrder: +cnd?.displayOrder,
              });
              // tempOrderList.push(+cnd?.displayOrder);
            }
          } else {
            tempChildList.push({
              ...cnd,
              displayOrder: +cnd?.displayOrder + 1,
            });
            // tempOrderList.push(+cnd?.displayOrder + 1);
          }
        }
      }
    } else {
      tempChildList.push({
        ...cnd,
        displayOrder: +cnd?.displayOrder,
      });
      // tempOrderList.push(+cnd?.displayOrder);
    }
  });
  // tempOrderList.sort((a, b) => (a > b ? 1 : -1));
  // alert(tempOrderList.join(" "));
  // alert(duplicateOrderFound);
  tempChildList.sort((a, b) => (a.displayOrder > b.displayOrder ? 1 : -1));
  return duplicateOrderFound
    ? {
        ...parent,
        children: tempChildList,
      }
    : parent;
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
    let ad;
    if (isObjectNull(updateNodeData.current)) {
      selectedNode.current = reOrder(selectedNode.current, formData, "add", "");
      ad = addNode(treeData, selectedNode.current, formData);
    } else {
      ad = editNode(treeData, updateNodeData.current, formData);
    }
    setTreeData(ad);
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
