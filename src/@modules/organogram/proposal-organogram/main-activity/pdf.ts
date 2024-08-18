import { TDocumentDefinitions, numEnToBn } from "@gems/utils";

const columns = [
  { nameBn: "ক্রমিক নং", key: null },
  { nameBn: "প্রধান কার্যাবলি (বাংলা)", key: "mainActivityBn" },
  { nameBn: "প্রধান কার্যাবলি (ইংরেজি)", key: "mainActivityEn" },
];

export const organizationTypePDFContent = (
  data,
  orgName
): TDocumentDefinitions => {
  return {
    content: [
      { text: orgName + " - প্রধান কার্যাবলির তালিকা", style: "header" },
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
                        text: numEnToBn(d[col?.key] || "-"),
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
