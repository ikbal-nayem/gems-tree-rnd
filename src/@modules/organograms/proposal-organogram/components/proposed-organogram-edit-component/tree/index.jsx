import { ConfirmationModal, toast } from "@gems/components";
import { META_TYPE, generateUUID, isObjectNull } from "@gems/utils";
import { useEffect, useRef, useState } from "react";
import { ChartContainer } from "../../../../../../@components/OrgChart/ChartContainer";
import { CoreService } from "../../../../../../@services/api/Core.service";
import { OMSService } from "../../../../../../@services/api/OMS.service";
import NodeForm from "./Form";
import MyNode from "./MyNode";

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

const deleteNode = (nd, deleteItem) => {
  if (
    nd?.id &&
    deleteItem?.id &&
    nd?.id === deleteItem?.id &&
    deleteItem?.isAddition
  ) {
    return null;
  }

  if (nd?.id && deleteItem?.id && nd?.id === deleteItem?.id) {
    return nd?.children && nd?.children?.length > 0
      ? nd?.children?.filter((s) => !s?.nodeId && !s?.isAddition)?.length > 0 &&
          nd?.children
            ?.filter((s) => !s?.nodeId && !s?.isAddition)
            ?.map((d) => {
              return {
                ...d,
                children: d?.children?.length > 0 ? deleteNode(d, d) : [],
                isDeleted: true,
                isParentDeleted: true,
              };
            })
      : null;
  }

  if (nd?.nodeId && deleteItem?.nodeId && nd?.nodeId === deleteItem?.nodeId) {
    return null;
  }

  for (var i = 0; i < nd.children.length; i++) {
    const nodeState = deleteNode(nd.children[i], deleteItem);
    if (nodeState && nodeState?.length > 0) {
      nd.children[i] = {
        ...nd.children[i],
        children: nodeState || [],
        isDeleted: true,
      };
    }
    if (!nodeState) {
      if (nd?.children[i]?.isAddition) {
        nd.children.splice(i, 1);
      } else if (nd?.children[i]?.id)
        nd.children[i] = {
          ...nd.children[i],
          children: [],
          isDeleted: true,
        };
      else {
        nd.children.splice(i, 1);
        break;
      }
    }
  }
  nd = childSerializer(nd);
  return { ...nd };
};

// const deleteNode = (nd, nodeId) => {
//   if (nd.id === nodeId || nd.nodeId === nodeId) {
//     return null;
//   }
//   for (var i = 0; i < nd.children.length; i++) {
//     const nodeState = deleteNode(nd.children[i], nodeId);

//     if (!nodeState) {
//       nd.children.splice(i, 1);
//       break;
//     }
//   }
//   nd = childSerializer(nd);
//   return { ...nd };
// };

const undoDeleteNode = (nd, undoItem) => {
  if (nd?.id === undoItem?.id) {
    return nd?.children && nd?.children?.length > 0
      ? nd?.children?.map((d) => {
          return {
            ...d,
            children: d?.children?.length > 0 ? undoDeleteNode(d, d) : [],
            isDeleted: false,
            isParentDeleted: false,
          };
        })
      : null;
  }

  for (var i = 0; i < nd.children.length; i++) {
    const nodeState = undoDeleteNode(nd.children[i], undoItem);
    if (nodeState && nodeState?.length > 0) {
      nd.children[i] = {
        ...nd.children[i],
        children: nodeState || [],
        isDeleted: false,
      };
    }
    if (!nodeState) {
      nd.children[i] = {
        ...nd.children[i],
        children: [],
        isDeleted: false,
      };
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
  maxNodeCode,
  setMaxNodeCode,
  maxManpowerCode,
  setMaxManpowerCode,
  organogramData,
}) => {
  const [formOpen, setFormOpen] = useState(false);
  // const [isSaving, setSaving] = useState<boolean>(false);
  const selectedNode = useRef(null);
  const updateNodeData = useRef(null);
  const [gradeList, setGradeList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteData, setDeleteData] = useState();
  const [displayOrder, setDisplayOrder] = useState(1);

  useEffect(() => {
    CoreService.getGrades().then((resp) => setGradeList(resp.body || []));
    CoreService.getByMetaTypeList(META_TYPE.SERVICE_TYPE).then((resp) =>
      setServiceList(resp.body || [])
    );
    CoreService.getByMetaTypeList("CLASS").then((resp) =>
      setClassList(resp.body || [])
    );
  }, []);

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
      case "REMOVE_UNDO":
        // setTreeData(undoDeleteNode(treeData, data));

        OMSService.UPDATE.undoOrganogramNodeWithChildById(
          data?.id || "",
          organogramData?.organizationOrganogramId || ""
        )
          .then((res) => {
            toast.success(res?.message);
            setTreeData(res?.body || {});
          })
          .catch((err) => toast.error(err?.message));
        break;

      default:
        return;
    }
  };

  const onCancelDelete = () => {
    setIsDeleteModal(false);
  };

  const onConfirmDelete = () => {
    setIsDeleteLoading(true);
    OMSService.DELETE.clonedOrganogramNodeWithChildById(
      deleteData?.id || "",
      organogramData?.organizationOrganogramId || ""
    )
      .then((res) => {
        toast.success(res?.message);
        setTreeData(res?.body || {});
        setDeleteData(null);
        setIsDeleteModal(false);
      })
      .catch((err) => toast.error(err?.message))
      .finally(() => setIsDeleteLoading(false));
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
    } else {
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
      // ad = editNode(treeData, updateNodeData.current, formData);
    }
    // setTreeData(ad);
    // onFormClose();
  };

  return (
    <div>
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
          gradeList={gradeList}
          classList={classList}
          serviceList={serviceList}
          cadreObj={cadreObj}
          updateData={updateNodeData.current}
          defaultDisplayOrder={displayOrder}
          onClose={onFormClose}
          onSubmit={onSubmit}
          maxNodeCode={maxNodeCode}
          maxManpowerCode={maxManpowerCode}
          setMaxManpowerCode={setMaxManpowerCode}
        />
      </div>
      <ConfirmationModal
        isOpen={isDeleteModal}
        onClose={onCancelDelete}
        onConfirm={onConfirmDelete}
        isSubmitting={isDeleteLoading}
        onConfirmLabel={"মুছে ফেলুন"}
      >
        আপনি কি আসলেই <b>{deleteData?.titleBn || null}</b> মুছে ফেলতে চাচ্ছেন ?
      </ConfirmationModal>
    </div>
  );
};

export default OrganizationTemplateTree;
