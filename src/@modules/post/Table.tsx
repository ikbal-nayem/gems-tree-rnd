import {
  Dropdown,
  DropdownItem,
  ITableHeadColumn,
  Icon,
  Table,
  TableCell,
  TableRow,
} from "@gems/components";
import { COMMON_LABELS, generateRowNumBn, numEnToBn } from "@gems/utils";
import { FC, ReactNode } from "react";

const columns: ITableHeadColumn[] = [
  { title: COMMON_LABELS.SL_NO, minWidth: 50 },
  { title: "নাম", minWidth: 200 },
  { title: "গ্রেড", minWidth: 75 },
  { title: "সার্ভিস/ক্যাডারের ধরণ", minWidth: 75 },
  { title: "সার্ভিস/ক্যাডারের নাম", minWidth: 75 },
  { title: "কোড" },
  { title: "প্রদর্শন ক্রম", minWidth: 50 },
  { title: "এনাম কমিটি", minWidth: 100 },
  { title: COMMON_LABELS.ACTIVE, minWidth: 75 },
  { title: COMMON_LABELS.ACTION },
];

type TableProps = {
  children?: ReactNode;
  data?: any;
  handleUpdate: (data) => void;
  handleDelete: (data) => void;
};

const PostTable: FC<TableProps> = ({
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

              <TableCell
                text={data?.nameBn || COMMON_LABELS.NOT_ASSIGN}
                subText={data?.nameEn}
              />

              <TableCell
                text={data?.grade?.nameBn || COMMON_LABELS.NOT_ASSIGN}
              />

              <TableCell
                text={data?.serviceType?.titleBn || COMMON_LABELS.NOT_ASSIGN}
              />

              <TableCell
                text={data?.cadre?.titleBn || COMMON_LABELS.NOT_ASSIGN}
              />

              <TableCell text={data?.code || COMMON_LABELS.NOT_ASSIGN} />
              <TableCell
                text={numEnToBn(data?.serial || COMMON_LABELS.NOT_ASSIGN)}
              />

              <TableCell isActive={data?.isEnamCommittee} />
              <TableCell isActive={data?.isActive} />
              <TableCell>
                <Dropdown
                  btnIcon={true}
                  btnContent={<Icon icon="more_vert" size={20} />}
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

export default PostTable;
