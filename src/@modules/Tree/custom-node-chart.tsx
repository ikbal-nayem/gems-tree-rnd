import OrganizationChart from "@dabeng/react-orgchart";
import { IObject, generateId, generateUUID } from "@gems/utils";
import { useRef, useState } from "react";
import NodeForm from "./Form";
import MyNode from "./my-node";

let nodeTemplate = {
  id: null,
  children: [],
  nameBn: "NEW NODE",
  nameEn: "NEW NODE EN",
};

const addNode = (nd, parentId) => {
  let ndc = { ...nd };
  if (ndc.id === parentId) {
    ndc.children.push({ ...nodeTemplate, id: generateUUID() });
    return ndc;
  }
  for(var i=0; i<nd.children.length; i++){
    console.log(ndc.children[i], parentId);
    
    ndc.children[i] = addNode(nd.children[i], parentId);
  }
  // ndc.children.forEach((cnd) => {
  // });
  return ndc;
};

const CustomNodeChart = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isSaving, setSaving] = useState<boolean>(false);
  const tempData = useRef(null);
  const [test, setTest] = useState<IObject>({
    id: "a7c4a37c-a9cf-4399-9d77-6478552ce01d",
    children: [
      // {
      //   id: "e512e0ea-bad0-4b6e-b272-a65e14385e3f",
      //   children: [
      //     {
      //       id: "e37a0852-8b6e-4ad2-94bf-f051eecf8b09",
      //       children: [],
      //       nameBn: "এপিডি অনুবিভাগ",
      //       nameEn: "APD Division",
      //       organization: {
      //         id: "77848f4b-3874-4cd5-b0a3-660660c046b3",
      //         nameEn: "Ministry Of Public Administration",
      //         nameBn: "জনপ্রশাসন মন্ত্রণালয়",
      //         officeType: "INSTITUTION_TYPE_GOVERNMENT",
      //         orgType: "ORG_TYPE_MINISTRY",
      //         address: "New Eskaton, Dhaka-1000",
      //         locationId: "1f5e315a-1965-4726-87b8-d597eed4488d",
      //         email: "info@gems.org.bd",
      //         fax: "++12333444",
      //         isActive: true,
      //       },
      //     },
      //     {
      //       id: "607939a4-561f-4e4b-9335-514f8b079dc6",
      //       children: [],
      //       nameBn: "সিপিডি অনুবিভাগ",
      //       nameEn: "CPD Section",
      //       organization: {
      //         id: "77848f4b-3874-4cd5-b0a3-660660c046b3",
      //         nameEn: "Ministry Of Public Administration",
      //         nameBn: "জনপ্রশাসন মন্ত্রণালয়",
      //         officeType: "INSTITUTION_TYPE_GOVERNMENT",
      //         orgType: "ORG_TYPE_MINISTRY",
      //         address: "New Eskaton, Dhaka-1000",
      //         locationId: "1f5e315a-1965-4726-87b8-d597eed4488d",
      //         email: "info@gems.org.bd",
      //         fax: "++12333444",
      //         isActive: true,
      //       },
      //     },
      //     {
      //       id: "837eee5d-3685-47e8-a9d6-0f061334a751",
      //       children: [],
      //       nameBn: "অতিরিক্ত সচিবের দপ্তর",
      //       nameEn: "Office of Additional Secretary",
      //       organization: {
      //         id: "77848f4b-3874-4cd5-b0a3-660660c046b3",
      //         nameEn: "Ministry Of Public Administration",
      //         nameBn: "জনপ্রশাসন মন্ত্রণালয়",
      //         officeType: "INSTITUTION_TYPE_GOVERNMENT",
      //         orgType: "ORG_TYPE_MINISTRY",
      //         address: "New Eskaton, Dhaka-1000",
      //         locationId: "1f5e315a-1965-4726-87b8-d597eed4488d",
      //         email: "info@gems.org.bd",
      //         fax: "++12333444",
      //         isActive: true,
      //       },
      //     },
      //   ],
      //   nameBn: "সচিবের দপ্তর",
      //   nameEn: "Office of the Secretary",
      //   organization: {
      //     id: "77848f4b-3874-4cd5-b0a3-660660c046b3",
      //     nameEn: "Ministry Of Public Administration",
      //     nameBn: "জনপ্রশাসন মন্ত্রণালয়",
      //     officeType: "INSTITUTION_TYPE_GOVERNMENT",
      //     orgType: "ORG_TYPE_MINISTRY",
      //     address: "New Eskaton, Dhaka-1000",
      //     locationId: "1f5e315a-1965-4726-87b8-d597eed4488d",
      //     email: "info@gems.org.bd",
      //     fax: "++12333444",
      //     isActive: true,
      //   },
      // },
    ],
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
  });

  // For enable download option

  // const [filename, setFilename] = useState<string>("organization_chart");
  // const [fileextension, setFileextension] = useState<string>();
  // const orgchart = useRef<any>();

  // const onNameChange = (event) => {
  //   setFilename(event.target.value);
  // };

  // const onExtensionChange = (event) => {
  //   setFileextension(event.target.value);
  // };

  // const exportTot = () => {
  //   orgchart?.current?.exportTo(filename, fileextension);
  // };

  const treeDispatch = (actionType, data) => {
    switch (actionType) {
      case "ADD":
        const td = addNode({ ...test }, data.id);
        console.log(td);
        setTest(td);
        // setFormOpen(true)
        break;
      case "EDIT":
        break;
      case "REMOVE":
        break;
      default:
        return;
    }
  };

  const onFormClose = () => {
    setFormOpen(false);
    setAlertOpen(false);
    tempData.current = null;
  };

  const onSubmit = (data) => {
    setSaving(true);
    console.log(data);
    setSaving(false);
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
          onClose={onFormClose}
          onSubmit={onSubmit}
          updateData={tempData.current}
          isSubmitting={isSaving}
        />
      </div>
    </div>
  );
};

export default CustomNodeChart;
