import {
  Dropdown,
  DropdownItem,
  // Dropdown,
  // DropdownItem,
  ITableHeadColumn,
  Icon,
  // Icon,
  Table,
  TableCell,
  TableRow,
} from "@gems/components";
import {
  COMMON_LABELS,
  IObject,
  generateRowNumBn,
  numEnToBn,
} from "@gems/utils";
import { FC, ReactNode } from "react";

const columns: ITableHeadColumn[] = [
  { title: COMMON_LABELS.SL_NO, minWidth: 50 },
  // { title: "ধরণ (বাংলা)", minWidth: 100 },
  { title: "পদবি/স্তর", minWidth: 100 },
  { title: "অভিভাবক", minWidth: 100 },
  { title: "জনবল", minWidth: 75 },
  { title: COMMON_LABELS.ACTION, align: "end" },
];

type DataTableProps = {
  children?: ReactNode;
  data?: any;
  handleUpdate: (data) => void;
  // handleDelete: (data) => void;
  organogram: IObject;
};

const DataTable: FC<DataTableProps> = ({
  children,
  data = [],
  handleUpdate,
  // handleDelete,
  organogram,
}) => {
  if (!data?.length) return;
  const isEnamCommittee = organogram?.isEnamCommittee;
  return (
    <>
      <Table columns={columns}>
        {data?.map((data, i) => {
          return (
            <TableRow key={i}>
              <TableCell text={generateRowNumBn(i)} />
              <TableCell
                text={(isEnamCommittee ? data?.titleEn : data?.titleBn) || "-"}
              />
              <TableCell
                text={
                  (isEnamCommittee
                    ? data?.parentNodeDto?.titleEn
                    : data?.parentNodeDto?.titleBn) || "-"
                }
              />
              <TableCell text={numEnToBn(data?.nodeManpower) || "-"} />
              {/* <TableCell text={data?.parentDTO?.nameBn || "-"}/> */}
              {/* <TableCell text={data?.code || "-"} /> */}
              <TableCell textAlign="end">
                <Dropdown
                  btnIcon={true}
                  btnContent={<Icon icon="more_vert" size={20} />}
                  id={"data?.id"}
                >
                  <DropdownItem
                    onClick={() => {
                      handleUpdate(data?.id);
                    }}
                  >
                    <Icon size={19} icon="edit" />
                    <h6 className="mb-0 ms-3">সম্পাদনা করুন</h6>
                  </DropdownItem>
                  {/* <DropdownItem
                    onClick={() => {
                      handleDelete(data);
                    }}
                  >
                    <Icon size={19} icon="delete" color="danger" />
                    <h6 className="mb-0 ms-3 text-danger">মুছে ফেলুন</h6>
                  </DropdownItem> */}
                </Dropdown>
              </TableCell>
            </TableRow>
          );
        })}
      </Table>
      {children}
    </>
  );
};

export default DataTable;
