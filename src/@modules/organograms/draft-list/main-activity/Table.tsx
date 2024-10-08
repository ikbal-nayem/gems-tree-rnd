import {
  Dropdown,
  DropdownItem,
  Icon,
  // Icon,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from "@gems/components";
import { COMMON_LABELS, generateRowNumBn } from "@gems/utils";
import { FC, ReactNode } from "react";

// const columns: ITableHeadColumn[] = [
//   { title: COMMON_LABELS.SL_NO, minWidth: 50 },
//   { title: "প্রধান কার্যাবলি (বাংলা)", minWidth: 400 },
//   { title: "প্রধান কার্যাবলি (ইংরেজি)", minWidth: 400 },
//   { title: COMMON_LABELS.ACTION, align: "end" },
// ];

type TableProps = {
  children?: ReactNode;
  data?: any;
  handleUpdate: (data) => void;
  handleDelete: (data) => void;
  isEnamCommittee: boolean;
};

const DataTable: FC<TableProps> = ({
  children,
  data = [],
  handleUpdate,
  handleDelete,
  isEnamCommittee,
}) => {
  if (!data?.length) return;
  return (
    <>
      <Table>
        <TableHead>
          <TableCell text={COMMON_LABELS.SL_NO} minWidth={50} head />
          {!isEnamCommittee && (
            <TableCell text={"প্রধান কার্যাবলি (বাংলা)"} minWidth={400} head />
          )}
          <TableCell text={"প্রধান কার্যাবলি (ইংরেজি)"} minWidth={400} head />
          <TableCell
            text={COMMON_LABELS.ACTION}
            minWidth={50}
            textAlign="end"
            head
          />
        </TableHead>
        {data?.map((data, i) => {
          return (
            <TableRow key={i}>
              <TableCell text={generateRowNumBn(i)} />
              {!isEnamCommittee && (
                <TableCell text={data?.mainActivityBn || "-"} />
              )}
              <TableCell text={data?.mainActivityEn || "-"} />
              <TableCell textAlign="end">
                <Dropdown
                  btnIcon={true}
                  btnContent={<Icon icon="more_vert" size={20} />}
                  id={"data?.id"}
                >
                  <DropdownItem
                    onClick={() => {
                      handleUpdate(data);
                    }}
                  >
                    <Icon size={19} icon="edit" />
                    <h6 className="mb-0 ms-3">সম্পাদনা করুন</h6>
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      handleDelete(data);
                    }}
                  >
                    <Icon size={19} icon="delete" color="danger" />
                    <h6 className="mb-0 ms-3 text-danger">মুছে ফেলুন</h6>
                  </DropdownItem>
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
