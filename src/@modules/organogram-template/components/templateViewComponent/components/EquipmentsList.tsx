import { COMMON_LABELS, LABELS } from "@constants/common.constant";
import { Button, Icon, Separator, TextEditorPreview } from "@gems/components";
import {
  ckToPdfMake,
  DATE_PATTERN,
  generateDateFormat,
  generatePDF,
  IObject,
  makeBDLocalTime,
  numEnToBn,
} from "@gems/utils";
import { useState } from "react";
import { commonPDFFooter, isNotEmptyList } from "utility/utils";
import EquipmentsListChanges from "./EquipmentsListChanges";
import { equipmentPDFContent } from "./pdf/EquipmentsPDF";

interface IEquipmentsForm {
  data: IObject[];
  inventoryData: IObject[];
  othersData?: IObject;
  langEn: boolean;
  isBeginningVersion?: boolean;
  organogramId?: string;
  insideModal?: boolean;
  title?: string;
  onDownloadPDF?: (className: string, pdfName: string) => void;
  isEquipmentsPDFLoading?: boolean;
  isDownloadVisible?: boolean;
  orgName?: string;
  versionDate?: string;
}

const EquipmentsForm = ({
  data,
  inventoryData,
  othersData,
  langEn,
  isBeginningVersion,
  organogramId,
  insideModal,
  title,
  onDownloadPDF,
  isEquipmentsPDFLoading,
  isDownloadVisible,
  orgName,
  versionDate,
}: IEquipmentsForm) => {
  const LABEL = langEn ? LABELS.EN : LABELS.BN;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onClose = () => setIsOpen(false);

  const onMenualDownload = () => {
    const docs = ckToPdfMake(othersData?.inventoryOthersObject);

    let style = {
      header: {
        fontSize: 14,
        bold: true,
        alignment: "center",
      },
      subHeader: {
        fontSize: 13,
        bold: true,
        alignment: "center",
        marginBottom: 10,
      },
      title: {
        fontSize: 13,
        bold: true,
        alignment: "left",
        marginBottom: 5,
        decoration: "underline",
      },
    };

    let pdfHeader = [
      {
        text: orgName,
        style: "header",
      },
      {
        text: versionDate,
        style: "subHeader",
      },
      {
        text: LABEL.EQUIPMENTS,
        style: "title",
      },
    ];

    generatePDF(
      {
        content: pdfHeader.concat(docs),
        styles: style,
        footer: (currentPage, pageCount) =>
          commonPDFFooter(currentPage, pageCount, langEn),
      },
      {
        action: "download",
        fileName: `Inventory Report ${generateDateFormat(
          makeBDLocalTime(new Date()),
          DATE_PATTERN.GOVT_STANDARD,
          "en"
        )}`,
      }
    );
  };

  return (
    <>
      <div className="card border p-3">
        <div className="d-flex justify-content-between">
          <h4 className={title ? "m-0 text-info" : "m-0"}>
            {title ? title : LABEL.EQUIPMENTS}
          </h4>
          <div className="d-flex gap-1">
            {!othersData?.isInventoryOthers &&
              organogramId &&
              !isBeginningVersion &&
              !insideModal && (
                <Icon
                  icon="swap_horiz"
                  variants="outlined"
                  hoverTitle={LABEL.CHANGES}
                  size={25}
                  className="text-primary text-hover-warning mt-2"
                  onClick={() => setIsOpen(true)}
                />
              )}
            {isDownloadVisible && (
              <Button
                color="primary"
                className="rounded-circle px-3 py-3"
                isDisabled={isEquipmentsPDFLoading}
                size="sm"
                variant="active-light"
                onClick={() => {
                  // onDownloadPDF("equipments-pdfGenerator", "TO&E Data")

                  if (othersData?.isInventoryOthers) {
                    onMenualDownload();
                  } else {
                    generatePDF(
                      equipmentPDFContent(
                        {
                          inventoryData: inventoryData,
                          miscelleanousData: data,
                        },
                        orgName,
                        versionDate,
                        langEn
                      ),
                      {
                        action: "download",
                        fileName: `Inventory Report ${generateDateFormat(
                          makeBDLocalTime(new Date()),
                          DATE_PATTERN.GOVT_STANDARD,
                          "en"
                        )}`,
                      }
                    );
                  }
                }}
              >
                {isEquipmentsPDFLoading ? (
                  <span
                    className={`spinner-border spinner-border-md align-middle`}
                  ></span>
                ) : (
                  <Icon icon="download" color="primary" size={20} />
                )}
              </Button>
            )}
          </div>
        </div>
        <Separator className="mt-1 mb-1" />
        {othersData?.isInventoryOthers ? (
          <TextEditorPreview html={othersData?.inventoryOthersObject || ""} />
        ) : (
          <div className="row">
            {isNotEmptyList(inventoryData) &&
              inventoryData?.map((item, i) => {
                return (
                  <div className="col-md-6 col-12" key={i}>
                    <span className="fs-5 fw-bold">
                      {langEn ? i + 1 + ". " : numEnToBn(i + 1 + ". ")}
                    </span>
                    <u className="fs-5 fw-bold mb-0">
                      {langEn ? item?.inventoryTypeEn : item?.inventoryTypeBn}
                    </u>
                    <ol type="a">
                      {item?.itemList.map((d, idx) => {
                        return (
                          <li key={idx}>
                            {langEn ? d?.quantity : numEnToBn(d?.quantity)} x{" "}
                            {langEn ? d?.itemTitleEn : d?.itemTitleBn}{" "}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                );
              })}
          </div>
        )}

        {data?.length > 0 && (
          <>
            <div className="card-head d-flex justify-content-start align-items-center gap-2">
              <span className="fs-5 fw-bold">
                {langEn
                  ? inventoryData?.length + 1 + ". "
                  : numEnToBn(inventoryData?.length + 1 + ". ")}
              </span>
              <u className="fs-5 fw-bold m-0">{LABEL.MISCELLANEOUS}</u>
            </div>
            <Separator className="mt-1 mb-2" />
          </>
        )}

        <div>
          <ol type="a" className={langEn ? "mb-0" : "bn_ol mb-0"}>
            {data?.length > 0 &&
              data?.map((item, i) => {
                return (
                  <li key={i}>
                    {langEn
                      ? item?.titleEn || COMMON_LABELS.NOT_ASSIGN
                      : item?.titleBn || COMMON_LABELS.NOT_ASSIGN}
                  </li>
                );
              })}
          </ol>
        </div>
      </div>
      <EquipmentsListChanges
        langEn={langEn}
        isOpen={isOpen}
        onClose={onClose}
        currentEquipmentsData={{
          data: data || [],
          inventoryData: inventoryData || [],
        }}
        organogramId={organogramId}
      />
    </>
  );
};

export default EquipmentsForm;
