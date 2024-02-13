import { COMMON_LABELS } from "@constants/common.constant";
import { TDocumentDefinitions, numEnToBn } from "@gems/utils";

const columns = [
  { nameBn: "ক্রমিক নং", key: null },
  { nameBn: "প্রতিষ্ঠানের নাম", key: "nameBn" },
  { nameBn: "প্রতিষ্ঠানের পর্যায়", key: "officeTypeDTO" },
  { nameBn: "প্রতিষ্ঠানের ধরণ", key: "organizationTypeDTO" },
  { nameBn: "প্রতিষ্ঠানের গ্রুপ", key: "organizationGroupDTO" },
  { nameBn: "প্রতিষ্ঠানের অভিভাবক", key: "parent" },
];

export const organizationPDFContent = (data): TDocumentDefinitions => {
  return {
    content: [
      { text: "প্রতিষ্ঠানের প্রতিবেদন", style: "header" },
      {
        table: {
          headerRows: 1,
          dontBreakRows: true,
          widths: [30, "*", "*", "*", "*", "*"],
          body: [
            columns.map((col) => ({ text: col.nameBn, style: "tableHeader" })),
            ...data?.map((d, idx) =>
              columns.map((col) => {
                if (col?.key) {
                  switch (col?.key) {
                    case "nameBn":
                      return [
                        {
                          text: d[col?.key] || COMMON_LABELS.NOT_ASSIGN,
                          alignment: "center",
                        },
                        {
                          text: d?.location?.chainBn || null,
                          alignment: "center",
                        },
                      ];
                    case "officeTypeDTO":
                      return [
                        {
                          text:
                            d[col?.key]?.titleBn || COMMON_LABELS.NOT_ASSIGN,
                          alignment: "center",
                        },
                      ];
                    case "organizationTypeDTO":
                      return [
                        {
                          text: d[col?.key]?.nameBn || COMMON_LABELS.NOT_ASSIGN,
                          alignment: "center",
                        },
                      ];
                    case "organizationGroupDTO":
                      return [
                        {
                          text: d[col?.key]?.nameBn || COMMON_LABELS.NOT_ASSIGN,
                          alignment: "center",
                        },
                      ];
                    case "parent":
                      return [
                        {
                          text: d[col?.key]?.nameBn || COMMON_LABELS.NOT_ASSIGN,
                          alignment: "center",
                        },
                      ];
                    default:
                      return {
                        text: numEnToBn(
                          d[col?.key] || COMMON_LABELS.NOT_ASSIGN
                        ),
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
