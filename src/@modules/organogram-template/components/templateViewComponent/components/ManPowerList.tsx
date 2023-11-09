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
import { LABELS } from "@constants/common.constant";
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
    { title: LOCAL_LABEL.NAME_OF_POSTS, width: 50 },
    { title: LOCAL_LABEL.NO_OF_POSTS, width: 80, align: "end" },
  ];

  let idx = 1000; // lets take a common index for both parent-child list
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
                    <TableCell
                      textClassName="fw-bold fs-5"
                      text={classs?.className || COMMON_LABELS.NOT_ASSIGN}
                    />
                  </TableRow>
                  {classs?.manpowerDtoList?.map((itr) => (
                    <TableRow key={idx++}>
                      <TableCell
                        text={itr?.postTitle || COMMON_LABELS.NOT_ASSIGN}
                      />
                      <TableCell
                        textAlign="end"
                        text={
                          numEnToBn(itr?.manpower) || COMMON_LABELS.NOT_ASSIGN
                        }
                      />
                    </TableRow>
                  ))}
                  <TableRow key={idx++}>
                    <TableCell
                      textClassName="fw-bold fs-4 mb-3"
                      text={LOCAL_LABEL.TOTAL}
                    />
                    <TableCell
                      textAlign="end"
                      textClassName="fw-bold fs-4 mb-3"
                      text={
                        numEnToBn(classs?.totalClassManpower) ||
                        COMMON_LABELS.NOT_ASSIGN
                      }
                    />
                  </TableRow>
                </Fragment>
              );
            })}
            <TableRow key={idx++}>
              <TableCell
                textClassName="fw-bold fs-3"
                text={LOCAL_LABEL.GRAND_TOTAL}
              />
              <TableCell
                textAlign="end"
                textClassName="fw-bold fs-3"
                text={
                  numEnToBn(data?.totalManpower) || COMMON_LABELS.NOT_ASSIGN
                }
              />
            </TableRow>
            <TableRow key={idx++}>
              <TableCell> </TableCell>
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
