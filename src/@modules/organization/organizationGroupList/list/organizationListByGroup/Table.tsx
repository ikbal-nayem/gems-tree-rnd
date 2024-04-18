import { ROUTE_L2 } from "@constants/internal-route.constant";
import { MENU } from "@constants/menu-titles.constant";
import {
  Dropdown,
  DropdownItem,
  ITableHeadColumn,
  Icon,
  Table,
  TableCell,
  TableRow,
} from "@gems/components";
import {
  COMMON_LABELS,
  IMeta,
  IObject,
  generateDateFormat,
  generateRowNumBn,
} from "@gems/utils";
import { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const columns: ITableHeadColumn[] = [
  { title: COMMON_LABELS.SL_NO, width: 50 },
  { title: "প্রতিষ্ঠানের নাম", minWidth: 150 },
  { title: "প্রতিষ্ঠানের পর্যায়", minWidth: 100 },
  { title: "প্রতিষ্ঠানের ধরণ", minWidth: 100 },
  { title: "প্রতিষ্ঠানের গ্রুপ", minWidth: 100 },
  { title: "প্রতিষ্ঠানের অভিভাবক", minWidth: 150 },
  { title: "অর্গানোগ্রাম তারিখ", minWidth: 100 },
  { title: COMMON_LABELS.ACTIVE, minWidth: 10, align: "center" },
  // { title: COMMON_LABELS.ACTION },
];

type OrgTableProps = {
  children?: ReactNode;
  dataList?: any;
  meta?: IMeta;
};

const OrgTable: FC<OrgTableProps> = ({ children, dataList = [], meta }) => {
  const navigate = useNavigate();

  if (!dataList?.length) return;
  return (
    <>
      <Table columns={columns}>
        {dataList?.map((data, i) => {
          return (
            <TableRow key={i}>
              <TableCell text={generateRowNumBn(i, meta)} />
              <TableCell
                text={data?.nameBn || "-"}
                subText={
                  <>
                    <div>{data?.nameEn}</div>
                    <div>
                      {/* স্থান:&nbsp; */}
                      {data?.locationChainNameBn || "-"}
                    </div>
                  </>
                }
                tagText={
                  data?.trainingOfficeTag === "TRAINING"
                    ? "প্রশিক্ষণ প্রতিষ্ঠান"
                    : null
                }
                tagColor={"info"}
              />
              <TableCell
                text={data?.orgLevelBn || "-"}
                subText={data?.orgTypeBn}
              />
              <TableCell text={data?.orgCategoryTypeBn || "-"} />
              <TableCell text={data?.orgCategoryGroupBn || "-"} />
              <TableCell
                text={data?.parentOrgNameBn || "-"}
                subText={data?.parentOrgNameEn}
              />
              <TableCell
                text={
                  data?.organogramDate
                    ? generateDateFormat(
                        data?.organogramDate,
                        "%dd% %MM%, %yyyy%"
                      )
                    : "-"
                }
              />
              <TableCell textAlign="center">
                {data?.isActive ? (
                  <Icon icon="done" color="success" size={20} />
                ) : (
                  <Icon icon="close" color="danger" size={20} />
                )}
              </TableCell>
              {/* <TableCell>
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
                    <h6 className="mb-0 ms-3">{COMMON_LABELS.EDIT}</h6>
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => redirectTo("main_activity", data)}
                  >
                    <Icon size={19} icon="list" />
                    <h6 className="mb-0 ms-3">{MENU.BN.MAIN_ACTIVITY_LIST}</h6>
                  </DropdownItem>
                  <DropdownItem onClick={() => redirectTo("aob", data)}>
                    <Icon size={19} icon="list" />
                    <h6 className="mb-0 ms-3">
                      {MENU.BN.ALLOCATION_OF_BUSINESS_LIST}
                    </h6>
                  </DropdownItem>
                </Dropdown>
              </TableCell> */}
            </TableRow>
          );
        })}
      </Table>
      {children}
    </>
  );
};

export default OrgTable;
