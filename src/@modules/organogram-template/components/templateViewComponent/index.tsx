import {
  ACLWrapper,
  Button,
  Icon,
  IconButton,
  Label,
  Modal,
  ModalBody,
  toast,
} from "@gems/components";
import {
  COMMON_LABELS,
  DATE_PATTERN,
  IObject,
  generateDateFormat,
  generateUUID,
  isObjectNull,
} from "@gems/utils";
import OrganizationTemplateTree from "./Tree";
// import { orgData } from "./Tree/data2";
import {
  COMMON_LABELS as COMN_LABELS,
  LABELS,
} from "@constants/common.constant";
import { useState } from "react";
import AbbreviationList from "./components/AbbreviationList";
import ActivitiesList from "./components/ActivitesList";
import AllocationOfBusinessList from "./components/AllocationOfBusinessList";
import EquipmentsList from "./components/EquipmentsList";
import ManPowerList from "./components/ManPowerList";
import OrgList from "./components/Organization";

import { ROUTE_L2 } from "@constants/internal-route.constant";
import { ROLES, TEMPLATE_STATUS } from "@constants/template.constant";
import { OMSService } from "@services/api/OMS.service";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import AttachmentList from "./components/AttachmentList";
import AttachedOrgList from "./components/AttachedOrgList";
import Switch from "@components/Switch";
import NotesList from "./components/NotesList";

interface ITemplateViewComponent {
  updateData: IObject;
  inventoryData?: IObject[];
  manpowerData?: IObject;
  isSubmitLoading?: boolean;
  organogramView?: boolean;
}

