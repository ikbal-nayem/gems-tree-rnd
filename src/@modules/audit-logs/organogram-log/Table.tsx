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
} from "@gems/components";
import {
  COMMON_LABELS,
  DATE_PATTERN,
  IMeta,
  generateDateFormat,
  generateRowNumBn,
} from "@gems/utils";
import { FC, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LABELS } from "./labels";
import { ActionLogModal } from "./ActionLogModal";

type TableProps = {
  children: ReactNode;
  dataList: any[];
  isLoading: boolean;
  respMeta?: IMeta;
};

const OrganogramTable: FC<TableProps> = ({
  children,
  dataList,
  isLoading,
  respMeta
}) => {
  let columns: ITableHeadColumn[] = [
    { title: COMMON_LABELS.SL_NO, width: 50 },
    { title: LABELS.ORGANIZATION_NAME, width: 250 },
    { title: LABELS.ORGANOGRAM_DATE, width: 100 },
    { title: "অনুমোদনের তারিখ", width: 100 },
    { title: COMMON_LABELS.ACTION, width: 80, align: "end" },
  ];

  const navigate = useNavigate();
  //   const navigateToDetails = (id: string) => {
  //     navigate(ROUTE_L2.OMS_ORGANOGRAM_VIEW + "?id=" + id);
  //   };
  const navigateToView = (id: string) => {
    navigate(ROUTE_L2.OMS_AUDIT_LOG_ORGANOGRAM_VIEW + "?id=" + id);
  };

  const [organogramId, setOrganogramId] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onClose = () => {
    setIsOpen(false);
    setOrganogramId("");
  };

  const onActivityLog = (item) => {
    setOrganogramId(item?.id);
    setIsOpen(true);
  };

  return (
    <>
      {dataList?.length ? (
        <Table columns={columns}>
          {dataList?.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell text={generateRowNumBn(idx, respMeta)} />
              <TableCell
                text={item?.organizationNameBn || COMMON_LABELS.NOT_ASSIGN}
                subText={item?.organizationNameEn || COMMON_LABELS.NOT_ASSIGN}
              />
              <TableCell
                text={
                  // item?.isEnamCommittee
                  //   ? "Enam Committe Report (26/12/1982)" :
                  item?.organogramDate
                    ? generateDateFormat(
                        item?.organogramDate,
                        DATE_PATTERN.GOVT_STANDARD
                      ) + " রিপোর্ট"
                    : COMMON_LABELS.NOT_ASSIGN
                }
              />
              <TableCell
                text={
                  item?.approverDate
                    ? generateDateFormat(
                        item?.approverDate,
                        DATE_PATTERN.GOVT_STANDARD
                      )
                    : "-"
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
                    <h6 className="mb-0 ms-3">অর্গানোগ্রাম দেখুন</h6>
                  </DropdownItem>
                  <DropdownItem onClick={() => onActivityLog(item)}>
                    <Icon size={19} icon="file_copy" />
                    <h6 className="mb-0 ms-3">কার্যক্রম</h6>
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
        <NoData details="কোনো অর্গানোগ্রামের তথ্য পাওয়া যায়নি!" />
      )}
      {children}
      <ActionLogModal
        title="অর্গানোগ্রামের সংক্রান্ত কার্যক্রম ও মন্তব্য সমূহ"
        isOpen={isOpen}
        onClose={onClose}
        organogramId={organogramId || null}
      />
    </>
  );
};

export default OrganogramTable;
