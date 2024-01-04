import { ROUTE_L2 } from "@constants/internal-route.constant";
import {
  ContentPreloader,
  Dropdown,
  DropdownItem,
  ITableHeadColumn,
  Icon,
  NoData,
  Table,
  TableCell,
  TableRow,
  Tag,
} from "@gems/components";
import {
  COMMON_LABELS,
  DATE_PATTERN,
  IMeta,
  generateDateFormat,
  generateRowNumBn,
} from "@gems/utils";
import { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { LABELS } from "./labels";
import { TIME_PATTERN } from "@constants/common.constant";

type TableProps = {
  children: ReactNode;
  dataList: any[];
  isLoading: boolean;
  respMeta?: IMeta;
};

const ProposalTable: FC<TableProps> = ({
  children,
  dataList,
  isLoading,
  respMeta,
}) => {
  const columns: ITableHeadColumn[] = [
    { title: COMMON_LABELS.SL_NO, width: 50 },
    { title: LABELS.BN.SENDER, width: 250 },
    { title: LABELS.BN.TOPIC, width: 150 },
    { title: LABELS.BN.STATUS, width: 100 },
    { title: LABELS.BN.RECEIVED_DATE_TIME, width: 100 },
    { title: COMMON_LABELS.ACTION, width: 80, align: "end" },
  ];

  const navigate = useNavigate();
  //   const navigateToDetails = (id: string) => {
  //     navigate(ROUTE_L2.OMS_ORGANOGRAM_VIEW + "?id=" + id);
  //   };
  const navigateToView = (id: string) => {
    navigate(ROUTE_L2.OMS_ORGANOGRAM_VIEW + "?id=" + id);
  };

  return (
    <>
      {dataList?.length ? (
        <Table columns={columns}>
          {dataList?.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell text={generateRowNumBn(idx, respMeta)} />
              <TableCell
                text={
                  item?.proposedOrganization?.nameBn || COMMON_LABELS.NOT_ASSIGN
                }
                subText={item?.proposedOrganization?.nameEn || null}
              />
              <TableCell
                text={item?.subjects?.map((i) => i.titleBn).join(" , ") || COMMON_LABELS.NOT_ASSIGN}
                // subText={item?.subjects?.map((i) => i.titleEn).join(" , ")  || null}
              />
              <TableCell>
                <Tag
                  title={item?.status === "NEW" ? "অপেক্ষমান" : item?.status}
                  color={item?.status === "NEW" ? "primary" : "dark"}
                />
              </TableCell>
              <TableCell
                text={
                  generateDateFormat(
                    item?.proposedDate,
                    DATE_PATTERN.GOVT_STANDARD
                  ) || COMMON_LABELS.NOT_ASSIGN
                }
                subText={
                  generateDateFormat(item?.proposedDate, TIME_PATTERN.HM12) ||
                  null
                }
              />

              <TableCell textAlign="end" verticalAlign="top">
                <Dropdown
                  btnIcon={true}
                  btnContent={<Icon icon="more_vert" size={20} />}
                  id={item?.id}
                >
                  <DropdownItem onClick={() => navigateToView(item?.id)}>
                    <Icon size={19} icon="visibility" />
                    <h6 className="mb-0 ms-3">দেখুন</h6>
                  </DropdownItem>
                  {/* <DropdownItem onClick={() => null}>
                    <Icon size={19} icon="edit" />
                    <h6 className="mb-0 ms-3">সম্পাদনা করুন</h6>
                  </DropdownItem> */}
                  {/* <DropdownItem onClick={() => null}>
                    <Icon size={19} icon="delete" color="danger" />
                    <h6 className="mb-0 ms-3 text-danger">মুছে ফেলুন</h6>
                  </DropdownItem> */}
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      ) : isLoading ? (
        <ContentPreloader />
      ) : (
        <NoData details="কোনো প্রস্তাবের তথ্য পাওয়া যায়নি!" />
      )}
      {children}
    </>
  );
};

export default ProposalTable;
