import { ConfirmationModal, toast } from "@gems/components";
import { META_TYPE, generateUUID, isObjectNull } from "@gems/utils";
import { useEffect, useRef, useState } from "react";
import { ChartContainer } from "../../../../../@components/OrgChart/ChartContainer";
import { CoreService } from "../../../../../@services/api/Core.service";
import { OMSService } from "../../../../../@services/api/OMS.service";
import NodeForm from "./Form";
import MyNode from "./my-node";

const addNode = (nd, parent, templateData) => {
  if ((nd?.id || nd?.nodeId) === (parent?.id || parent?.nodeId)) {
    nd.children = [
      ...parent.children,
      {
        ...templateData,
        nodeId: generateUUID(),
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
  if ((nd?.id || nd?.nodeId) === (node?.id || node?.nodeId)) {
    return { ...node, ...updateData };
  }
  for (var i = 0; i < nd.children.length; i++) {
    nd.children[i] = editNode(nd.children[i], node, updateData);
    if (
      nd.children[i]?.nodeId === node?.nodeId &&
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

// const deleteNode = (nd, deleteItem) => {
//   if (nd?.id && deleteItem?.id && nd?.id === deleteItem?.id) {
//     return nd?.children && nd?.children?.length > 0
//       ? nd?.children?.filter((s) => !s?.nodeId)?.length > 0 &&
//           nd?.children
//             ?.filter((s) => !s?.nodeId)
//             ?.map((d) => {
//               return {
//                 ...d,
//                 children: d?.children?.length > 0 ? deleteNode(d, d) : [],
//                 isDeleted: true,
//               };
//             })
//       : null;
//   }

//   if (nd?.nodeId && deleteItem?.nodeId && nd?.nodeId === deleteItem?.nodeId) {
//     return null;
//   }

//   for (var i = 0; i < nd.children.length; i++) {
//     const nodeState = deleteNode(nd.children[i], deleteItem);
//     if (nodeState && nodeState?.length > 0) {
//       nd.children[i] = {
//         ...nd.children[i],
//         children: nodeState,
//         isDeleted: true,
//       };
//     }
//     if (!nodeState) {
//       if (nd?.children[i]?.id)
//         nd.children[i] = {
//           ...nd.children[i],
//           children: [],
//           isDeleted: true,
//         };
//       else {
//         nd.children.splice(i, 1);
//         break;
//       }
//     }
//   }
//   nd = childSerializer(nd);
//   return { ...nd };
// };

const deleteNode = (nd, nodeId) => {
  if (nd.id === nodeId || nd.nodeId === nodeId) {
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
  maxNodeCode,
  setMaxNodeCode,
  maxManpowerCode,
  setMaxManpowerCode,
  isOrganogramUpdate = false,
  organogramData,
}) => {
  const [formOpen, setFormOpen] = useState(false);
  // const [isSaving, setSaving] = useState<boolean>(false);
  const selectedNode = useRef(null);
  const updateNodeData = useRef(null);

  const [postList, setPostList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteData, setDeleteData] = useState();
  const [displayOrder, setDisplayOrder] = useState(1);
  const postPayload = {
    meta: {
      page: 0,
      limit: 10000000,
      sort: [{ order: "asc", field: isNotEnamCommittee ? "nameBn" : "nameEn" }],
    },
    body: {},
  };
  useEffect(() => {
    CoreService.getPostList(postPayload).then((resp) =>
      setPostList(resp.body || [])
    );
    CoreService.getGrades().then((resp) => setGradeList(resp.body || []));
    CoreService.getByMetaTypeList(META_TYPE.SERVICE_TYPE).then((resp) =>
      setServiceList(resp.body || [])
    );
    CoreService.getByMetaTypeList(META_TYPE.CLASS).then((resp) =>
      setClassList(resp.body || [])
    );
  }, []);

  useEffect(() => {
    isNotEnamCommittee
      ? postList.sort((a, b) => (a.nameBn > b.nameBn ? 1 : -1))
      : postList.sort((a, b) => (a.nameEn > b.nameEn ? 1 : -1));
  }, [isNotEnamCommittee]);

  const cadreObj = serviceList?.find(
    (op) => op?.metaKey === META_TYPE.SERVICE_TYPE_CADRE
  );

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
    setDeleteData(null);
    setIsDeleteModal(false);
  };
  const onConfirmDelete = () => {
    if (isOrganogramUpdate) {
      setIsDeleteLoading(true);
      OMSService.DELETE.organogramNodeWithChildById(deleteData?.id || "")
        .then((res) => {
          toast.success(res?.message);
          setTreeData(
            deleteNode(treeData, deleteData?.id || deleteData?.nodeId)
          );
          setDeleteData(null);
          setIsDeleteModal(false);
        })
        .catch((err) => toast.error(err?.message))
        .finally(() => setIsDeleteLoading(false));
    } else {
      setTreeData(deleteNode(treeData, deleteData?.id || deleteData?.nodeId));
      setDeleteData(null);
      setIsDeleteModal(false);
    }
  };

  const onFormClose = () => {
    selectedNode.current = null;
    updateNodeData.current = null;
    setDisplayOrder(displayOrder > 1 ? displayOrder - 1 : 1);
    setFormOpen(false);
  };

  const onSubmit = (formData) => {
    // let ad;
    if (isObjectNull(updateNodeData.current)) {
      selectedNode.current = reOrder(selectedNode.current, formData, "add", "");

      // ad = addNode(treeData, selectedNode.current, formData);

      if (isOrganogramUpdate) {
        let reqData = {
          ...formData,
          ...organogramData,
          parentNodeDTO: selectedNode.current || {},
          parentNodeId: selectedNode.current?.id || "",
          maxNodeCode: maxNodeCode,
          maxManpowerCode: maxManpowerCode,
        };
        OMSService.SAVE.organogramSingleNodeCreate(reqData)
          .then((res) => {
            toast.success(res?.message);
            setTreeData(
              addNode(treeData, selectedNode.current, {
                ...formData,
                id: res?.body || "",
              })
            );
            onFormClose();
          })
          .catch((error) => toast.error(error?.message));
        // .finally(() => onFormClose());
      } else {
        setTreeData(addNode(treeData, selectedNode.current, formData));
        onFormClose();
      }
    } else {
      if (isOrganogramUpdate) {
        let reqData = {
          ...formData,
          ...organogramData,
          code: formData?.code || maxNodeCode ? maxNodeCode + 1 : 1,
          maxNodeCode: maxNodeCode,
          maxManpowerCode: maxManpowerCode,
        };
        OMSService.UPDATE.organogramSingleNodeById(formData?.id, reqData)
          .then((res) => {
            toast.success(res?.message);
            setTreeData(editNode(treeData, updateNodeData.current, formData));
            onFormClose();
          })
          .catch((error) => toast.error(error?.message));
        // .finally(() => onFormClose());
      } else {
        setTreeData(editNode(treeData, updateNodeData.current, formData));
        onFormClose();
      }
      // ad = editNode(treeData, updateNodeData.current, formData);
    }
    // setTreeData(ad);
    // onFormClose();
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
              firstNode={
                (treeData?.id || treeData?.nodeId) ===
                (nodeData?.id || nodeData?.nodeId)
              }
              isNotEnamCommittee={isNotEnamCommittee}
              maxNodeCode={maxNodeCode}
              setMaxNodeCode={setMaxNodeCode}
              maxManpowerCode={maxManpowerCode}
              setMaxManpowerCode={setMaxManpowerCode}
            />
          )}
          // draggable={true}
          // zoom={true}
        />
        <NodeForm
          isOpen={formOpen}
          postList={postList}
          gradeList={gradeList}
          classList={classList}
          serviceList={serviceList}
          cadreObj={cadreObj}
          updateData={updateNodeData.current}
          defaultDisplayOrder={displayOrder}
          onClose={onFormClose}
          onSubmit={onSubmit}
          isNotEnamCommittee={isNotEnamCommittee}
          maxNodeCode={maxNodeCode}
          setMaxNodeCode={setMaxNodeCode}
          maxManpowerCode={maxManpowerCode}
          setMaxManpowerCode={setMaxManpowerCode}
        />
      </div>
      <ConfirmationModal
        isOpen={isDeleteModal}
        isSubmitting={isDeleteLoading}
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
