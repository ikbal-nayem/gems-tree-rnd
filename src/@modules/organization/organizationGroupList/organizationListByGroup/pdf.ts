import {
  COMMON_LABELS,
  DATE_PATTERN,
  TDocumentDefinitions,
  generateDateFormat,
  makeBDLocalTime,
  numEnToBn,
} from "@gems/utils";

const columns = [
  { nameBn: "ক্রমিক নং", key: null },
  { nameBn: "প্রতিষ্ঠানের নাম", key: "nameBn" },
  { nameBn: "প্রতিষ্ঠানের পর্যায়", key: "orgLevelBn" },
  { nameBn: "প্রতিষ্ঠানের ধরণ", key: "orgCategoryTypeBn" },
  { nameBn: "প্রতিষ্ঠানের গ্রুপ", key: "orgCategoryGroupBn" },
  { nameBn: "প্রতিষ্ঠানের অভিভাবক", key: "parentOrgNameBn" },
];

export const organizationPDFContent = (data): TDocumentDefinitions => {
  const today = makeBDLocalTime(new Date());
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
                          text: d[col?.key] || COMMON_LABELS.NO_DATE,
                          alignment: "center",
                        },
                        {
                          text: d?.locationChainNameBn || null,
                          alignment: "center",
                        },
                      ];

                    default:
                      return {
                        text: numEnToBn(d[col?.key] || COMMON_LABELS.NO_DATE),
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
    footer: (currentPage, pageCount) => {
      return [
        {
          columns: [
            {
              text: `তারিখ: ${generateDateFormat(
                today,
                DATE_PATTERN.GOVT_STANDARD
              )}`,
            },
            {
              text: "Powered by GEMS",
              fontSize: 8,
              color: "#009ef7",
              alignment: "center",
              marginTop: 3,
            },
            {
              text: `পৃষ্ঠা: ${numEnToBn(currentPage.toString())}/${numEnToBn(
                pageCount
              )}`,
              alignment: "right",
            },
          ],
          marginLeft: 20,
          marginRight: 20,
        },
      ];
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
