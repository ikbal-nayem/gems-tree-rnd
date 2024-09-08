import { COMMON_LABELS } from "@constants/common.constant";
import { TDocumentDefinitions, numEnToBn } from "@gems/utils";

const columns = [
  { nameBn: "ক্রমিক নং", key: null },
  { nameBn: "নাম (বাংলা)", key: "titleBn" },
  { nameBn: "নাম (ইংরেজি)", key: "titleEn" },
  { nameBn: "কোড", key: "code" },
  { nameBn: "সক্রিয়", key: "isActive" },
];

export const organogramChangeTypePDFContent = (data): TDocumentDefinitions => {
  return {
    content: [
      { text: "অর্গানোগ্রাম পরিবর্তনের ধরণের প্রতিবেদন", style: "header" },
      {
        table: {
          headerRows: 1,
          dontBreakRows: true,
          widths: [35, "*", "*", "*", 35],
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
                        },
                      ];
                    default:
                      return {
                        text: d[col?.key] || COMMON_LABELS.NOT_ASSIGN,
                        alignment: "center",
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
