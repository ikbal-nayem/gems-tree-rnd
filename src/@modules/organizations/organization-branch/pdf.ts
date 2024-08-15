import { COMMON_LABELS } from "@constants/common.constant";
import { TDocumentDefinitions, numEnToBn } from "@gems/utils";
import { pdfCellAlign } from "utility/utils";

const columns = [
  { nameBn: "ক্রমিক নং", key: null },
  { nameBn: "নাম (বাংলা)", key: "organizationNameBn" },
  { nameBn: "নাম (ইংরেজি)", key: "organizationNameEn" },
  { nameBn: "শাখার নাম (বাংলা)", key: "orgBranchNameBn" },
  { nameBn: "শাখার নাম (ইংরেজি)", key: "orgBranchNameEn" },
  { nameBn: "মেটা ট্যাগ", key: "orgBranchKey" },
  { nameBn: "সক্রিয়", key: "isActive" },
];

export const organizationTypePDFContent = (data): TDocumentDefinitions => {
  return {
    content: [
      { text: "প্রতিষ্ঠানের শাখার তালিকা", style: "header" },
      {
        table: {
          headerRows: 1,
          dontBreakRows: true,
          widths: [30, 75, 75, 75, 75, 80, 40],
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
                    case "organizationNameBn":
                      return [
                        {
                          text: d?.organizationNameBn || "-",
                          alignment: pdfCellAlign(d?.organizationNameBn),
                        },
                      ];
                    case "organizationNameEn":
                      return [
                        {
                          text: d?.organizationNameEn || "-",
                          alignment: pdfCellAlign(d?.organizationNameEn),
                        },
                      ];
                    case "orgBranchNameBn":
                      return [
                        {
                          text: d?.orgBranchNameBn || "-",
                          alignment: pdfCellAlign(d?.orgBranchNameBn),
                        },
                      ];
                    case "orgBranchNameEn":
                      return [
                        {
                          text: d?.orgBranchNameEn || "-",
                          alignment: pdfCellAlign(d?.orgBranchNameEn),
                        },
                      ];
                    case "orgBranchKey":
                      return [
                        {
                          text: d?.orgBranchKey || "-",
                          alignment: pdfCellAlign(d?.orgBranchKey),
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
