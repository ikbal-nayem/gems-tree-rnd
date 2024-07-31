import Switch from "@components/Switch";
import {
  COMMON_LABELS as COMN_LABELS,
  LABELS,
} from "@constants/common.constant";
import { ROUTE_L2 } from "@constants/internal-route.constant";
import { ROLES, TEMPLATE_STATUS } from "@constants/template.constant";
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
import { OMSService } from "@services/api/OMS.service";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrganizationTemplateTree from "./Tree";
import AbbreviationList from "./components/AbbreviationList";
import ActivitiesList from "./components/ActivitesList";
import AllocationOfBusinessList from "./components/AllocationOfBusinessList";
import AttachedOrgList from "./components/AttachedOrgList";
import AttachmentList from "./components/AttachmentList";
import EquipmentsList from "./components/EquipmentsList";
import ManPowerList from "./components/ManPowerList";
import { NoteWithConfirmationModal } from "./components/NoteWithConfirmationModal";
import NotesList from "./components/NotesList";
import NotesReviewApproverList from "./components/NotesReviewApproverList";
import { BUTTON_LABEL, MSG } from "./message";
import { GemsLogoBase64 } from "./utils";

interface ITemplateViewComponent {
  updateData: IObject;
  inventoryData?: IObject[];
  manpowerData?: IObject;
  attachedOrganizationData?: IObject;
  // parentOrganizationData?: IObject;
  isSubmitLoading?: boolean;
  organogramView?: boolean;
  isPreviousVerison?: boolean;
  organogramId?: string;
  isBeginningVersion?: boolean;
  stateOrganizationData?: IObject;
  fromList?: string;
  isFormDraft?: boolean;
}

