import {
  ACLWrapper,
  Dropdown,
  DropdownItem,
  Icon,
  ITableHeadColumn,
  Table,
  TableCell,
  TableRow,
} from "@gems/components";
import { COMMON_LABELS, generateRowNumBn, ROLES } from "@gems/utils";
import { FC, ReactNode } from "react";

const columns: ITableHeadColumn[] = [
  { title: COMMON_LABELS.SL_NO, minWidth: 50 },
  { title: "নাম", minWidth: 200 },
  { title: "এনাম কমিটি?", minWidth: 75 },
  { title: "সক্রিয়?", minWidth: 75 },
  { title: "বাতিল?", minWidth: 75 },
  { title: "মন্তব্য", minWidth: 100 },
  { title: COMMON_LABELS.ACTION },
];

type TableProps = {
  children?: ReactNode;
  data?: any;
  handleUpdate: (data) => void;
  handleDelete: (data) => void;
  handleApprovedModel: (data) => void;
};

const OrgPostTable: FC<TableProps> = ({
  children,
  data = [],
  handleUpdate,
  handleDelete,
  handleApprovedModel,
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
                text={data?.postNameBn || COMMON_LABELS.NOT_ASSIGN}
                subText={data?.postNameEn}
              />
              <TableCell isActive={data?.isEnum} />
              <TableCell isActive={data?.isActive} />
              <TableCell isActive={data?.isRejected} />
              <TableCell text={data?.remarks} />
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

                  <ACLWrapper visibleToRoles={[ROLES.SUPER_ADMIN]}>
                    <DropdownItem
                      onClick={() => {
                        handleApprovedModel(data);
                      }}
                    >
                      <Icon size={19} icon="approval" />
                      <h6 className="mb-0 ms-3">অনুমোদন</h6>
                    </DropdownItem>
                  </ACLWrapper>

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

export default OrgPostTable;
