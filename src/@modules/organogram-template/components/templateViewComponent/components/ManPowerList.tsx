import {
  ContentPreloader,
  ITableHeadColumn,
  NoData,
  Separator,
  Table,
  TableCell,
  TableRow,
} from "@gems/components";
import { COMMON_LABELS, IMeta, generateRowNumBn } from "@gems/utils";
import { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE } from "@constants/internal-route.constant";
import { LABELS } from "@constants/common.constant";

type TableProps = {
  dataList: any[];
  isLoading: boolean;
};

const ManPowerList: FC<TableProps> = ({ dataList, isLoading }) => {
  const columns: ITableHeadColumn[] = [
    { title: "Name of Posts", width: 50 },
    { title: "No of Posts", width: 80, align: "end" },
  ];

  // const navigate = useNavigate();
  // const navigateToDetails = (id: string) => {
  //   navigate(ROUTE.ORG_TEMPLATE_UPDATE + "?id=" + id);
  // };

  return (
    <div className="card border p-3">
      <h4 className="m-0">{LABELS.BN.SUM_OF_MANPOWER}</h4>
      <Separator />
      {dataList?.length ? (
        <Table columns={columns}>
          <>
            {dataList?.map((classs) => {
              return (
                <>
                  <TableRow>
                    <TableCell
                      text={classs?.titleBn || COMMON_LABELS.NOT_ASSIGN}
                    />
                  </TableRow>
                  {classs?.manPowerList?.map((itr, idx) => (
                    <TableRow key={idx}>
                      <TableCell
                        text={itr?.postTitle || COMMON_LABELS.NOT_ASSIGN}
                      />
                      <TableCell
                        text={itr?.manpower || COMMON_LABELS.NOT_ASSIGN}
                      />
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell>
                      <Separator />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell text="Total" />
                    <TableCell
                      text={classs?.classTotal || COMMON_LABELS.NOT_ASSIGN}
                    />
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Separator />
                    </TableCell>
                  </TableRow>
                </>
              );
            })}
            <TableRow>
              <TableCell text="Total" />
              <TableCell
                // text={dataList?.grandTotal || COMMON_LABELS.NOT_ASSIGN}
              />
            </TableRow>
            <TableRow>
              <TableCell>
                <Separator />
              </TableCell>
            </TableRow>
          </>
        </Table>
      ) : isLoading ? (
        <ContentPreloader />
      ) : (
        <NoData details=" এর কোনো তথ্য পাওয়া যায়নি!" />
      )}
    </div>
  );
};

export default ManPowerList;
