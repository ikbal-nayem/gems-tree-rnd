import { LABELS } from "@constants/common.constant";
import {
  TDocumentDefinitions,
  isListNull,
  isObjectNull,
  numEnToBn,
} from "@gems/utils";

export const equipmentPDFContent = (
  data,
  langEn: boolean
): TDocumentDefinitions => {
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
  };
};
