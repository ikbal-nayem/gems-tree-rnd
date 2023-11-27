import { LABELS } from "@constants/common.constant";
import {
  ContentPreloader,
  ITableHeadColumn,
  NoData,
  Separator,
  Table,
  TableCell,
  TableRow,
} from "@gems/components";
import { COMMON_LABELS, numEnToBn } from "@gems/utils";
import { FC, Fragment } from "react";
import { LOCAL_LABELS } from "./labels";

type TableProps = {
  data: any;
  isLoading: boolean;
  langEn: boolean;
};

const ManPowerList: FC<TableProps> = ({ data, isLoading, langEn }) => {
  const LABEL = langEn ? LABELS.EN : LABELS.BN;
  const LOCAL_LABEL = langEn ? LOCAL_LABELS.EN : LOCAL_LABELS.BN;
  const columns: ITableHeadColumn[] = [
    { title: LOCAL_LABEL.SL_NO, width: 50 },
    { title: LOCAL_LABEL.NAME_OF_POSTS, align: "start" },
    { title: LOCAL_LABEL.NO_OF_POSTS, align: "end" },
  ];

  let idx = 1000; // lets take a common index for both parent-child list
  let slNo = 1; // serial number count only for posts
  return (
    <div className="card border p-3">
      <h4 className="m-0">{LABEL.SUM_OF_MANPOWER}</h4>
      <Separator className="mt-1 mb-0" />
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
                        {(langEn ? classs?.classNameEn : classs?.classNameBn) ||
                          COMMON_LABELS.NOT_ASSIGN}
                      </p>
                    </TableCell>
                  </TableRow>
                  {classs?.manpowerDtoList?.map((itr) => (
                    <TableRow key={idx++}>
                      <TableCell className="remove-padding">
                        {langEn ? slNo++ : numEnToBn(slNo)}
                      </TableCell>
                      <TableCell className="remove-padding">
                        <p className="mb-0 fs-7">
                          {(langEn ? itr?.postTitleEn : itr?.postTitleBn) ||
                            COMMON_LABELS.NOT_ASSIGN}
                        </p>
                      </TableCell>
                      <TableCell className="remove-padding">
                        <div className="d-flex justify-content-end fs-7">
                          {langEn
                            ? itr?.manpower
                            : numEnToBn(itr?.manpower) ||
                              COMMON_LABELS.NOT_ASSIGN}
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
                            COMMON_LABELS.NOT_ASSIGN}
                      </div>
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
            <TableRow key={idx++}>
              <TableCell />
              <TableCell className="p-0">
                <div className="fw-bold fs-6">{LOCAL_LABEL.GRAND_TOTAL}</div>
              </TableCell>
              <TableCell>
                <div className="d-flex justify-content-end fw-bold fs-6">
                  {langEn
                    ? data?.totalManpower
                    : numEnToBn(data?.totalManpower) ||
                      COMMON_LABELS.NOT_ASSIGN}
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
      ) : (
        <NoData
          details={LABEL.SUM_OF_MANPOWER + " এর কোনো তথ্য পাওয়া যায়নি!"}
        />
      )}
    </div>
  );
};

export default ManPowerList;