const TemplateViewComponent = ({
  updateData,
  inventoryData,
  manpowerData,
  organogramView = false,
}: ITemplateViewComponent) => {
  const treeData =
    !isObjectNull(updateData) &&
    !isObjectNull(updateData?.organizationStructureDto)
      ? updateData?.organizationStructureDto
      : {
          id: generateUUID(),
          titleBn: "হালনাগাদ করে শুরু করুন",
          children: [],
        };

  const [langEn, setLangEn] = useState<boolean>(true);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [isApproveLoading, setApproveLoading] = useState<boolean>(false);
  const [isPDFLoading, setPDFLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const switchLang = () => {
    setLangEn(!langEn);
  };

  const onFormClose = () => {
    setFormOpen(false);
  };

  const LABEL = langEn ? LABELS.EN : LABELS.BN;
  const BTN_LABELS = langEn ? COMN_LABELS.EN : COMN_LABELS;

  const onStatusChange = (status: string) => {
    OMSService.updateTemplateStatusById(updateData?.id, status)
      .then((res) => {
        toast.success(res?.message);
        navigate(ROUTE_L2.ORG_TEMPLATE_LIST);
      })
      .catch((error) => toast.error(error?.message));
  };

  const onTemplateApprove = () => {
    setApproveLoading(true);
    OMSService.approveTemplateById(updateData?.id)
      .then((res) => {
        toast.success(res?.message);
        navigate(ROUTE_L2.ORG_TEMPLATE_LIST);
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setApproveLoading(false));
  };

  const captureAndConvertToPDF = async (isPrint = false) => {
    setPDFLoading(true);
    // Get references to the HTML elements you want to capture
    const elementsToCapture = document.getElementsByClassName("pdfGenarator");
    // Create a new instance of jsPDF
    const pdf = new jsPDF("l", "px", [
      elementsToCapture[0]?.clientWidth,
      elementsToCapture[0]?.clientHeight + 100,
    ]);

    // Loop through the elements and capture each one
    for (let i = 0; i < elementsToCapture.length; i++) {
      const element: any = elementsToCapture[i];

      // Use html2canvas to capture the element
      const canvas = await html2canvas(element, {
        scale: 2.5,
        onclone: (clone: any) => {
          clone.querySelector(".animate__fadeIn") &&
            (clone.querySelector(".animate__fadeIn").style.animation = "none");
          clone.querySelector(".treeTitle").style.overflow = "visible";
          clone.querySelector(".treeTitle").style.height = "fit-content";
          clone.querySelector(".dataBlock").style.overflow = "auto";
          clone.querySelector(".dataBlock").style.height = "fit-content";
          clone.querySelector(".dataBlock").style.padding = "20px";
          clone.querySelector(".dataBlock").style.paddingBottom = "30px";
          clone.querySelector(".orgchart").style.paddingBottom = "15px";
        },
      });

      if (i > 0) {
        pdf.addPage(
          [
            canvas.width > elementsToCapture[0]?.clientWidth
              ? canvas.width
              : elementsToCapture[0]?.clientWidth,
            canvas.height > elementsToCapture[0]?.clientHeight
              ? canvas.height
              : elementsToCapture[0]?.clientHeight,
          ],
          "l"
        );
      }

      // if (i < elementsToCapture.length - 1) {
      //   pdf.addPage(
      //     [elementsToCapture[1]?.clientWidth, dataBlockClass.clientHeight],
      //     "l"
      //   );
      // }

      // Convert the canvas to an image and add it to the PDF
      const imageData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imageWidth = canvas.width;
      const imageHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imageWidth, pdfHeight / imageHeight);
      pdf.addImage(
        imageData,
        "PNG",
        0,
        0,
        imageWidth * ratio,
        imageHeight * ratio
      );
    }

    // For open direct print
    if (isPrint) {
      pdf.autoPrint();
      window.open(pdf.output("bloburl"), "_blank");
    }

    // Save or display the PDF
    else pdf.save("Organogram.pdf");
    setPDFLoading(false);
  };

  let titleName =
    (organogramView
      ? langEn
        ? updateData?.organization?.nameEn
        : updateData?.organization?.nameBn
      : langEn
      ? updateData?.titleEn
      : updateData?.titleBn) || "";

  let versionName = updateData?.isEnamCommittee
    ? "Enam Committe Report (26/12/1982)"
    : langEn
    ? updateData?.organogramDate
      ? generateDateFormat(
          updateData?.organogramDate,
          DATE_PATTERN.GOVT_STANDARD,
          "en"
        ) + " Report"
      : ""
    : updateData?.organogramDate
    ? generateDateFormat(
        updateData?.organogramDate,
        DATE_PATTERN.GOVT_STANDARD
      ) + " রিপোর্ট"
    : "";

  return (
    <div>
      <div className="card border p-3 mb-4">
        <div className="d-flex flex-wrap flex-xl-nowrap">
          <div className="w-100">
            <div className="fs-2 text-center fw-bolder mb-0">
              {titleName || COMMON_LABELS.NOT_ASSIGN}
            </div>
            <div className="text-center fw-bolder mb-0">
              <Label className="mb-0 text-info">
                <span className="mb-0 fw-bold me-1">
                  {LABEL.ORGANOGRAM_DATE}:{" "}
                </span>
                {versionName || COMMON_LABELS.NOT_ASSIGN}
              </Label>
            </div>
          </div>

          {!updateData?.isEnamCommittee && (
            <div className="d-flex ms-auto">
              <Switch
                label={langEn ? "বাংলা" : "English"}
                onChange={switchLang}
                className="gap-1 fw-bold text-gray-800"
                noMargin
              />
            </div>
          )}
        </div>
      </div>
      <div className="position-relative border border-secondary mb-3">
        <OrganizationTemplateTree
          treeData={treeData}
          langEn={langEn}
          onCapturePDF={captureAndConvertToPDF}
          pdfClass="pdfGenarator"
          isPDFLoading={isPDFLoading}
          templateName={titleName}
          versionName={versionName}
        />
        <div className="position-absolute" style={{ top: 10, right: 175 }}>
          <IconButton
            iconName="fullscreen"
            color="info"
            variant="fill"
            onClick={() => setFormOpen(true)}
          />
        </div>
        <Modal
          isOpen={formOpen}
          handleClose={onFormClose}
          fullscreen
          title={`${titleName} ${versionName ? "( " + versionName + " )" : ""}`}
        >
          <ModalBody className="p-0">
            <OrganizationTemplateTree
              treeData={treeData}
              langEn={langEn}
              onCapturePDF={captureAndConvertToPDF}
              pdfClass=""
              isPDFLoading={isPDFLoading}
              templateName={titleName}
              versionName={versionName}
            />
          </ModalBody>
        </Modal>
      </div>
      {/* For pdf generating start */}
      <div
        className="d-flex pdfGenarator dataBlock"
        style={{ overflow: "hidden", height: 0, minWidth: "2140px" }}
      >
        <div className="pe-3" style={{ width: "33.33333%" }}>
          <ActivitiesList
            data={updateData?.mainActivitiesDtoList || []}
            langEn={langEn}
          />
          <div>
            <AllocationOfBusinessList
              data={updateData?.businessAllocationDtoList || []}
              langEn={langEn}
            />
          </div>
        </div>
        <div className="pe-4" style={{ width: "33.33333%" }}>
          <EquipmentsList
            data={updateData?.miscellaneousPointDtoList || []}
            inventoryData={inventoryData || []}
            langEn={langEn}
          />
          {organogramView && (
            <AttachedOrgList
              data={updateData?.attachmentOrganization || []}
              langEn={langEn}
            />
          )}
          <AbbreviationList
            data={updateData?.abbreviationDtoList || []}
            langEn={langEn}
          />
          {!organogramView && (
            <NotesList
              data={updateData?.organogramNoteDtoList || []}
              langEn={langEn}
            />
          )}
        </div>
        <div className="" style={{ width: "33.33333%" }}>
          <ManPowerList isLoading={false} data={manpowerData} langEn={langEn} />
          {organogramView && (
            <NotesList
              data={updateData?.organogramNoteDtoList || []}
              langEn={langEn}
            />
          )}
        </div>
      </div>
      {/* Pdf generating end */}
      <div className="row">
        <div className="col-md-6">
          <ActivitiesList
            data={updateData?.mainActivitiesDtoList || []}
            langEn={langEn}
          />

          <div className="mt-3">
            <EquipmentsList
              data={updateData?.miscellaneousPointDtoList || []}
              inventoryData={inventoryData || []}
              langEn={langEn}
            />
          </div>
          {!organogramView && (
            <div className="mt-3">
              <OrgList
                data={updateData?.templateOrganizationsDtoList || []}
                langEn={langEn}
              />
              {/* <CheckListList data={updateData?.attachmentDtoList || []} /> */}
            </div>
          )}
          <div className="mt-3">
            <AttachmentList
              data={updateData?.attachmentDtoList || []}
              langEn={langEn}
            />
          </div>
          <div className="mt-3">
            <NotesList
              data={updateData?.organogramNoteDtoList || []}
              langEn={langEn}
            />
          </div>
          {organogramView && (
            <div className="mt-3">
              <AttachedOrgList
                data={updateData?.attachmentOrganization || []}
                langEn={langEn}
              />
            </div>
          )}
        </div>
        <div className="col-md-6">
          <div className="mt-md-0 mt-3">
            <AllocationOfBusinessList
              data={updateData?.businessAllocationDtoList || []}
              langEn={langEn}
            />
          </div>
          <div className="mt-3">
            <ManPowerList
              isLoading={false}
              data={manpowerData}
              langEn={langEn}
            />
          </div>
          {langEn && (
            <div className="mt-3">
              <AbbreviationList
                data={updateData?.abbreviationDtoList || []}
                langEn={langEn}
              />
            </div>
          )}
        </div>
      </div>
      {/* )} attachmentOrganization */}

      {!organogramView && (
        <>
          <div className="d-flex justify-content-center gap-8 mt-12">
            <ACLWrapper
              visibleToRoles={[ROLES.OMS_TEMPLATE_ENTRY]}
              visibleCustom={updateData?.status === TEMPLATE_STATUS.NEW}
            >
              <Button
                className="rounded-pill px-8 fw-bold"
                color="success"
                onClick={() => onStatusChange("IN_REVIEW")}
              >
                <span> {BTN_LABELS.CONFIRM} </span>
                <Icon icon="check" size={15} className="fw-bold ms-1" />
              </Button>
            </ACLWrapper>

            <ACLWrapper
              visibleToRoles={[ROLES.OMS_TEMPLATE_REVIEW]}
              visibleCustom={updateData?.status === TEMPLATE_STATUS.IN_REVIEW}
            >
              <Button
                className="rounded-pill fw-bold pe-8"
                color="danger"
                onClick={() => onStatusChange("NEW")}
              >
                <Icon icon="arrow_back" className="fw-bold me-2" />
                <span> {BTN_LABELS.SEND_BACK} </span>
              </Button>
              <Button
                className="rounded-pill px-8 fw-bold"
                color="success"
                onClick={() => onStatusChange("IN_APPROVE")}
              >
                <span> {BTN_LABELS.REVIEW} </span>
                <Icon icon="check" size={15} className="fw-bold ms-1" />
              </Button>
            </ACLWrapper>

            <ACLWrapper
              visibleToRoles={[ROLES.OMS_TEMPLATE_APPROVE]}
              visibleCustom={updateData?.status === TEMPLATE_STATUS.IN_APPROVE}
            >
              <Button
                className="rounded-pill fw-bold pe-8"
                color="danger"
                onClick={() => onStatusChange("IN_REVIEW")}
              >
                <Icon icon="arrow_back" className="fw-bold me-2" />
                <span> {BTN_LABELS.SEND_BACK} </span>
              </Button>
              <Button
                className="rounded-pill px-8 fw-bold"
                color="success"
                isLoading={isApproveLoading}
                onClick={() => onTemplateApprove()}
              >
                <span> {BTN_LABELS.APPROVE} </span>
                <Icon icon="check" size={15} className="fw-bold ms-1" />
              </Button>
            </ACLWrapper>
          </div>
        </>
      )}
    </div>
  );
};

export default TemplateViewComponent;
