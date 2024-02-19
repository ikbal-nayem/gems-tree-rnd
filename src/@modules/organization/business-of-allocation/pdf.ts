import { COMMON_LABELS } from "@constants/common.constant";
import { TDocumentDefinitions, numEnToBn } from "@gems/utils";

const columns = [
  { nameBn: "ক্রমিক নং", key: null },
  { nameBn: "কর্মবন্টন (বাংলা)", key: "businessOfAllocationBn" },
  { nameBn: "কর্মবন্টন (ইংরেজি)", key: "businessOfAllocationEn" },
];

export const organizationTypePDFContent = (data, orgName): TDocumentDefinitions => {
  return {
    content: [
      { text: orgName + " এর কর্মবন্টনের তালিকা", style: "header" },
      {
        table: {
          headerRows: 1,
          dontBreakRows: true,
          widths: [40, "*", "*"],
          body: [
            columns.map((col) => ({ text: col.nameBn, style: "tableHeader" })),
            ...data?.map((d, idx) =>
              columns.map((col) => {
                if (col?.key) {
                  switch (col?.key) {
                    case "isActive":
                      return [
                        {
                          text: d[col?.key] ? "True" : "False",
                          alignment: "center",
                        },
                      ];
                    default:
                      return {
                        text: numEnToBn(
                          d[col?.key] || COMMON_LABELS.NOT_ASSIGN
                        ),
                        alignment: "start",
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
        alignment: "start",
      },
      textBold: {
        bold: true,
        fontSize: 14,
      },
    },
  };
};
