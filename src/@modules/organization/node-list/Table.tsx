import { MENU } from "@constants/menu-titles.constant";
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
  DATE_PATTERN,
  generateDateFormat,
  generateRowNumBn,
  numEnToBn,
} from "@gems/utils";
import { FC, ReactNode } from "react";

const columns: ITableHeadColumn[] = [
  { title: COMMON_LABELS.SL_NO, minWidth: 50 },
  // { title: "ধরণ (বাংলা)", minWidth: 100 },
  // { title: "ধরণ (ইংরেজি)", minWidth: 100 },
  { title: "পদবি/স্তর", minWidth: 100 },
  { title: "অভিভাবক", minWidth: 100 },
  { title: "জনবল", minWidth: 75 },
  { title: "অর্গানোগ্রাম তারিখ", minWidth: 75 }, 
  { title: COMMON_LABELS.ACTION, align: "end" },
];

type GradeTableProps = {
  children?: ReactNode;
  data?: any;
  // handleUpdate: (data) => void;
  // handleDelete: (data) => void;
};

const DataTable: FC<GradeTableProps> = ({
  children,
  data = [],
  // handleUpdate,
  // handleDelete,
}) => {
  if (!data?.length) return;
  return (
    <>
      <Table columns={columns}>
        {data?.map((data, i) => {
          return (
            <TableRow key={i}>
              <TableCell text={generateRowNumBn(i)} />
              {/* <TableCell text={data?.orgTypeBn || COMMON_LABELS.NOT_ASSIGN} /> */}
              <TableCell text={data?.orgTypeEn || COMMON_LABELS.NOT_ASSIGN} />
              <TableCell text={data?.parentName || COMMON_LABELS.NOT_ASSIGN} />
              <TableCell text={numEnToBn(data?.manpower)|| COMMON_LABELS.NOT_ASSIGN} />
              <TableCell
                text={
                  data?.organogramDate
                    ? generateDateFormat(
                        data?.organogramDate,
                        DATE_PATTERN.GOVT_STANDARD
                      )
                    : COMMON_LABELS.NOT_ASSIGN
                }
              />
              
              {/* <TableCell text={data?.parentDTO?.nameBn || COMMON_LABELS.NOT_ASSIGN}/> */}
              {/* <TableCell text={data?.code || COMMON_LABELS.NOT_ASSIGN} /> */}
              <TableCell textAlign="end">
                <Dropdown
                  btnIcon={true}
                  btnContent={<Icon icon="more_vert" size={20} />}
                  id={"data?.id"}
                >
                  <DropdownItem
                    onClick={() => {
                      // handleUpdate(data);
                    }}
                  >
                    <Icon size={19} icon="edit" />
                    <h6 className="mb-0 ms-3">সম্পাদনা করুন</h6>
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      // handleDelete(data);
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
