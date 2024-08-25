import { COMMON_LABELS, LABELS } from "@constants/common.constant";
import { organogramDeafultStyles } from "@constants/pdf-generator.constant";
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
import { useEffect } from "react";
import { commonPDFFooter, isNotEmptyList } from "utility/utils";
import { equipmentPDFContent } from "./pdf/EquipmentsPDF";

interface IEquipmentsList {
  data: IObject[];
  inventoryData: IObject[];
  othersData?: IObject;
  langEn: boolean;
  isTabContent?: boolean;
  title?: string;
  setEquipmentContent?: (content) => void;
  isDownloadVisible?: boolean;
  orgName?: string;
  versionDate?: string;
}

const EquipmentsList = ({
  data,
  inventoryData,
  othersData,
  langEn,
  isTabContent,
  title,
  setEquipmentContent,
  isDownloadVisible,
  orgName,
  versionDate,
}: IEquipmentsList) => {
  const LABEL = langEn ? LABELS.EN : LABELS.BN;

  useEffect(() => {
    if (setEquipmentContent) setEquipmentContent(handleTOEPdfDownload());
  }, [setEquipmentContent, langEn]);

  const handleTOEPdfDownload = (singlePDF = false) => {
    let pdfHeader = [
      {
        text: orgName,
        style: "header",
      },
      {
        text: versionDate,
        style: "subHeader",
      },
    ];
    let content = [
      {
        text: LABEL.EQUIPMENTS,
        style: "title",
      },
    ];

    if (othersData?.isInventoryOthers) {
      content = content.concat(
        ckToPdfMake(othersData?.inventoryOthersObject) || []
      );
    } else {
      content = content.concat(
        equipmentPDFContent(
          {
            inventoryData: inventoryData,
            miscelleanousData: data,
          },
          langEn
        )?.content || []
      );
    }
    if (singlePDF) {
      generatePDF(
        {
          content: pdfHeader.concat(content),
          styles: organogramDeafultStyles,
          footer: (currentPage, pageCount) =>
            commonPDFFooter(currentPage, pageCount, langEn),
        },
        {
          action: "open",
          fileName: `Inventory Report ${generateDateFormat(
            makeBDLocalTime(new Date()),
            DATE_PATTERN.GOVT_STANDARD,
            "en"
          )}`,
        }
      );
    } else return content;
  };
  return (
    <div className="card border p-3">
      <div className="d-flex justify-content-between align-items-center">
        <h4 className={title ? "m-0 text-primary" : "m-0"}>
          {isTabContent && title ? title : LABEL.EQUIPMENTS}
        </h4>
        <div className="d-flex gap-1">
          {isDownloadVisible && (
            <Button
              color="primary"
              className="rounded-circle px-3 py-3"
              size="sm"
              variant="active-light"
              onClick={() => {
                handleTOEPdfDownload(true);
              }}
            >
              <Icon icon="download" color="primary" size={20} />
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
                <>
                  {item?.itemList?.length > 0 && (
                    <div className="col-md-6 col-12" key={i}>
                      <span className="fs-5 fw-bold">
                        {langEn ? i + 1 : numEnToBn(i + 1) + ". "}
                      </span>
                      <u className="fs-5 fw-bold mb-0">
                        {langEn ? item?.inventoryTypeEn : item?.inventoryTypeBn}
                      </u>
                      <ol type="a">
                        {item?.itemList.map((d, idx) => {
                          return (
                            <li key={idx}>
                              <span
                                className={
                                  isTabContent
                                    ? d?.isModified
                                      ? "text-underline-color-yellow"
                                      : d?.isAddition
                                      ? "text-underline-color-black"
                                      : d?.isDeleted
                                      ? "text-line-through-color-red"
                                      : ""
                                    : ""
                                }
                              >
                                {langEn ? d?.quantity : numEnToBn(d?.quantity)}{" "}
                                x {langEn ? d?.itemTitleEn : d?.itemTitleBn}{" "}
                              </span>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  )}
                </>
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
                  <span
                    className={
                      isTabContent
                        ? item?.isModified
                          ? "text-underline-color-purple"
                          : item?.isAddition
                          ? "text-decoration-underline"
                          : item?.isDeleted
                          ? "text-line-through-color-red"
                          : ""
                        : ""
                    }
                  >
                    {langEn
                      ? item?.titleEn || COMMON_LABELS.NOT_ASSIGN
                      : item?.titleBn || COMMON_LABELS.NOT_ASSIGN}
                  </span>
                </li>
              );
            })}
        </ol>
      </div>
    </div>
  );
};

export default EquipmentsList;
