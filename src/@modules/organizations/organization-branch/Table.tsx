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
  { title: "নাম (বাংলা)", minWidth: 100 },
  { title: "নাম (ইংরেজি)", minWidth: 100 },
  { title: "শাখার নাম (বাংলা)", minWidth: 100 },
  { title: "শাখার নাম (ইংরেজি)", minWidth: 100 },
  { title: "শাখার মেটা ট্যাগ", minWidth: 100 },
  { title: COMMON_LABELS.ACTIVE, minWidth: 75 },
  { title: COMMON_LABELS.ACTION },
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
  const navigate = useNavigate();
  if (!data?.length) return;

  const handleUpdateOrganizationParent = (item) => {
    OMSService.UPDATE.organizationParentByOrgGroupId(item?.id)
      .then((res) => {
        toast.success(res?.message);
      })
      .catch((error) => toast.error(error?.message));
  };

  return (
    <>
      <Table columns={columns}>
        {data?.map((data, i) => {
          return (
            <TableRow key={i}>
              <TableCell text={generateRowNumBn(i)} />
              <TableCell text={data?.organizationNameBn || "-"} />
              <TableCell text={data?.organizationNameEn || "-"} />
              <TableCell text={data?.orgBranchNameBn || "-"} />
              <TableCell text={data?.orgBranchNameEn || "-"} />
              <TableCell text={data?.orgBranchKey || "-"} />
              <TableCell isActive={data?.isActive} />
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

export default DataTable;