const TemplateViewComponent = ({
  updateData,
  inventoryData,
  manpowerData,
  attachedOrganizationData,
  // parentOrganizationData,
  organogramView = false,
  organogramId,
  isBeginningVersion = false,
  stateOrganizationData,
  fromList,
  isFormDraft,
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

  const [langEn, setLangEn] = useState<boolean>(updateData?.isEnamCommittee);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [isApproveLoading, setApproveLoading] = useState<boolean>(false);
  const [isPDFLoading, setPDFLoading] = useState<boolean>(false);
  const [isSinglePDFLoading, setSinglePDFLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [modalButtonLabel, setModalButtonLabel] = useState<any>();
  const [modalMsg, setModalMsg] = useState<any>();
  const [modalAction, setModalAction] = useState<any>();
  const msg = langEn ? MSG.EN : MSG.BN;
  const modalBtnLabel = langEn ? BUTTON_LABEL.EN : BUTTON_LABEL.BN;
  const navigate = useNavigate();

  let organogramOrganizationView = stateOrganizationData?.organizationId
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

  const onModalActionConfirm = (note = null) => {
    if (modalAction === "SEND_TO_REVIEW") {
      onStatusChange("IN_REVIEW", ROUTE_L2.OMS_ORGANOGRAM_DRAFT_LIST);
    } else if (modalAction === "BACK_TO_REVIEW") {
      onStatusChange("IN_REVIEW", ROUTE_L2.OMS_ORGANOGRAM_INAPPROVE_LIST, note);
    } else if (modalAction === "BACK_TO_NEW") {
      onStatusChange("NEW", ROUTE_L2.OMS_ORGANOGRAM_INREVIEW_LIST, note);
    } else if (modalAction === "SEND_TO_APPROVE") {
      onStatusChange("IN_APPROVE", ROUTE_L2.OMS_ORGANOGRAM_INREVIEW_LIST);
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

  const onStatusChange = (status: string, destination, note = null) => {
    setIsSubmitting(true);
    OMSService.updateTemplateStatusById(updateData?.id, status, {
      note: note,
      status: updateData?.status,
    })
      .then((res) => {
        toast.success(res?.message);
        navigate(destination);
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setIsSubmitting(false));
  };

  const onTemplateApprove = () => {
    setApproveLoading(true);
    OMSService.approveTemplateById(updateData?.id)
      .then((res) => {
        toast.success(res?.message);
        navigate(ROUTE_L2.OMS_ORGANOGRAM_INAPPROVE_LIST);
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setApproveLoading(false));
  };

  const downloadImage = (blob, fileName) => {
    const fakeLink: any = window.document.createElement("a");
    fakeLink.style = "display:none;";
    fakeLink.download = fileName;

    fakeLink.href = blob;

    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);

    fakeLink.remove();
  };

  const captureAndConvertToPDF = async (downloadType) => {
    setPDFLoading(true);
    // Get references to the HTML elements you want to capture
    const elementsToCapture = document.getElementsByClassName("pdfGenarator");
    // Create a new instance of jsPDF
    const pdf: any = new jsPDF("l", "px", "letter");

    // Loop through the elements and capture each one
    for (let i = 0; i < elementsToCapture.length; i++) {
      const element: any = elementsToCapture[i];

      // Use html2canvas to capture the element
      const canvas = await html2canvas(element, {
        scale: 3,
        onclone: (clone: any) => {
          clone.querySelector(".animate__fadeIn") &&
            (clone.querySelector(".animate__fadeIn").style.animation = "none");
          clone.querySelector(".allocationBlock").style.overflow = "auto";
          clone.querySelector(".allocationBlock").style.height = "fit-content";
          clone.querySelector(".treeBlock").style.height = "fit-content";
          // clone.querySelector(".treeBlock .orgchart").style.minWidth = "2140px";
          clone.querySelector(".allocationBlock").style.paddingTop = "20px";
          clone.querySelector(".allocationBlock").style.paddingLeft = "200px";
          clone.querySelector(".allocationBlock").style.paddingRight = "200px";
          clone.querySelector(".allocationBlock").style.paddingBottom = "30px";
          clone.querySelector(".treeTitle").style.overflow = "visible";
          clone.querySelector(".treeTitle").style.height = "fit-content";
          // clone.querySelector(".orgchart").style.transform = "";
          clone.querySelector(".orgchart").style.paddingBottom = "15px";
          // clone.querySelector(".orgchart").style.minWidth = "100%";
          clone.querySelector(".dataBlock").style.overflow = "auto";
          clone.querySelector(".dataBlock").style.height = "fit-content";
          clone.querySelector(".dataBlock").style.padding = "20px";
          clone.querySelector(".dataBlock").style.paddingBottom = "30px";
        },
      });

      if (i > 0) pdf.addPage();

      // Convert the canvas to an image and add it to the PDF
      const imageData = canvas.toDataURL("image/png");
      if (i === 1 && downloadType === "image-download") {
        downloadImage(imageData, "Organogram With Data");
        break;
      }
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight() - 15;

      const imageWidth = canvas.width;
      const imageHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imageWidth, pdfHeight / imageHeight);

      pdf.addImage(
        imageData,
        "PNG",
        0,
        8,
        imageWidth * ratio,
        imageHeight * ratio,
        "",
        "FAST"
      );
    }
    const pageCount = pdf.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      if (GemsLogoBase64) {
        pdf.addImage(
          GemsLogoBase64,
          "png",
          pdf.internal.pageSize.getWidth() / 2 - 40,
          pdf.internal.pageSize.getHeight() - 11,
          10,
          10
        );
      }
      pdf.setFontSize(8);
      pdf.text(
        `Digitally generated by GEMS`,
        pdf.internal.pageSize.getWidth() / 2 - 30,
        pdf.internal.pageSize.getHeight() - 4
      );
    }
    // For open direct print
    if (downloadType === "print") {
      pdf.autoPrint();
      window.open(pdf.output("bloburl"), "_blank");
    }

    // Save or display the PDF
    if (downloadType === "pdf") {
      pdf.save("Organogram With Data.pdf");
    }
    setPDFLoading(false);
  };

  let orgName = langEn
    ? stateOrganizationData?.organizationNameEn
    : stateOrganizationData?.organizationNameBn;

  // let orgParentName = langEn
  //   ? stateOrganizationData?.parentNameEN || parentOrganizationData?.nameEn
  //   : stateOrganizationData?.parentNameBN || parentOrganizationData?.nameBn;
  let orgStateParentName = langEn
    ? stateOrganizationData?.parentNameEN
    : stateOrganizationData?.parentNameBN;
  let orgParentName = langEn
    ? updateData?.parentOrgNameEn
    : updateData?.parentOrgNameBn;

  let titleName =
    (organogramView
      ? langEn
        ? updateData?.organization?.nameEn
        : updateData?.organization?.nameBn
      : langEn
      ? updateData?.titleEn
      : updateData?.titleBn) || "";

  let versionName = updateData?.isEnamCommittee
    ? `Enam Committee Report (${
        updateData?.organogramDate
          ? generateDateFormat(
              updateData?.organogramDate,
              DATE_PATTERN.GOVT_STANDARD,
              "en"
            )
          : ""
      })`
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

  const captureSinglePageToPDF = async (className: string, pdfName: string) => {
    setSinglePDFLoading(true);
    // Get references to the HTML elements you want to capture
    const elementsToCapture = document.getElementsByClassName(className);
    // Create a new instance of jsPDF
    const pdf: any = new jsPDF("p", "px", "letter");

    console.log("element", elementsToCapture);

    // Loop through the elements and capture each one
    for (let i = 0; i < elementsToCapture.length; i++) {
      const element: any = elementsToCapture[i];

      // Use html2canvas to capture the element

      const canvas = await html2canvas(element, {
        scale: 3,
        onclone: (clone: any) => {
          if (className === "summary-manpower-pdfGenerator") {
            clone.querySelector(".animate__animated") &&
              (clone.querySelector(".animate__animated").style.animation =
                "unset");
            clone.querySelector(".animate__fadeIn") &&
              (clone.querySelector(".animate__fadeIn").style.animation =
                "unset");
            clone.querySelector(
              ".summary-manpower-pdfGenerator"
            ).style.overflow = "auto";
            clone.querySelector(".summary-manpower-pdfGenerator").style.height =
              "fit-content";
            clone.querySelector(
              ".summary-manpower-pdfGenerator"
            ).style.padding = "20px";
            clone.querySelector(
              ".summary-manpower-pdfGenerator"
            ).style.paddingBottom = "30px";
          }
        },
      });

      // Convert the canvas to an image and add it to the PDF

      const imageData = canvas.toDataURL("image/png");
      // if (i === 1 && downloadType === "image-download") {
      //   downloadImage(imageData, "Organogram With Data");
      //   break;
      // }
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight() - 15;

      const imageWidth = canvas.width;
      const imageHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imageWidth, pdfHeight / imageHeight);

      pdf.addImage(
        imageData,
        "PNG",
        0,
        8,
        imageWidth * ratio,
        imageHeight * ratio,
        "",
        "FAST"
      );
    }
    const pageCount = pdf.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      if (GemsLogoBase64) {
        pdf.addImage(
          GemsLogoBase64,
          "png",
          pdf.internal.pageSize.getWidth() / 2 - 40,
          pdf.internal.pageSize.getHeight() - 11,
          10,
          10
        );
      }
      pdf.setFontSize(8);
      pdf.text(
        `Digitally generated by GEMS`,
        pdf.internal.pageSize.getWidth() / 2 - 30,
        pdf.internal.pageSize.getHeight() - 4
      );
    }

    // Save or display the PDF
    pdf.save(pdfName + ".pdf");
    setSinglePDFLoading(false);
  };

  return (
    <div>
      {isFormDraft && (
        <div
          className="position-fixed z-index-1"
          style={{ right: "20px", top: "73px" }}
        >
          <Button
            color="primary"
            onClick={() => {
              navigate(ROUTE_L2.ORG_TEMPLATE_UPDATE + "?id=" + updateData?.id, {
                state: {
                  organizationId: updateData?.organization?.id || null,
                  draftListRecord: true,
                },
              });
            }}
          >
            সম্পাদনা করুন
          </Button>
        </div>
      )}
      <div className="card border p-3 mb-4">
        <div className="d-flex flex-wrap flex-xl-nowrap">
          <div className="w-100">
            {stateOrganizationData?.templateView ? (
              <div className="fs-2 text-center fw-bolder mb-0">
                <span className="me-1">{LABEL.TEMPLATE_NAME}: </span>
                {titleName || COMMON_LABELS.NOT_ASSIGN}
              </div>
            ) : (
              <div className="fs-2 text-center fw-bolder mb-0">
                {orgName || titleName || COMMON_LABELS.NOT_ASSIGN}
              </div>
            )}

            {stateOrganizationData?.templateView &&
              !isObjectNull(updateData?.organizationGroupDto) && (
                <div className="fs-2 text-center fw-bolder mb-0">
                  <span className="me-1">{LABEL.TEMPLATE_TYPE}: </span>
                  {updateData?.isEnamCommittee || langEn
                    ? updateData?.organizationGroupDto?.nameEn
                    : updateData?.organizationGroupDto?.nameBn}
                </div>
              )}
            {orgParentName && (
              <div className="fs-2 text-center fw-bolder mb-0">
                {orgParentName || COMMON_LABELS.NOT_ASSIGN}
              </div>
            )}
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
          {updateData?.organizationHeader && (
            <p className="fs-2 mb-0">
              {updateData?.organizationHeader || null}
            </p>
          )}
          {updateData?.organizationHeaderMsc && (
            <p className="fs-2 mb-0">
              {updateData?.organizationHeaderMsc || null}
            </p>
          )}
          <p className="fs-2 mb-0">{orgName || titleName || null}</p>
          {(orgParentName || orgStateParentName) && (
            <p className="fs-2 mb-0">
              {orgParentName || orgStateParentName || null}
            </p>
          )}
          <p className="fs-3 mb-0">{versionName}</p>
        </div>
        {updateData?.businessAllocationDtoList?.length > 0 ? (
          <AllocationOfBusinessList
            data={updateData?.businessAllocationDtoList || []}
            langEn={langEn}
          />
        ) : (
          <ActivitiesList
            data={updateData?.mainActivitiesDtoList || []}
            langEn={langEn}
          />
        )}
      </div>
      <div
        className="treeBlock"
        style={{ overflow: "hidden", height: 0, minWidth: "2140px" }}
      >
        <div className="mb-6 text-center">
          {updateData?.organizationHeader && (
            <p className="fs-2 mb-0">
              {updateData?.organizationHeader || null}
            </p>
          )}
          {updateData?.organizationHeaderMsc && (
            <p className="fs-2 mb-0">
              {updateData?.organizationHeaderMsc || null}
            </p>
          )}
          <p className="fs-2 mb-0">{orgName || titleName || null}</p>
          {(orgParentName || orgStateParentName) && (
            <p className="fs-2 mb-0">
              {orgParentName || orgStateParentName || null}
            </p>
          )}
          <p className="fs-3 mb-0">{versionName}</p>
        </div>
        <OrganizationTemplateTree
          treeData={treeData}
          langEn={langEn}
          onCapturePDF={captureAndConvertToPDF}
          pdfClass="pdfGenarator"
          isPDFLoading={isPDFLoading}
          organogramView={organogramOrganizationView}
          headerData={{
            titleName: titleName || null,
            versionName: versionName || null,
            orgName: orgName || null,
            orgParentName: orgParentName || orgStateParentName || null,
            organizationHeader: updateData?.organizationHeader || null,
            organizationHeaderMsc: updateData?.organizationHeaderMsc || null,
          }}
        />
      </div>
      <div className="position-relative border border-secondary mb-3">
        <OrganizationTemplateTree
          treeData={treeData}
          langEn={langEn}
          onCapturePDF={captureAndConvertToPDF}
          pdfClass=""
          isPDFLoading={isPDFLoading}
          organogramView={organogramOrganizationView}
          headerData={{
            titleName: titleName || null,
            versionName: versionName || null,
            orgName: orgName || null,
            orgParentName: orgParentName || orgStateParentName || null,
            organizationHeader: updateData?.organizationHeader || null,
            organizationHeaderMsc: updateData?.organizationHeaderMsc || null,
          }}
        />
        <div
          className="position-absolute"
          style={{ top: 10, right: organogramOrganizationView ? 225 : 125 }}
        >
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
          title={`${orgName || titleName} ${
            versionName ? "( " + versionName + " )" : ""
          }`}
        >
          <ModalBody className="p-0">
            <OrganizationTemplateTree
              treeData={treeData}
              langEn={langEn}
              onCapturePDF={captureAndConvertToPDF}
              pdfClass=""
              isPDFLoading={isPDFLoading}
              organogramView={organogramOrganizationView}
              headerData={{
                titleName: titleName || null,
                versionName: versionName || null,
                orgName: orgName || null,
                orgParentName: orgParentName || orgStateParentName || null,
                organizationHeader: updateData?.organizationHeader || null,
                organizationHeaderMsc:
                  updateData?.organizationHeaderMsc || null,
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
          {updateData?.organizationHeader && (
            <p className="fs-2 mb-0">
              {updateData?.organizationHeader || null}
            </p>
          )}
          {updateData?.organizationHeaderMsc && (
            <p className="fs-2 mb-0">
              {updateData?.organizationHeaderMsc || null}
            </p>
          )}
          {(orgParentName || orgStateParentName) && (
            <p className="fs-2 mb-0">
              {orgParentName || orgStateParentName || null}
            </p>
          )}
          <p className="fs-2 mb-0">{orgName || titleName || null}</p>
          <p className="fs-3 mb-0">{versionName}</p>
        </div>
        <div className="d-flex">
          <div className="pe-3" style={{ width: "33.33333%" }}>
            {updateData?.businessAllocationDtoList?.length > 0 &&
              updateData?.mainActivitiesDtoList?.length > 0 && (
                <ActivitiesList
                  data={updateData?.mainActivitiesDtoList || []}
                  langEn={langEn}
                />
              )}
            <EquipmentsList
              data={updateData?.miscellaneousPointDtoList || []}
              othersData={{
                isInventoryOthers: updateData?.isInventoryOthers,
                inventoryOthersObject: updateData?.inventoryOthersObject || "",
              }}
              inventoryData={inventoryData || []}
              langEn={langEn}
            />
            {!isObjectNull(updateData?.organogramNoteDto) && (
              <NotesList
                data={updateData?.organogramNoteDto || {}}
                langEn={langEn}
              />
            )}
          </div>
          <div className="pe-4" style={{ width: "33.33333%" }}>
            {/* {(orgName ||
              orgParentName ||
              orgStateParentName ||
              organogramView) && ( */}
            <AttachedOrgList
              data={attachedOrganizationData?.attachedOrganization || []}
              langEn={langEn}
            />
            {/* )} */}
            <AbbreviationList
              data={updateData?.abbreviationDtoList || []}
              langEn={langEn}
            />
          </div>
          <div className="" style={{ width: "33.33333%" }}>
            <ManPowerList
              isLoading={false}
              isSummaryOfManPowerObject={updateData?.isSummaryOfManPowerObject}
              summaryOfManPowerObject={updateData?.summaryOfManPowerObject}
              data={manpowerData}
              langEn={langEn}
              isDownloadVisible={false}
            />
          </div>
        </div>
      </div>

      {/* Pdf generating end */}

      {/* Manpower pdf generator Start*/}
      <div
        className="summary-manpower-pdfGenerator"
        style={{ overflow: "hidden", height: 0 }}
        id="divToPrint"
      >
        <div className="mb-6 text-center">
          <p className="fs-2 mb-0">{orgName || titleName || null}</p>
          <p className="fs-3 mb-0">{versionName}</p>
        </div>
        <ManPowerList
          isLoading={false}
          isSummaryOfManPowerObject={updateData?.isSummaryOfManPowerObject}
          summaryOfManPowerObject={updateData?.summaryOfManPowerObject}
          data={manpowerData}
          langEn={langEn}
          isDownloadVisible={false}
        />
      </div>
      {/* Manpower pdf generator Stop */}

      <div className="row">
        <div className="col-md-6">
          <ActivitiesList
            data={updateData?.mainActivitiesDtoList || []}
            langEn={langEn}
          />

          <div className="mt-3">
            <EquipmentsList
              data={updateData?.miscellaneousPointDtoList || []}
              othersData={{
                isInventoryOthers: updateData?.isInventoryOthers,
                inventoryOthersObject: updateData?.inventoryOthersObject || "",
              }}
              inventoryData={inventoryData || []}
              langEn={langEn}
              isBeginningVersion={isBeginningVersion}
              organogramId={organogramId}
              insideModal={false}
            />
          </div>
          {/* {(!orgName || !orgParentName) && !organogramView && ( */}
          {/* {!organogramView && (
            <div className="mt-3">
              <OrgList
                data={updateData?.templateOrganizationsDtoList || []}
                langEn={langEn}
              />
              <CheckListList data={updateData?.attachmentDtoList || []} />
            </div>
          )} */}
          <div className="mt-3">
            <AttachmentList
              data={updateData?.attachmentDtoList || []}
              langEn={langEn}
            />
          </div>
          {!isObjectNull(updateData?.organogramNoteDto) && (
            <div className="mt-3">
              <NotesList
                data={updateData?.organogramNoteDto || {}}
                langEn={langEn}
              />
            </div>
          )}
          {/* {!organogramView && !stateOrganizationData?.organizationId && ( */}
          {!organogramView && (
            <div className="mt-3">
              <NotesReviewApproverList
                data={updateData?.organogramNoteGroupDtoList || []}
                langEn={langEn}
              />
            </div>
          )}
          {/* {(orgName ||
            orgParentName ||
            orgStateParentName ||
            organogramView) && ( */}
          {/* {organogramView && ( */}
          <div className="mt-3">
            <AttachedOrgList
              data={attachedOrganizationData?.attachedOrganization || []}
              langEn={langEn}
            />
          </div>
          {/* )} */}
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
              isSummaryOfManPowerObject={updateData?.isSummaryOfManPowerObject}
              summaryOfManPowerObject={updateData?.summaryOfManPowerObject}
              isBeginningVersion={isBeginningVersion}
              organogramId={organogramId}
              onDownloadPDF={captureSinglePageToPDF}
              insideModal={false}
              isSinglePDFLoading={isSinglePDFLoading}
              isDownloadVisible={true}
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

      {!organogramView && !stateOrganizationData?.templateView && (
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
              visibleCustom={
                updateData?.status === TEMPLATE_STATUS.IN_REVIEW &&
                fromList === "inreview"
              }
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
              visibleCustom={
                updateData?.status === TEMPLATE_STATUS.IN_APPROVE &&
                fromList === "inapprove"
              }
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
          <NoteWithConfirmationModal
            isOpen={isModalOpen}
            onClose={onModalClose}
            onConfirm={onModalActionConfirm}
            isSubmitting={isSubmitting}
            onConfirmLabel={modalButtonLabel}
            modalAction={modalAction}
            isEng={langEn}
          >
            {modalMsg}
          </NoteWithConfirmationModal>
        </>
      )}
    </div>
  );
};

export default TemplateViewComponent;
