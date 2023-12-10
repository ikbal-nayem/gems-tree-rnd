import {
  ACLWrapper,
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
  IColors,
  IMeta,
  generateDateFormat,
  generateRowNumBn,
  statusColorMapping,
} from "@gems/utils";
import { FC, ReactNode, useState } from "react";
import { LABELS } from "./labels";
import { useNavigate } from "react-router-dom";
import TemplateClone from "./clone";
import { ROUTE_L2 } from "@constants/internal-route.constant";
import { ROLES, TEMPLATE_STATUS } from "@constants/template.constant";
import { useAuth } from "@context/Auth";
import OrganizationReport from "./organizatioReport";

type TableProps = {
  children: ReactNode;
  dataList: any[];
  isLoading: boolean;
  respMeta?: IMeta;
  getDataList: () => void;
  onDelete: (data) => void;
};

const TemplateTable: FC<TableProps> = ({
  children,
  dataList,
  isLoading,
  respMeta,
  getDataList,
  onDelete,
}) => {
  const [template, setTemplate] = useState<any>();
  const [templateId, setTemplateId] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isReportOpen, setReportOpen] = useState<boolean>(false);
  const { currentUser } = useAuth();
  const onClose = () => setIsOpen(false);
  const onReportClose = () => setReportOpen(false);
  const onClone = (template) => {
    setTemplate(template);
    setIsOpen(true);
  };

  const columns: ITableHeadColumn[] = [
    { title: COMMON_LABELS.SL_NO, width: 50 },
    { title: LABELS.NAME, width: 250 },
    { title: LABELS.ORGANOGRAM_DATE, width: 100 },
    { title: LABELS.STATUS, width: 150, align: "center" },
    { title: COMMON_LABELS.ACTION, width: 80, align: "end" },
  ];

  const navigate = useNavigate();
  const navigateToDetails = (id: string) => {
    navigate(ROUTE_L2.ORG_TEMPLATE_UPDATE + "?id=" + id);
  };
  const navigateToView = (id: string) => {
    navigate(ROUTE_L2.ORG_TEMPLATE_VIEW + "?id=" + id);
  };

  const onReportView = (item) => {
    setTemplateId(item?.id);
    setReportOpen(true);
  };

  return (
    <>
      {dataList?.length ? (
        <Table columns={columns}>
          {dataList?.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell
                text={generateRowNumBn(idx, respMeta)}
                verticalAlign="top"
              />
              <TableCell
                text={item?.titleBn || COMMON_LABELS.NOT_ASSIGN}
                subText={item?.titleEn || COMMON_LABELS.NOT_ASSIGN}
              />
              <TableCell
                text={
                  item?.organogramDate
                    ? generateDateFormat(
                        item?.organogramDate,
                        DATE_PATTERN.GOVT_STANDARD
                      )
                    : COMMON_LABELS.NOT_ASSIGN
                }
              />
              <TableCell>
                <div className="d-flex justify-content-center">
                  <Tag
                    title={item?.status || COMMON_LABELS.NOT_ASSIGN}
                    color={
                      statusColorMapping(item?.status || "IN_REVIEW") as IColors
                    }
                  />
                </div>
              </TableCell>
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
                  <ACLWrapper
                    visibleToRoles={[
                      ROLES.OMS_TEMPLATE_ENTRY,
                      ROLES.OMS_TEMPLATE_REVIEW,
                    ]}
                    visibleCustom={
                      item?.status === TEMPLATE_STATUS.NEW ||
                      (currentUser?.roles?.some(
                        (r) => r.roleCode === ROLES.OMS_TEMPLATE_REVIEW
                      ) &&
                        item?.status === TEMPLATE_STATUS.IN_REVIEW)
                    }
                  >
                    <DropdownItem onClick={() => navigateToDetails(item?.id)}>
                      <Icon size={19} icon="edit" />
                      <h6 className="mb-0 ms-3">সম্পাদনা করুন</h6>
                    </DropdownItem>
                  </ACLWrapper>
                  <DropdownItem onClick={() => onClone(item)}>
                    <Icon size={19} icon="file_copy" />
                    <h6 className="mb-0 ms-3">ডুপ্লিকেট করুন</h6>
                  </DropdownItem>
                  {/* <DropdownItem onClick={() => onReportView(item)}>
                    <Icon size={19} icon="summarize" />
                    <h6 className="mb-0 ms-3">রিপোর্ট দেখুন</h6>
                  </DropdownItem> */}
                  <ACLWrapper
                    visibleToRoles={[ROLES.OMS_TEMPLATE_ENTRY]}
                    visibleCustom={item?.status === TEMPLATE_STATUS.NEW}
                  >
                    <DropdownItem onClick={() => onDelete(item)}>
                      <Icon size={19} icon="delete" color="danger" />
                      <h6 className="mb-0 ms-3 text-danger">মুছে ফেলুন</h6>
                    </DropdownItem>
                  </ACLWrapper>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      ) : isLoading ? (
        <ContentPreloader />
      ) : (
        // <Table columns={columns}>
        //   <TableRow>
        //     <TableCell />
        //     <TableCell>
        <NoData details="কোনো টেমপ্লেটের তথ্য পাওয়া যায়নি!" />
        //     </TableCell>
        //   </TableRow>
        // </Table>
      )}
      {children}

      <TemplateClone
        isOpen={isOpen}
        onClose={onClose}
        template={template}
        getDataList={getDataList}
      />
      <OrganizationReport
        isOpen={isReportOpen}
        onClose={onReportClose}
        templateId={templateId}
      />
    </>
  );
};

export default TemplateTable;
