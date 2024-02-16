import { COMMON_LABELS } from "@constants/common.constant";
import {
  TDocumentDefinitions,
  notNullOrUndefined,
  numEnToBn,
} from "@gems/utils";
import { pdfCellAlign } from "utility/utils";

const columns = [
  { nameBn: "ক্রমিক নং", key: null },
  { nameBn: "নাম (বাংলা)", key: "nameBn" },
  { nameBn: "নাম (ইংরেজি)", key: "nameEn" },
  { nameBn: "প্রতিষ্ঠানের ধরণ", key: "orgType" },
  { nameBn: "গ্রুপ অভিভাবক", key: "parentGroupName" },
  { nameBn: "অভিভাবক প্রতিষ্ঠান", key: "parentOrganizationName" },
  { nameBn: "সক্রিয়", key: "isActive" },
];

export const organizationTypePDFContent = (data): TDocumentDefinitions => {
  return {
    content: [
      { text: "প্রতিষ্ঠানের গ্রুপের প্রতিবেদন", style: "header" },
      {
        table: {
          headerRows: 1,
          dontBreakRows: true,
          widths: [30, "*", "*", "*", "*", "*","*"],
          body: [
            columns.map((col) => ({ text: col.nameBn, style: "tableHeader" })),
            ...data?.map((d, idx) =>
              columns.map((col) => {
                if (col?.key) {
                  switch (col?.key) {
                    case "isActive":
                      return [
                        {
                          text: d[col?.key] ? "সক্রিয়" : "সক্রিয় নয়",
                          alignment: "center",
                          // color: d[col?.key] ? "gray-700" : "red",
                        },
                      ];
                    case "orgType":
                      return [
                        {
                          text: d?.parent?.nameBn || "-",
                          alignment: pdfCellAlign(d?.parent?.nameBn),
                        },
                      ];
                    case "parentGroupName":
                      return [
                        {
                          text: d?.parentGroup?.nameBn || "-",
                          alignment: pdfCellAlign(d?.parentGroup?.nameBn),
                        },
                      ];
                    case "parentOrganizationName":
                      return [
                        {
                          text: d?.parentOrganization?.nameBn || "-",
                          alignment: pdfCellAlign(
                            d?.parentOrganization?.nameBn
                          ),
                        },
                      ];
                    default:
                      return {
                        text: numEnToBn(
                          d[col?.key] || COMMON_LABELS.NOT_ASSIGN
                        ),
                        alignment: pdfCellAlign(d[col?.key]),
                      };
                  }
                } else return { text: numEnToBn(idx + 1), alignment: "center" };
              })
            ),
          ],
        },
        layout: "lightHorizontalLines",
      },
    ],
    footer: function (currentPage, pageCount) {
      return {
        margin: 10,
        columns: [
          {
            fontSize: 9,
            text: [
              {
                text: currentPage + " of " + pageCount,
              },
            ],
            alignment: "center",
          },
        ],
      };
    },
    styles: {
      header: {
        fontSize: 17,
        bold: true,
        alignment: "center",
        marginBottom: 15,
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
    },
  };
};
