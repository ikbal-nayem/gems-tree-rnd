import {
  ContentPreloader,
  ITableHeadColumn,
  NoData,
  Table,
  TableCell,
  TableRow,
} from "@gems/components";
import { COMMON_LABELS, IMeta, generateRowNumBn } from "@gems/utils";
import { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE } from "@constants/internal-route.constant";

type TableProps = {
  children: ReactNode;
  dataList: any[];
  isLoading: boolean;
  respMeta?: IMeta;
};

const ManPowerList: FC<TableProps> = ({
  children,
  dataList,
  isLoading,
  respMeta,
}) => {
  const columns: ITableHeadColumn[] = [
    { title: "Name of Posts", width: 50 },
    { title: "No of Posts", width: 80, align: "end" },
  ];

  const navigate = useNavigate();
  const navigateToDetails = (id: string) => {
    navigate(ROUTE.ORG_TEMPLATE_UPDATE + "?id=" + id);
  };

  return (
    <>
      {dataList?.length ? (
        <Table columns={columns}>
          {dataList?.map((clsList) =>
            clsList?.manPowerList?.map((itr, idx) => (
              <TableRow key={idx}>
                <TableCell text={itr?.postTitle || COMMON_LABELS.NOT_ASSIGN} />
                <TableCell text={itr?.manpower || COMMON_LABELS.NOT_ASSIGN} />
              </TableRow>
            ))
          )}
        </Table>
      ) : isLoading ? (
        <ContentPreloader />
      ) : (
        <NoData details="কোনো তথ্য পাওয়া যায়নি!" />
      )}
      {children}
    </>
  );
};

export default ManPowerList;
