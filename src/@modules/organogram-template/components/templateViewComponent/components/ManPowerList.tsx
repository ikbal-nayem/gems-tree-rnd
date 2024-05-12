import { LABELS } from "@constants/common.constant";
import {
  ContentPreloader,
  ITableHeadColumn,
  Icon,
  Separator,
  Table,
  TableCell,
  TableRow,
} from "@gems/components";
import { TextEditorPreview } from "@gems/editor";
import { COMMON_LABELS, numEnToBn } from "@gems/utils";
import { FC, Fragment, useState } from "react";
import MPListChanges from "./MPListChanges";
import { LOCAL_LABELS } from "./labels";

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
}) => {
  const LABEL = langEn ? LABELS.EN : LABELS.BN;
  const LOCAL_LABEL = langEn ? LOCAL_LABELS.EN : LOCAL_LABELS.BN;
  const columns: ITableHeadColumn[] = [
    { title: LOCAL_LABEL.SL_NO, width: 50 },
    { title: LOCAL_LABEL.NAME_OF_POSTS, align: "start" },
    { title: LOCAL_LABEL.NO_OF_POSTS, align: "end" },
  ];

  let idx = 1000; // lets take a common index for both parent-child list
  let slNo = 1; // serial number count only for posts
  const COMMON_LABEL = langEn ? COMMON_LABELS.EN : COMMON_LABELS;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onClose = () => setIsOpen(false);
  return (
    <>
      <div className="card border p-3">
        <div className="d-flex justify-content-between">
          <h4 className={title ? "m-0 text-info" : "m-0"}>
            {title ? title : LABEL.SUM_OF_MANPOWER}
          </h4>
          {!isSummaryOfManPowerObject &&
            organogramId &&
            !isBeginningVersion &&
            !insideModal && (
              <Icon
                icon="swap_horiz"
                variants="outlined"
                hoverTitle={LABEL.CHANGES}
                size={25}
                className="text-primary text-hover-warning"
                onClick={() => setIsOpen(true)}
              />
            )}
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
                                        ? " / " + itr?.altPostTitleEn
                                        : ""
                                    }`
                                  : itr?.postTitleBn +
                                    `${
                                      itr?.altPostTitleBn
                                        ? " / " + itr?.altPostTitleBn
                                        : ""
                                    }`) || COMMON_LABEL.NOT_ASSIGN}
                              </p>
                            </TableCell>
                            <TableCell className="remove-padding">
                              <div className="d-flex justify-content-end fs-7">
                                {langEn
                                  ? itr?.manpower
                                  : numEnToBn(itr?.manpower) ||
                                    COMMON_LABEL.NOT_ASSIGN}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow key={idx++}>
                          <TableCell />
                          <TableCell className="remove-padding">
                            <div className="d-flex justify-content-start mb-2 fw-bold fs-7">
                              {LOCAL_LABEL.TOTAL}
                            </div>
                          </TableCell>
                          <TableCell className="remove-padding">
                            <div className="d-flex justify-content-end mb-2 fw-bold fs-7">
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
