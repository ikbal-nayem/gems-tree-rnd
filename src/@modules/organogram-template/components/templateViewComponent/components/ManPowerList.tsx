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
// import { useNavigate } from "react-router-dom";
// import { ROUTE } from "@constants/internal-route.constant";
import { LABELS } from "@constants/common.constant";

type TableProps = {
  data: any;
  isLoading: boolean;
};

const ManPowerList: FC<TableProps> = ({ data, isLoading }) => {
  const columns: ITableHeadColumn[] = [
    { title: "Name of Posts", width: 50 },
    { title: "No of Posts", width: 80, align: "end" },
  ];

  // const navigate = useNavigate();
  // const navigateToDetails = (id: string) => {
  //   navigate(ROUTE.ORG_TEMPLATE_UPDATE + "?id=" + id);
  // };

  data = {
    total: "100",
    classList: [
      {
        titleBn: "Class-I",
        manPowerList: [
          {
            postTitle: "Deputy Secretary",
            manpower: "4",
          },
          {
            postTitle: "Senior Assis Secretary",
            manpower: "16",
          },
        ],
        classTotal: "20",
      },
      {
        titleBn: "Class-II",
        manPowerList: [
          {
            postTitle: "Transport Superintendent",
            manpower: "20",
          },
          {
            postTitle: "Comptroller",
            manpower: "60",
          },
        ],
        classTotal: "80",
      },
    ],
  };

  return (
    <div className="card border p-3">
      <h4 className="m-0">{LABELS.BN.SUM_OF_MANPOWER}</h4>
      <Separator className="mt-1 mb-0" />
      {data?.classList?.length ? (
        <Table columns={columns}>
          <>
            {data?.classList?.map((classs) => {
              return (
                <>
                  {/* <br /> */}
                  <TableRow>
                    <TableCell
                      textClassName="fw-bold fs-5"
                      text={classs?.titleBn || COMMON_LABELS.NOT_ASSIGN}
                    />
                  </TableRow>
                  {classs?.manPowerList?.map((itr, idx) => (
                    <TableRow key={idx}>
                      <TableCell
                        text={itr?.postTitle || COMMON_LABELS.NOT_ASSIGN}
                      />
                      <TableCell
                        textAlign="end"
                        text={itr?.manpower || COMMON_LABELS.NOT_ASSIGN}
                      />
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell textClassName="fw-bold mb-3" text="Total" />
                    <TableCell
                      textAlign="end"
                      textClassName="fw-bold mb-3"
                      text={classs?.classTotal || COMMON_LABELS.NOT_ASSIGN}
                    />
                  </TableRow>
                  {/* <br /> */}
                </>
              );
            })}
            <TableRow>
              <TableCell textClassName="fw-bold fs-4" text="GRAND TOTAL" />
              <TableCell
                textAlign="end"
                textClassName="fw-bold fs-3"
                text={data?.total || COMMON_LABELS.NOT_ASSIGN}
              />
            </TableRow>
            <TableRow>
              <TableCell> </TableCell>
            </TableRow>
          </>
        </Table>
      ) : isLoading ? (
        <ContentPreloader />
      ) : (
        <NoData
          details={LABELS.BN.SUM_OF_MANPOWER + " এর কোনো তথ্য পাওয়া যায়নি!"}
        />
      )}
    </div>
  );
};

export default ManPowerList;
