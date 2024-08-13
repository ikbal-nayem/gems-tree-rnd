import { LABELS } from "@constants/common.constant";
import {
  Button,
  ContentPreloader,
  Icon,
  ITableHeadColumn,
  Separator,
  Table,
  TableCell,
  TableRow,
  TextEditorPreview,
} from "@gems/components";
import {
  ckToPdfMake,
  COMMON_LABELS,
  DATE_PATTERN,
  generateDateFormat,
  generatePDF,
  isObjectNull,
  makeBDLocalTime,
  numEnToBn,
} from "@gems/utils";
import { FC, Fragment, useState } from "react";
import "../style.scss";
import MPListChanges from "./MPListChanges";
import { LOCAL_LABELS } from "./labels";
import { manpowerListPDFContent } from "./pdf/ManpowerListPDF";
import { commonPDFFooter } from "utility/utils";

type TableProps = {
  data: any;
  isSummaryOfManPowerObject?: boolean;
  summaryOfManPowerObject?: string;
  isLoading: boolean;
  langEn: boolean;
  isBeginningVersion?: boolean;
  insideModal?: boolean;
  organogramId?: string;
  title?: string;
  isDownloadVisible?: boolean;
  orgName?: string;
  versionDate?: string;
};

export const postTypeList = [
  {
    titleEn: "Proposed",
    key: "proposed",
    titleBn: "প্রস্তাবিত",
  },
  {
    titleEn: "Permanent",
    key: "permanent",
    titleBn: "স্থায়ী",
  },
  {
    titleEn: "Non Permanent",
    key: "nonPermanent",
    titleBn: "অস্থায়ী",
  },
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

const ManPowerList: FC<TableProps> = ({
  data,
  isLoading,
  langEn,
  isBeginningVersion,
  insideModal,
  organogramId,
  summaryOfManPowerObject,
  isSummaryOfManPowerObject,
  title,
  isDownloadVisible,
  orgName,
  versionDate,
}) => {
  const LABEL = langEn ? LABELS.EN : LABELS.BN;
  const LOCAL_LABEL = langEn ? LOCAL_LABELS.EN : LOCAL_LABELS.BN;
  const columns: ITableHeadColumn[] = [
    { title: LOCAL_LABEL.SL_NO, width: 50 },
    { title: LOCAL_LABEL.NAME_OF_POSTS, align: "start" },
    { title: LOCAL_LABEL.NO_OF_POSTS, align: "center" },
    { title: LOCAL_LABEL.Grade, align: "center" },
    { title: LOCAL_LABEL.Service_Type, align: "center" },
    { title: LOCAL_LABEL.Post_Type, align: "center" },
  ];

  let idx = 1000; // lets take a common index for both parent-child list
  let slNo = 1; // serial number count only for posts
  const COMMON_LABEL = langEn ? COMMON_LABELS.EN : COMMON_LABELS;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onClose = () => setIsOpen(false);

  const onMenualDownload = () => {
    const docs = ckToPdfMake(summaryOfManPowerObject);

    let style = {
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
    };

    let pdfHeader = [
      {
        text: orgName,
        style: "header",
      },
      {
        text: versionDate,
        style: "subHeader",
      },
      {
        text: LABEL.SUM_OF_MANPOWER,
        style: "title",
      },
    ];

    generatePDF(
      {
        content: pdfHeader.concat(docs),
        styles: style,
        footer: (currentPage, pageCount) =>
          commonPDFFooter(currentPage, pageCount, langEn),
      },
      {
        action: "download",
        fileName: `Summary Of Manpower Report ${generateDateFormat(
          makeBDLocalTime(new Date()),
          DATE_PATTERN.GOVT_STANDARD,
          "en"
        )}`,
      }
    );
  };

  return (
    <>
      <div className="card border p-3 test">
        <div className="d-flex justify-content-between">
          <p className={`${title ? "text-info" : ""} m-0 fs-4 fw-bold`}>
            {title ? title : LABEL.SUM_OF_MANPOWER}
          </p>
          <div className="d-flex gap-1">
            {!isSummaryOfManPowerObject &&
              organogramId &&
              !isBeginningVersion &&
              !insideModal && (
                <Icon
                  icon="swap_horiz"
                  variants="outlined"
                  hoverTitle={LABEL.CHANGES}
                  size={25}
                  className="text-primary text-hover-warning mt-2"
                  onClick={() => setIsOpen(true)}
                />
              )}
            {isDownloadVisible && (
              <Button
                color="primary"
                className="rounded-circle px-3 py-3"
                size="sm"
                variant="active-light"
                onClick={() => {
                  // onDownloadPDF(
                  //   "summary-manpower-pdfGenerator",
                  //   "Summary of Manpower Data"
                  // )
                  if (isSummaryOfManPowerObject) {
                    onMenualDownload();
                  } else {
                    generatePDF(
                      manpowerListPDFContent(
                        data,
                        orgName,
                        versionDate,
                        langEn
                      ),
                      {
                        action: "download",
                        fileName: `Summary Of Manpower Report ${generateDateFormat(
                          makeBDLocalTime(new Date()),
                          DATE_PATTERN.GOVT_STANDARD,
                          "en"
                        )}`,
                      }
                    );
                  }
                }}
              >
                <Icon icon="download" color="primary" size={20} />
              </Button>
            )}
          </div>
        </div>

        <Separator className="mt-1 mb-0" />
        {isSummaryOfManPowerObject ? (
          <TextEditorPreview html={summaryOfManPowerObject} />
        ) : (
          <>
            {data?.classDtoList?.length ? (
              <Table columns={columns}>
                <>
                  {data?.classDtoList?.map((classs) => {
                    return (
                      <Fragment key={idx++}>
                        <TableRow key={idx++}>
                          <TableCell />
                          <TableCell className="remove-padding">
                            <p className="fw-bold mb-0 fs-7">
                              {(langEn
                                ? classs?.classNameEn
                                : classs?.classNameBn) ||
                                COMMON_LABEL.NOT_ASSIGN}
                            </p>
                          </TableCell>
                        </TableRow>

                        {classs?.manpowerDtoList?.map((itr) => (
                          <TableRow key={idx++}>
                            <TableCell className="remove-padding text-end">
                              {(langEn ? slNo++ : numEnToBn(slNo++)) + "."}
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </TableCell>
                            <TableCell className="remove-padding">
                              <p className="mb-0 fs-7">
                                {(langEn
                                  ? itr?.postTitleEn +
                                    `${
                                      itr?.altPostTitleEn
                                        ? "/" + itr?.altPostTitleEn
                                        : ""
                                    }`
                                  : itr?.postTitleBn +
                                    `${
                                      itr?.altPostTitleBn
                                        ? "/" + itr?.altPostTitleBn
                                        : ""
                                    }`) || COMMON_LABEL.NOT_ASSIGN}
                              </p>
                            </TableCell>

                            <TableCell className="remove-padding">
                              <p className="text-center fs-7 mb-0">
                                {langEn
                                  ? itr?.manpower
                                  : numEnToBn(itr?.manpower) ||
                                    COMMON_LABEL.NOT_ASSIGN}
                              </p>
                            </TableCell>

                            <TableCell className="remove-padding text-center">
                              {itr?.gradeNameEN
                                ? langEn
                                  ? itr?.gradeNameEN
                                  : itr?.gradeNameBN
                                : COMMON_LABEL.NOT_ASSIGN}
                            </TableCell>

                            <TableCell className="remove-padding text-center">
                              {itr?.serviceType
                                ? langEn
                                  ? itr.serviceType === "SERVICE_TYPE_CADRE"
                                    ? "Cadre"
                                    : "Non-Cadre"
                                  : itr.serviceType === "SERVICE_TYPE_CADRE"
                                  ? "ক্যাডার"
                                  : "নন-ক্যাডার"
                                : COMMON_LABEL.NOT_ASSIGN}
                            </TableCell>

                            <TableCell className="remove-padding text-center">
                              {getPostTypeTitle(itr?.postType, langEn)}
                            </TableCell>
                          </TableRow>
                        ))}

                        <TableRow key={idx++}>
                          <TableCell />
                          <TableCell className="remove-padding">
                            <p className="mb-2 fw-bold fs-7">
                              {LOCAL_LABEL.TOTAL}
                            </p>
                          </TableCell>

                          <TableCell className="remove-padding">
                            <p className="text-center mb-2 fw-bold fs-7">
                              {langEn
                                ? classs?.totalClassManpower
                                : numEnToBn(classs?.totalClassManpower) ||
                                  COMMON_LABEL.NOT_ASSIGN}
                            </p>
                          </TableCell>
                        </TableRow>
                      </Fragment>
                    );
                  })}
                  <TableRow key={idx++}>
                    <TableCell />
                    <TableCell className="p-0">
                      <p className="fw-bold fs-6 mb-0">
                        {LOCAL_LABEL.GRAND_TOTAL}
                      </p>
                    </TableCell>

                    <TableCell className="remove-padding">
                      <p className="text-center fw-bold fs-6 mb-0">
                        {langEn
                          ? data?.totalManpower
                          : numEnToBn(data?.totalManpower) ||
                            COMMON_LABEL.NOT_ASSIGN}
                      </p>
                    </TableCell>
                  </TableRow>
                  {/* <TableRow key={idx++}>
                    <TableCell />
                  </TableRow> */}
                </>
              </Table>
            ) : isLoading ? (
              <ContentPreloader />
            ) : null}
          </>
        )}
      </div>
      <MPListChanges
        langEn={langEn}
        isOpen={isOpen}
        onClose={onClose}
        currentManpower={data}
        organogramId={organogramId}
      />
    </>
  );
};

export default ManPowerList;
