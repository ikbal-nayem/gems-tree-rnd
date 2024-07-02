import {
  Dropdown,
  DropdownItem,
  ITableHeadColumn,
  Icon,
  Table,
  TableCell,
  TableRow,
  toast,
} from "@gems/components";
import { COMMON_LABELS, generateRowNumBn } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const columns: ITableHeadColumn[] = [
  { title: COMMON_LABELS.SL_NO, minWidth: 50 },
  { title: "ব্যবহারকারী", minWidth: 100 },
  { title: "প্রতিষ্ঠানসমূহ", minWidth: 100 },
  { title: COMMON_LABELS.ACTION, align: "end" },
];

type DataTableProps = {
  children?: ReactNode;
  data?: any;
  handleUpdate: (data) => void;
  handleDelete: (data) => void;
};

const DataTable: FC<DataTableProps> = ({
  children,
  data = [],
  handleUpdate,
  handleDelete,
}) => {
  if (!data?.length) return;

  return (
    <>
      <Table columns={columns}>
        {data?.map((data, i) => {
          return (
            <TableRow key={i}>
              <TableCell text={generateRowNumBn(i)} />
              <TableCell text={data?.organizationNameBn || "-"} />
              <TableCell text={data?.organizationNameEn || "-"} />
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
