import { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
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

const columns: ITableHeadColumn[] = [
  { title: COMMON_LABELS.SL_NO, width: 50 },
  { title: "নাম", minWidth: 150 },
  { title: "প্রতিষ্ঠানের ধরণ", minWidth: 100 },
  { title: "সংস্থার ধরণ", minWidth: 100 },
  { title: "সংস্থার গ্রুপ", minWidth: 100 },
  { title: "অভিভাবক", minWidth: 150 },
  { title: "অর্গানোগ্রাম তারিখ", minWidth: 100 },
  { title: COMMON_LABELS.ACTIVE, minWidth: 10, align: "center" },
  { title: COMMON_LABELS.ACTION },
];

type OrgTableProps = {
  children?: ReactNode;
  dataList?: any;
  handleUpdate: (data) => void;
  handleDelete: (data) => void;
  meta?: IMeta;
};

const OrgTable: FC<OrgTableProps> = ({
  children,
  dataList = [],
  handleUpdate,
  handleDelete,
  meta,
}) => {
  const navigate = useNavigate();

  if (!dataList?.length) return;

  const redirectTo = (page: "main_activity" | "aob", org: IObject) => {
    switch (page) {
      case "main_activity":
        navigate(ROUTE_L2.OMS_ORGANIZATION_MAIN_ACTIVITY, {
          state: org,
        });
        break;
      case "aob":
        navigate(ROUTE_L2.OMS_ORGANIZATION_BUSINESS_OF_ALLOCATION, {
          state: org,
        });
        break;
    }
  };
  return (
    <>
      <Table columns={columns}>
        {dataList?.map((data, i) => {
          return (
            <TableRow key={i}>
              <TableCell text={generateRowNumBn(i, meta)} />
              <TableCell
                text={data?.nameBn || COMMON_LABELS.NOT_ASSIGN}
                subText={
                  <>
                    <div>{data?.nameEn}</div>
                    <div>
                      স্থান:&nbsp;
                      {data?.location?.chainBn || COMMON_LABELS.NOT_ASSIGN}
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
                text={data?.officeTypeDTO?.titleBn || COMMON_LABELS.NOT_ASSIGN}
                subText={data?.orgTypeDTO?.titleBn}
              />
              <TableCell
                text={
                  data?.organizationTypeDTO?.nameBn || COMMON_LABELS.NOT_ASSIGN
                }
              />
              <TableCell
                text={
                  data?.organizationGroupDTO?.nameBn || COMMON_LABELS.NOT_ASSIGN
                }
              />
              <TableCell
                text={data?.parent?.nameBn || COMMON_LABELS.NOT_ASSIGN}
                subText={data?.parent?.nameEn}
              />
              <TableCell
                text={
                  data?.organogramDate
                    ? generateDateFormat(
                        data?.organogramDate,
                        "%dd% %MM%, %yyyy%"
                      )
                    : COMMON_LABELS.NO_DATE
                }
              />
              <TableCell textAlign="center">
                {data?.isActive ? (
                  <Icon icon="done" color="success" size={20} />
                ) : (
                  <Icon icon="close" color="danger" size={20} />
                )}
              </TableCell>
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

export default OrgTable;
