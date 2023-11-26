import {
  ACLWrapper,
  Button,
  Icon,
  IconButton,
  Label,
  Modal,
  ModalBody,
  Switch,
  toast,
} from "@gems/components";
import {
  COMMON_LABELS,
  IObject,
  generateUUID,
  isObjectNull,
} from "@gems/utils";
import OrganizationTemplateTree from "./Tree";
// import { orgData } from "./Tree/data2";
import {
  COMMON_LABELS as COMN_LABELS,
  LABELS,
} from "@constants/common.constant";
import { useEffect, useRef, useState } from "react";
import AbbreviationList from "./components/AbbreviationList";
import ActivitiesList from "./components/ActivitesList";
import AllocationOfBusinessList from "./components/AllocationOfBusinessList";
import EquipmentsList from "./components/EquipmentsList";
import ManPowerList from "./components/ManPowerList";
import OrgList from "./components/Organization";

import { ROUTE_L2 } from "@constants/internal-route.constant";
import { ROLES, TEMPLATE_STATUS } from "@constants/template.constant";
import { OMSService } from "@services/api/OMS.service";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import AttachmentList from "./components/AttachmentList";

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

  const [langEn, setLangEn] = useState<boolean>(false);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [isApproveLoading, setApproveLoading] = useState<boolean>(false);

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

  useEffect(() => {
    setTimeout(() => {
      downloadPDF();
    }, 1000);
  }, []);

  const test = useRef<any>();
  const pdfRef = useRef();

  const downloadPDF = () => {
    const input :any= pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("img/png");
      const pdf = new jsPDF("l", "px", [input.clientWidth,input.clientHeight]);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imageWidth = canvas.width;
      const imageHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imageWidth, pdfHeight / imageHeight);
      const imageX = (pdfWidth - imageWidth * ratio) / 2;
      const imageY = 30;
      pdf.addImage(
        imgData,
        "PNG",
        imageX,
        imageY,
        imageWidth * ratio,
        imageHeight * ratio
      );
      test.current = pdf;
    });
  };

  return (
    <div>
      <div className="card border p-3 mb-4">
        <div className="d-flex flex-wrap flex-xl-nowrap">
          <div className="w-100">
            <div className="fs-3 text-center fw-bolder mb-0">
              {(organogramView
                ? langEn
                  ? updateData?.organization?.nameEn
                  : updateData?.organization?.nameBn
                : langEn
                ? updateData?.titleEn
                : updateData?.titleBn) || COMMON_LABELS.NOT_ASSIGN}
            </div>
            <div className="text-center fw-bolder mb-0">
              <Label className="mb-0 text-info">
                <span className="mb-0 fw-bold">{LABEL.VERSION}: </span>
                {(langEn ? updateData?.versionEn : updateData?.versionBn) ||
                  COMMON_LABELS.NOT_ASSIGN}
              </Label>
            </div>
          </div>

          <div className="d-flex ms-auto">
            <Switch
              label={langEn ? "বাংলা" : "English"}
              onChange={switchLang}
              className="gap-1 fw-bold text-gray-800 cursor-pointer"
              noMargin
            />
          </div>
        </div>
      </div>
      <div className="position-relative border border-secondary mb-3">
        <OrganizationTemplateTree
          treeData={treeData}
          langEn={langEn}
          test={test}
        />
        <div className="position-absolute" style={{ top: 10, right: 125 }}>
          <IconButton
            iconName="fullscreen"
            color="info"
            variant="fill"
            onClick={() => setFormOpen(true)}
          />
        </div>
        <Modal isOpen={formOpen} handleClose={onFormClose} fullscreen title="">
          <ModalBody className="p-0">
            <OrganizationTemplateTree
              treeData={treeData}
              langEn={langEn}
              test={test}
            />
          </ModalBody>
        </Modal>
      </div>
      <div className="row" ref={pdfRef}>
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
