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
  searchParamsToObject,
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
import { useNavigate, useSearchParams } from "react-router-dom";
import AttachmentList from "./components/AttachmentList";
import AttachedOrgList from "./components/AttachedOrgList";
import Switch from "@components/Switch";
import NotesList from "./components/NotesList";
import { BUTTON_LABEL, MSG } from "./message";
import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";

interface ITemplateViewComponent {
  updateData: IObject;
  inventoryData?: IObject[];
  manpowerData?: IObject;
  attachedOrganizationData?: IObject;
  isSubmitLoading?: boolean;
  organogramView?: boolean;
}

const TemplateViewComponent = ({
  updateData,
  inventoryData,
  manpowerData,
  attachedOrganizationData,
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
  const [searchParam] = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [modalButtonLabel, setModalButtonLabel] = useState<any>();
  const [modalMsg, setModalMsg] = useState<any>();
  const [modalAction, setModalAction] = useState<any>();
  const msg = langEn ? MSG.EN : MSG.BN;
  const modalBtnLabel = langEn ? BUTTON_LABEL.EN : BUTTON_LABEL.BN;

  const orgData = searchParamsToObject(searchParam) || {};

  const navigate = useNavigate();

  const currentURL = window.location.href;
  // alert("currentURL includes organizationId : " + currentURL.includes("organizationId"));
  // alert("is organogram : " + organogramView);
  organogramView = currentURL.includes("organizationId")
    ? true
    : organogramView;
    
  const switchLang = () => {
    setLangEn(!langEn);
  };

  const onModalClose = () => {
    setIsModalOpen(false);
    setModalAction(null);
  };

  const openModal = (currentStat, action) => {
    setIsModalOpen(true);
    if (currentStat === "TEMPLATE_ENTRY") {
      setModalMsg(msg.SEND_TO_REVIEW);
      setModalButtonLabel(modalBtnLabel.SEND);
      setModalAction(action);
    } else if (currentStat === "TEMPLATE_REVIEW") {
      if (action === "BACK_TO_NEW") {
        setModalMsg(msg.SEND_BACK_TO_NEW);
        setModalButtonLabel(modalBtnLabel.SEND_BACK);
        setModalAction(action);
      } else if (action === "SEND_TO_APPROVE") {
        setModalMsg(msg.SEND_TO_APPROVE);
        setModalButtonLabel(modalBtnLabel.SEND);
        setModalAction(action);
      }
    } else if (currentStat === "TEMPLATE_APPROVE") {
      if (action === "BACK_TO_REVIEW") {
        setModalMsg(msg.SEND_BACK_TO_REVIEW);
        setModalButtonLabel(modalBtnLabel.SEND_BACK);
        setModalAction(action);
      } else if (action === "APPROVE") {
        setModalMsg(msg.APPROVE);
        setModalButtonLabel(modalBtnLabel.APPROVE);
        setModalAction(action);
      }
    }
  };

  const onModalActionConfirm = () => {
    if (modalAction === "SEND_TO_REVIEW" || modalAction === "BACK_TO_REVIEW") {
      onStatusChange("IN_REVIEW");
    } else if (modalAction === "BACK_TO_NEW") {
      onStatusChange("NEW");
    } else if (modalAction === "SEND_TO_APPROVE") {
      onStatusChange("IN_APPROVE");
    } else if (modalAction === "APPROVE") {
      onTemplateApprove();
    }
    setIsModalOpen(false);
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
    const pdf = new jsPDF("l", "px", "letter");

    // Loop through the elements and capture each one
    for (let i = 0; i < elementsToCapture.length; i++) {
      const element: any = elementsToCapture[i];

      // Use html2canvas to capture the element
      const canvas = await html2canvas(element, {
        scale: 2.5,
        onclone: (clone: any) => {
          clone.querySelector(".animate__fadeIn") &&
            (clone.querySelector(".animate__fadeIn").style.animation = "none");
          clone.querySelector(".allocationBlock").style.overflow = "auto";
          clone.querySelector(".allocationBlock").style.height = "fit-content";
          clone.querySelector(".allocationBlock").style.paddingTop = "20px";
          clone.querySelector(".allocationBlock").style.paddingLeft = "200px";
          clone.querySelector(".allocationBlock").style.paddingRight = "200px";
          clone.querySelector(".allocationBlock").style.paddingBottom = "30px";
          clone.querySelector(".treeTitle").style.overflow = "visible";
          clone.querySelector(".treeTitle").style.height = "fit-content";
          clone.querySelector(".dataBlock").style.overflow = "auto";
          clone.querySelector(".dataBlock").style.height = "fit-content";
          clone.querySelector(".dataBlock").style.padding = "20px";
          clone.querySelector(".dataBlock").style.paddingBottom = "30px";
          clone.querySelector(".orgchart").style.paddingBottom = "15px";
          clone.querySelector(".orgchart").style.minWidth = "2140px";
        },
      });

      // if (i === 1) {
      // pdf.addPage(
      // [
      // elementsToCapture[1]?.clientWidth,
      // elementsToCapture[1]?.clientHeight + 100,
      // ],
      // "l"
      // );
      // }
      //
      // if (i === 2) {
      // pdf.addPage(
      // [
      // canvas.width > elementsToCapture[1]?.clientWidth
      // ? canvas.width
      // : elementsToCapture[1]?.clientWidth,
      // canvas.height > elementsToCapture[1]?.clientHeight
      // ? canvas.height
      // : elementsToCapture[1]?.clientHeight,
      // ],
      // "l"
      // );
      // }
      // if (i > 0) {
      //   pdf.addPage(
      //     [
      //       canvas.width > elementsToCapture[0]?.clientWidth
      //         ? canvas.width
      //         : elementsToCapture[0]?.clientWidth,
      //       canvas.height > elementsToCapture[0]?.clientHeight
      //         ? canvas.height
      //         : elementsToCapture[0]?.clientHeight,
      //     ],
      //     "l"
      //   );
      // }
      if (i > 0) pdf.addPage();
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
        imageHeight * ratio,
        "",
        "FAST"
      );
    }

    // For open direct print
    if (isPrint) {
      pdf.autoPrint();
      window.open(pdf.output("bloburl"), "_blank");
    }

    // Save or display the PDF
    else pdf.save("Organogram With Data.pdf");
    setPDFLoading(false);
  };

  let orgName = langEn
    ? orgData?.organizationNameEn
    : orgData?.organizationNameBn;
  let orgParentName = langEn ? orgData?.parentNameEN : orgData?.parentNameBN;

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
            {orgParentName && (
              <div className="fs-2 text-center fw-bolder mb-0">
                {orgParentName || COMMON_LABELS.NOT_ASSIGN}
              </div>
            )}
            <div className="fs-2 text-center fw-bolder mb-0">
              {orgName || titleName || COMMON_LABELS.NOT_ASSIGN}
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
      <div
        className="pdfGenarator allocationBlock"
        style={{ overflow: "hidden", height: 0, minWidth: "2140px" }}
      >
        <div className="mb-6 text-center">
          {orgParentName && (
            <p className="fs-2 mb-0">{orgParentName || null}</p>
          )}
          <p className="fs-2 mb-0">{orgName || titleName || null}</p>
          <p className="fs-3 mb-0">{versionName}</p>
        </div>
        <AllocationOfBusinessList
          data={updateData?.businessAllocationDtoList || []}
          langEn={langEn}
        />
      </div>
      <div className="position-relative border border-secondary mb-3">
        <OrganizationTemplateTree
          treeData={treeData}
          langEn={langEn}
          onCapturePDF={captureAndConvertToPDF}
          pdfClass="pdfGenarator"
          isPDFLoading={isPDFLoading}
          organogramView={organogramView}
          headerData={{
            titleName: titleName || null,
            versionName: versionName || null,
            orgName: orgName || null,
            orgParentName: orgParentName || null,
          }}
          // templateName={titleName}
          // versionName={versionName}
          // orgName={orgName}
          // orgParentName={orgParentName}
        />
        <div className="position-absolute" style={{ top: 10, right: (organogramView ? 175 : 125) }}>
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
              organogramView={organogramView}
              headerData={{
                titleName: titleName || null,
                versionName: versionName || null,
                orgName: orgName || null,
                orgParentName: orgParentName || null,
              }}
            />
          </ModalBody>
        </Modal>
      </div>
      {/* For pdf generating start */}

      <div
        className="pdfGenarator dataBlock"
        style={{ overflow: "hidden", height: 0, minWidth: "2140px" }}
      >
        <div className="mb-6 text-center">
          {orgParentName && (
            <p className="fs-2 mb-0">{orgParentName || null}</p>
          )}
          <p className="fs-2 mb-0">{orgName || titleName || null}</p>
          <p className="fs-3 mb-0">{versionName}</p>
        </div>
        <div className="d-flex">
          <div className="pe-3" style={{ width: "33.33333%" }}>
            {updateData?.mainActivitiesDtoList?.length > 0 && (
              <ActivitiesList
                data={updateData?.mainActivitiesDtoList || []}
                langEn={langEn}
              />
            )}
            <EquipmentsList
              data={updateData?.miscellaneousPointDtoList || []}
              inventoryData={inventoryData || []}
              langEn={langEn}
            />
            {updateData?.organogramNoteDtoList?.length > 0 && (
              <NotesList
                data={updateData?.organogramNoteDtoList || []}
                langEn={langEn}
              />
            )}
          </div>
          <div className="pe-4" style={{ width: "33.33333%" }}>
            {(orgName || orgParentName || organogramView) && (
              <AttachedOrgList
                data={attachedOrganizationData?.attachedOrganization || []}
                langEn={langEn}
              />
            )}
            <AbbreviationList
              data={updateData?.abbreviationDtoList || []}
              langEn={langEn}
            />
          </div>
          <div className="" style={{ width: "33.33333%" }}>
            <ManPowerList
              isLoading={false}
              data={manpowerData}
              langEn={langEn}
            />
          </div>
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
          {(!orgName || !orgParentName) && !organogramView && (
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
          {(orgName || orgParentName || organogramView) && (
            <div className="mt-3">
              <AttachedOrgList
                data={attachedOrganizationData?.attachedOrganization || []}
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
          <div className="d-flex justify-content-center gap-14 mt-12">
            <ACLWrapper
              visibleToRoles={[ROLES.OMS_TEMPLATE_ENTRY]}
              visibleCustom={updateData?.status === TEMPLATE_STATUS.NEW}
            >
              <Button
                className="rounded-pill px-8 fw-bold"
                color="success"
                onClick={() => openModal("TEMPLATE_ENTRY", "SEND_TO_REVIEW")}
              >
                <span> {BTN_LABELS.SEND} </span>
                <Icon icon="send" size={12} className="fw-bold ms-2" />
              </Button>
            </ACLWrapper>

            <ACLWrapper
              visibleToRoles={[ROLES.OMS_TEMPLATE_REVIEW]}
              visibleCustom={updateData?.status === TEMPLATE_STATUS.IN_REVIEW}
            >
              <Button
                className="rounded-pill fw-bold pe-8"
                color="danger"
                onClick={() => openModal("TEMPLATE_REVIEW", "BACK_TO_NEW")}
              >
                <Icon icon="arrow_back" className="fw-bold me-2" />
                <span> {BTN_LABELS.SEND_BACK} </span>
              </Button>
              <Button
                className="rounded-pill px-10 ps-12 fw-bold"
                color="success"
                onClick={() => openModal("TEMPLATE_REVIEW", "SEND_TO_APPROVE")}
              >
                <span> {BTN_LABELS.SEND} </span>
                <Icon icon="send" size={15} className="fw-bold ms-1" />
              </Button>
            </ACLWrapper>

            <ACLWrapper
              visibleToRoles={[ROLES.OMS_TEMPLATE_APPROVE]}
              visibleCustom={updateData?.status === TEMPLATE_STATUS.IN_APPROVE}
            >
              <Button
                className="rounded-pill fw-bold pe-8"
                color="danger"
                onClick={() => openModal("TEMPLATE_APPROVE", "BACK_TO_REVIEW")}
              >
                <Icon icon="arrow_back" className="fw-bold me-2" />
                <span> {BTN_LABELS.SEND_BACK} </span>
              </Button>
              <Button
                className="rounded-pill px-8 fw-bold"
                color="success"
                isLoading={isApproveLoading}
                onClick={() => openModal("TEMPLATE_APPROVE", "APPROVE")}
              >
                <span> {BTN_LABELS.APPROVE} </span>
                <Icon icon="check" size={15} className="fw-bold ms-1" />
              </Button>
            </ACLWrapper>
          </div>
          <ConfirmationModal
            isOpen={isModalOpen}
            onClose={onModalClose}
            onConfirm={onModalActionConfirm}
            isSubmitting={isSubmitting}
            onConfirmLabel={modalButtonLabel}
            isEng={langEn}
          >
            {modalMsg}
          </ConfirmationModal>
        </>
      )}
    </div>
  );
};

export default TemplateViewComponent;
