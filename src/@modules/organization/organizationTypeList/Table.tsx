import {
  Dropdown,
  DropdownItem,
  ITableHeadColumn,
  Icon,
  Table,
  TableCell,
  TableRow,
} from "@gems/components";
import { COMMON_LABELS, generateRowNumBn } from "@gems/utils";
import { FC, ReactNode } from "react";

const columns: ITableHeadColumn[] = [
  { title: COMMON_LABELS.SL_NO, minWidth: 50 },
  // { title: "ধরণ (বাংলা)", minWidth: 100 },
  // { title: "ধরণ (ইংরেজি)", minWidth: 100 },
  { title: "নাম (বাংলা)", minWidth: 100 },
  { title: "নাম (ইংরেজি)", minWidth: 100 },
  { title: "প্রতিষ্ঠানের ধরণ", minWidth: 100 },
  { title: "গ্রুপ অভিভাবক", minWidth: 100 },
  // { title: "কোড", minWidth: 75 },
  { title: COMMON_LABELS.ACTIVE, minWidth: 75 },
  { title: COMMON_LABELS.ACTION },
];

type GradeTableProps = {
  children?: ReactNode;
  data?: any;
  handleUpdate: (data) => void;
  handleDelete: (data) => void;
};

const GradeTable: FC<GradeTableProps> = ({
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
              {/* <TableCell text={data?.orgTypeBn || COMMON_LABELS.NOT_ASSIGN} /> */}
              {/* <TableCell text={data?.orgTypeEn || COMMON_LABELS.NOT_ASSIGN} /> */}
              <TableCell text={data?.nameBn || COMMON_LABELS.NOT_ASSIGN} />
              <TableCell text={data?.nameEn || COMMON_LABELS.NOT_ASSIGN} />
              <TableCell
                text={data?.parent?.nameBn || COMMON_LABELS.NOT_ASSIGN}
              />
              <TableCell
                text={data?.parentGroup?.nameBn || COMMON_LABELS.NOT_ASSIGN}
              />
              {/* <TableCell text={data?.code || COMMON_LABELS.NOT_ASSIGN} /> */}

              <TableCell>
                {data?.isActive ? (
                  <Icon icon="done" color="success" size={16} />
                ) : (
                  <Icon icon="close" color="danger" size={16} />
                )}
              </TableCell>
              <TableCell>
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

export default GradeTable;
