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
  isObjectNull,
  numEnToBn,
} from "@gems/utils";
import { FC, Fragment, useState } from "react";
import { LOCAL_LABELS } from "./labels";
import ManpowerPDFDownloadModal from "./ManpowerPdfDownloadModal";
import { manpowerListPDFContent } from "./pdf/ManpowerListPDF";

type TableProps = {
  data: any;
  isLoading: boolean;
  langEn: boolean;
  isTabContent?: boolean;
  title?: string;
  isSummaryOfManPowerObject?: boolean;
  summaryOfManPowerObject?: string;
  isDownloadVisible?: boolean;
  multiplePDFGenarator?: (content, contentName) => void;
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
  isTabContent,
  title,
  isSummaryOfManPowerObject,
  summaryOfManPowerObject,
  isDownloadVisible,
  multiplePDFGenarator,
}) => {
  const LABEL = langEn ? LABELS.EN : LABELS?.BN;
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
  const [isPDFModalOpen, setIsPDFModalOpen] = useState<boolean>(false);
  const onPDFModalClose = () => setIsPDFModalOpen(false);

  const handlePdfDownload = () => {
    let content = [
      {
        text: LABEL.SUM_OF_MANPOWER,
        style: "title",
      },
    ];

    if (isSummaryOfManPowerObject) {
      content = content.concat(ckToPdfMake(summaryOfManPowerObject) || []);
    } else {
      content = content.concat(
        manpowerListPDFContent(data, langEn)?.content || []
      );
    }
    return content;
  };

  const onModalSubmit = (isEquipment = false) => {
    multiplePDFGenarator(handlePdfDownload(), isEquipment);
  };

  return (
    <>
      <div className="card border p-3">
        <div className="d-flex justify-content-between">
          <h4 className={title ? "m-0 text-primary" : "m-0"}>
            {isTabContent && title ? title : LOCAL_LABEL.SUM_OF_MANPOWER}
          </h4>
          <div className="d-flex gap-1">
            {isDownloadVisible && (
              <Button
                color="primary"
                className="rounded-circle px-3 py-3"
                size="sm"
                variant="active-light"
                onClick={() => {
                  setIsPDFModalOpen(true);
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
                            <TableCell
                              className={`remove-padding ${
                                isTabContent
                                  ? itr?.isModified
                                    ? "text-underline-color-purple"
                                    : itr?.isAddition
                                    ? "text-decoration-underline"
                                    : itr?.isDeleted
                                    ? "text-line-through-color-red"
                                    : ""
                                  : ""
                              }`}
                            >
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
                            <TableCell
                              className={`remove-padding ${
                                isTabContent
                                  ? itr?.isModified
                                    ? "text-underline-color-yellow"
                                    : itr?.isAddition
                                    ? "text-underline-color-black"
                                    : itr?.isDeleted
                                    ? "text-line-through-color-red"
                                    : ""
                                  : ""
                              }`}
                            >
                              <div className="text-center fs-7 mb-0">
                                {langEn
                                  ? itr?.manpower
                                  : numEnToBn(itr?.manpower) ||
                                    COMMON_LABEL.NOT_ASSIGN}
                              </div>
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
                            <div className="mb-2 fw-bold fs-7">
                              {LOCAL_LABEL.TOTAL}
                            </div>
                          </TableCell>
                          <TableCell className="remove-padding">
                            <div className="text-center mb-2 fw-bold fs-7">
                              {langEn
                                ? classs?.totalClassManpower
                                : numEnToBn(classs?.totalClassManpower) ||
                                  COMMON_LABEL.NOT_ASSIGN}
                            </div>
                          </TableCell>
                        </TableRow>
                      </Fragment>
                    );
                  })}
                  <TableRow key={idx++}>
                    <TableCell />
                    <TableCell className="p-0">
                      <div className="fw-bold fs-6">
                        {LOCAL_LABEL.GRAND_TOTAL}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="d-flex justify-content-end fw-bold fs-6">
                        {langEn
                          ? data?.totalManpower
                          : numEnToBn(data?.totalManpower) ||
                            COMMON_LABEL.NOT_ASSIGN}
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow key={idx++}>
                    <TableCell />
                  </TableRow>
                </>
              </Table>
            ) : isLoading ? (
              <ContentPreloader />
            ) : null}
          </>
        )}
      </div>
      <ManpowerPDFDownloadModal
        isEn={langEn}
        isOpen={isPDFModalOpen}
        onClose={onPDFModalClose}
        onModalSubmit={onModalSubmit}
      />
    </>
  );
};

export default ManPowerList;
