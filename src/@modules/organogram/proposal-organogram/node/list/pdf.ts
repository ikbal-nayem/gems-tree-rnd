import { COMMON_LABELS, TDocumentDefinitions, numEnToBn } from "@gems/utils";

const columns = [
  { nameBn: "ক্রমিক নং", key: null },
  { nameBn: "পদবি/স্তর", key: "node" },
  { nameBn: "অভিভাবক", key: "parentNode" },
  { nameBn: "জনবল", key: "nodeManpower" },
];

export const organizationTypePDFContent = (
  data,
  PDF_Title
): TDocumentDefinitions => {
  return {
    content: [
      { text: PDF_Title, style: "header" },
      {
        table: {
          headerRows: 1,
          dontBreakRows: true,
          widths: [40, "*", "*", "*"],
          body: [
            columns.map((col) => ({ text: col.nameBn, style: "tableHeader" })),
            ...data?.map((d, idx) =>
              columns.map((col) => {
                if (col?.key) {
                  switch (col?.key) {
                    case "node":
                      return [
                        {
                          text: d?.titleBn,
                        },
                      ];
                    case "parentNode":
                      return [
                        {
                          text:
                            d?.parentNodeDto?.titleBn || COMMON_LABELS.NO_DATE,
                        },
                      ];
                    default:
                      return {
                        text: numEnToBn(
                          d[col?.key] || COMMON_LABELS.NOT_ASSIGN
                        ),
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
      },
      textBold: {
        bold: true,
        fontSize: 14,
      },
    },
  };
};
