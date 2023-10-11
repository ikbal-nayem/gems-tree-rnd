import OrganizationChart from "@dabeng/react-orgchart";
import { IObject, generateUUID, isObjectNull } from "@gems/utils";
import { useRef, useState } from "react";
import NodeForm from "./Form";
import MyNode from "./my-node";

const orgData = {
	id: "a7c4a37c-a9cf-4399-9d77-6478552ce01d",
	children: [],
	nameBn: "জনপ্রশাসন মন্ত্রণালয়",
	nameEn: "Ministry Of Public Administration",
	organization: {
		id: "77848f4b-3874-4cd5-b0a3-660660c046b3",
		nameEn: "Ministry Of Public Administration",
		nameBn: "জনপ্রশাসন মন্ত্রণালয়",
		officeType: "INSTITUTION_TYPE_GOVERNMENT",
		orgType: "ORG_TYPE_MINISTRY",
		address: "New Eskaton, Dhaka-1000",
		locationId: "1f5e315a-1965-4726-87b8-d597eed4488d",
		email: "info@gems.org.bd",
		fax: "++12333444",
		isActive: true,
	},
};

const addNode = (nd: IObject, parentId: string, templateData: IObject) => {
  if (nd.id === parentId) {
    nd.children = [
      ...nd.children,
      { ...templateData, id: generateUUID(), children: [] },
    ];
    return nd;
  }
  nd.children.forEach((cnd) => {
    cnd = addNode(cnd, parentId, templateData);
  });
  return { ...nd };
};

const editNode = (nd: IObject, nodeId: string, updateData: IObject) => {
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

const CustomNodeChart = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  // const [isSaving, setSaving] = useState<boolean>(false);
  const [test, setTest] = useState<IObject>(orgData);
  const selectedNode = useRef<IObject>(null);
  const updateNodeData = useRef<IObject>(null);

  const treeDispatch = (actionType, data: IObject) => {
    switch (actionType) {
      case "ADD":
        selectedNode.current = data;
        setFormOpen(true);
        break;
      case "EDIT":
        updateNodeData.current = data;
        setFormOpen(true);
        break;
      case "REMOVE":
        setTest(deleteNode(test, data.id));
        break;
      default:
        return;
    }
  };

  const onFormClose = () => {
    selectedNode.current = null;
    updateNodeData.current = null;
    setFormOpen(false);
  };

  const onSubmit = (formData: IObject) => {
    console.log(formData);

    const ad = isObjectNull(updateNodeData.current)
      ? addNode(test, selectedNode.current?.id, formData)
      : editNode(test, updateNodeData.current?.id, formData);
    setTest(ad);
    onFormClose();
  };

  return (
    <div>
      <h6 className="text-center mb-4">MOPA INTERNAL OFFICE TREE</h6>

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
        <OrganizationChart
          // ref={orgchart}
          datasource={test}
          chartClass="myChart"
          NodeTemplate={({ nodeData }) => (
            <MyNode nodeData={nodeData} treeDispatch={treeDispatch} />
          )}
          // draggable={true}
          // zoom={true}
        />
        <NodeForm
          isOpen={formOpen}
          updateData={updateNodeData.current}
          onClose={onFormClose}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default CustomNodeChart;
