import { LABELS } from "@constants/common.constant";
import {
  COMMON_LABELS,
  DATE_PATTERN,
  TDocumentDefinitions,
  generateDateFormat,
  isObjectNull,
  makeBDLocalTime,
  numEnToBn,
} from "@gems/utils";
import { LOCAL_LABELS } from "../labels";
import { postTypeList } from "../ManPowerList";

export const manpowerListPDFContent = (
  data,
  orgName,
  versionDate,
  langEn: boolean
): TDocumentDefinitions => {
  const today = makeBDLocalTime(new Date());
  let slNo = 1;
  const pushData = [];
  const LABEL = langEn ? LABELS.EN : LABELS.BN;
  const LOCAL_LABEL = langEn ? LOCAL_LABELS.EN : LOCAL_LABELS.BN;
  const COMMON_LABEL = langEn ? COMMON_LABELS.EN : COMMON_LABELS;
  const columns = [
    { nameBn: LOCAL_LABEL.SL_NO },
    { nameBn: LOCAL_LABEL.NAME_OF_POSTS },
    { nameBn: LOCAL_LABEL.NO_OF_POSTS },
    { nameBn: LOCAL_LABEL.Grade },
    { nameBn: LOCAL_LABEL.Service_Type },
    { nameBn: LOCAL_LABEL.Post_Type },
  ];

  const getPostTypeTitle = (key: string, langEn: boolean) => {
    let notAssign = langEn ? "Not Assigned" : COMMON_LABELS.NOT_ASSIGN;
    if (key) {
      const postType = postTypeList.find((item) => item.key === key);
      if (!isObjectNull(postType)) {
        return langEn ? postType.titleEn : postType.titleBn;
      } else return notAssign;
    }
    return notAssign;
  };

  if (!isObjectNull(data)) {
    if (data?.classDtoList?.length > 0)
      data?.classDtoList?.forEach((cl) => {
        pushData.push([
          "",
          {
            text:
              (langEn ? cl?.classNameEn : cl?.classNameBn) ||
              COMMON_LABEL.NOT_ASSIGN,
            fontSize: 10,
            bold: true,
          },
          "",
          "",
          "",
          "",
        ]);
        cl?.manpowerDtoList?.length > 0 &&
          cl?.manpowerDtoList?.forEach((mp) => {
            pushData.push([
              {
                text: (langEn ? slNo++ : numEnToBn(slNo++)) + ".",
                alignment: "center",
              },
              {
                text:
                  (langEn
                    ? mp?.postTitleEn +
                      `${mp?.altPostTitleEn ? "/" + mp?.altPostTitleEn : ""}`
                    : mp?.postTitleBn +
                      `${
                        mp?.altPostTitleBn ? "/" + mp?.altPostTitleBn : ""
                      }`) || COMMON_LABEL.NOT_ASSIGN,
              },
              {
                text:
                  (langEn ? mp?.manpower : numEnToBn(mp?.manpower)) ||
                  COMMON_LABEL.NOT_ASSIGN,
                alignment: "center",
              },
              {
                text:
                  (langEn ? mp?.gradeNameEN : mp?.gradeNameBN) ||
                  COMMON_LABEL.NOT_ASSIGN,
                alignment: "center",
              },
              {
                text: mp?.serviceType
                  ? langEn
                    ? mp.serviceType === "SERVICE_TYPE_CADRE"
                      ? "Cadre"
                      : "Non-Cadre"
                    : mp.serviceType === "SERVICE_TYPE_CADRE"
                    ? "ক্যাডার"
                    : "নন-ক্যাডার"
                  : COMMON_LABEL.NOT_ASSIGN,
                alignment: "center",
              },
              {
                text: getPostTypeTitle(mp?.postType, langEn),
                alignment: "center",
              },
            ]);
          });
        cl?.totalClassManpower >= 0 &&
          pushData.push([
            "",
            {
              text: LOCAL_LABEL.TOTAL,
              fontSize: 10,
              bold: true,
            },
            {
              text:
                (langEn
                  ? cl?.totalClassManpower
                  : numEnToBn(cl?.totalClassManpower)) ||
                COMMON_LABEL.NOT_ASSIGN,
              fontSize: 10,
              bold: true,
              alignment: "center",
            },
            "",
            "",
            "",
          ]);
      });
    data?.totalManpower >= 0 &&
      pushData.push([
        "",
        {
          text: LOCAL_LABEL.GRAND_TOTAL,
          fontSize: 11,
          bold: true,
        },
        {
          text:
            (langEn ? data?.totalManpower : numEnToBn(data?.totalManpower)) ||
            COMMON_LABEL.NOT_ASSIGN,
          fontSize: 11,
          bold: true,
          alignment: "center",
        },
        "",
        "",
        "",
      ]);
  }

  return {
    content: [
      { text: orgName, style: "header" },
      { text: versionDate, style: "subHeader" },
      { text: LABEL.SUM_OF_MANPOWER, style: "title" },

      {
        table: {
          headerRows: 1,
          dontBreakRows: true,
          widths: [30, "*", "*", "*", "*", "*"],
          body: [
            columns.map((col) => ({ text: col.nameBn, style: "tableHeader" })),
            ...pushData,
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
              text: `${langEn ? "Date" : "তারিখ"}: ${generateDateFormat(
                today,
                DATE_PATTERN.GOVT_STANDARD,
                langEn ? "en" : "bn"
              )}`,
            },
            {
              text: "Digitally Generated by GEMS",
              fontSize: 8,
              color: "#009ef7",
              alignment: "center",
              marginTop: 3,
            },
            {
              text: `${langEn ? "Page" : "পৃষ্ঠা"}: ${
                langEn
                  ? currentPage.toString()
                  : numEnToBn(currentPage.toString())
              }/${langEn ? pageCount : numEnToBn(pageCount)}`,
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
        fontSize: 14,
        bold: true,
        alignment: "center",
      },
      subHeader: {
        fontSize: 13,
        bold: true,
        alignment: "center",
        marginBottom: 10,
      },
      title: {
        fontSize: 13,
        bold: true,
        alignment: "left",
        marginBottom: 5,
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
    },
    pageMargins: [15, 20, 15, 20],
  };
};
