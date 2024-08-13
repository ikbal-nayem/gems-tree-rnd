import { LABELS } from "@constants/common.constant";
import {
  TDocumentDefinitions,
  isListNull,
  isObjectNull,
  makeBDLocalTime,
  numEnToBn,
} from "@gems/utils";
import { commonPDFFooter } from "utility/utils";

export const equipmentPDFContent = (
  data,
  orgName,
  versionDate,
  langEn: boolean
): TDocumentDefinitions => {
  const today = makeBDLocalTime(new Date());
  const LABEL = langEn ? LABELS.EN : LABELS.BN;

  let inventoryList = [];

  if (!isObjectNull(data) && !isListNull(data?.inventoryData?.length)) {
    for (let j = 0; j < data?.inventoryData?.length; j = j + 2) {
      if (j % 2 == 0) {
        inventoryList.push({
          margin: [0, 0, 0, 10],
          columns: [
            [
              {
                text: `${langEn ? j + 1 + ". " : numEnToBn(j + 1 + ". ")}${
                  langEn
                    ? data?.inventoryData[j]?.inventoryTypeEn
                    : data?.inventoryData[j]?.inventoryTypeBn
                }`,
                style: "olTitle",
              },
              {
                margin: [6, 0, 0, 0],
                type: "lower-alpha",
                ol:
                  data?.inventoryData[j]?.itemList?.length > 0 &&
                  data?.inventoryData[j]?.itemList?.map((im) => {
                    return [
                      `${langEn ? im?.quantity : numEnToBn(im?.quantity)} x ${
                        langEn ? im?.itemTitleEn : im?.itemTitleBn
                      }`,
                    ];
                  }),
              },
            ],
            !isObjectNull(data?.inventoryData[j + 1])
              ? [
                  {
                    text: `${langEn ? j + 2 + ". " : numEnToBn(j + 2 + ". ")}${
                      langEn
                        ? data?.inventoryData[j + 1]?.inventoryTypeEn
                        : data?.inventoryData[j + 1]?.inventoryTypeBn
                    }`,
                    style: "olTitle",
                  },
                  {
                    margin: [6, 0, 0, 0],
                    type: "lower-alpha",
                    ol:
                      data?.inventoryData[j + 1]?.itemList?.length > 0 &&
                      data?.inventoryData[j + 1]?.itemList?.map((im) => {
                        return [
                          `${
                            langEn ? im?.quantity : numEnToBn(im?.quantity)
                          } x ${langEn ? im?.itemTitleEn : im?.itemTitleBn}`,
                        ];
                      }),
                  },
                ]
              : null,
          ],
        });
      }
    }
  }

  return {
    content: [
      { text: orgName, style: "header" },
      { text: versionDate, style: "subHeader" },
      { text: LABEL.EQUIPMENTS, style: "title" },
      ...inventoryList,
      !isListNull(data?.miscelleanousData)
        ? {
            text: `${
              langEn
                ? data?.inventoryData?.length + 1 + ". "
                : numEnToBn(data?.inventoryData?.length + 1 + ". ")
            }${LABEL.MISCELLANEOUS}`,
            style: "olTitle",
          }
        : null,
      !isListNull(data?.miscelleanousData)
        ? data?.miscelleanousData?.map((mis, index) => {
            return {
              text: `${
                langEn ? index + 1 + ". " : numEnToBn(index + 1 + ". ")
              }${langEn ? mis?.titleEn : mis?.titleBn}`,
              margin: [6, 0, 0, 0],
            };
          })
        : null,
    ],
    footer: (currentPage, pageCount) =>
      commonPDFFooter(currentPage, pageCount, langEn),
    styles: {
      header: {
        fontSize: 14,
        bold: true,
        alignment: "center",
      },
      subHeader: {
        fontSize: 10,
        bold: true,
        alignment: "center",
        marginBottom: 10,
      },
      title: {
        fontSize: 12,
        bold: true,
        alignment: "left",
        marginBottom: 8,
        decoration: "underline",
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: "black",
        alignment: "center",
      },
      textBold: {
        bold: true,
        fontSize: 14,
      },
      olTitle: {
        fontSize: 11,
        bold: true,
        decoration: "underline",
      },
    },
    // pageMargins: [15, 20, 15, 20],
  };
};
