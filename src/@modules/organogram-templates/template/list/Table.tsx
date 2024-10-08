import { ROUTE_L2 } from "@constants/internal-route.constant";
import { ROLES, TEMPLATE_STATUS } from "@constants/template.constant";
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
  useApp,
} from "@gems/components";
import {
  COMMON_LABELS,
  DATE_PATTERN,
  IMeta,
  IObject,
  generateDateFormat,
  generateRowNumBn,
  numEnToBn,
} from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { FC, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LABELS } from "./labels";
// import OrganizationReport from "./organizatioReport";
import { useAuth } from "@context/Auth";
import TemplateClone from "./clone";

type TableProps = {
  children: ReactNode;
  dataList: any[];
  isLoading: boolean;
  respMeta?: IMeta;
  getDataList: () => void;
  onDelete: (data) => void;
  organizationGroupList?: IObject[];
};

const TemplateTable: FC<TableProps> = ({
  children,
  dataList,
  isLoading,
  respMeta,
  getDataList,
  onDelete,
  organizationGroupList,
}) => {
  const [template, setTemplate] = useState<any>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onClose = () => setIsOpen(false);
  const { currentUser } = useAuth();
  const { userRoles } = useApp();
  // const [templateId, setTemplateId] = useState<string>("");
  // const [isReportOpen, setReportOpen] = useState<boolean>(false);
  // const [attachedOrgList, setAttachedOrgList] = useState<IObject[]>([]);
  // const onReportClose = () => {
  //   setAttachedOrgList(null);
  //   setReportOpen(false);
  // };
  const onClone = (template) => {
    setTemplate(template);
    setIsOpen(true);
  };

  const columns: ITableHeadColumn[] = [
    { title: COMMON_LABELS.SL_NO, width: 50 },
    { title: LABELS.NAME, width: 250 },
    { title: LABELS.ORGANOGRAM_DATE, width: 50 },
    { title: LABELS.IS_ENAM_COMMITTEE, width: 50, align: "center" },
    // { title: LABELS.STATUS, width: 100, align: "center" },
    { title: COMMON_LABELS.ACTION, width: 80, align: "end" },
  ];

  const navigate = useNavigate();
  const navigateToDetails = (item: IObject) => {
    OMSService.getCheckUserOrgPermissionByTemplateId(item?.id)
      .then((resp) => {
        if (resp?.body) {
          navigate(ROUTE_L2.ORG_TEMPLATE_UPDATE + "?id=" + item?.id, {
            state: { organizationId: item?.organizationId || null },
          });
        } else {
          alert("This is not your organogram");
        }
      })
      .catch(() =>
        navigate(ROUTE_L2.ORG_TEMPLATE_UPDATE + "?id=" + item?.id, {
          state: { organizationId: item?.organizationId || null },
        })
      );
  };
  const navigateToView = (id: string) => {
    navigate(ROUTE_L2.ORG_TEMPLATE_VIEW + "?id=" + id, {
      state: { templateView: true },
    });
  };

  // const onReportView = (item) => {
  //   setTemplateId(item?.id);
  //   if (item?.id) {
  //     OMSService.getAttachedOrganizationByTemplateId(item?.id)
  //       .then((resp) => {
  //         if (!notNullOrUndefined(resp?.body) || resp?.body?.length < 1) {
  //           toast.warning("কোন প্রতিষ্ঠান সংযুক্ত করা হয় নি ...");
  //           return;
  //         }
  //         setAttachedOrgList(resp?.body || []);

  //         if (resp?.body?.length === 1) {
  //           navigate(ROUTE_L2.ORG_TEMPLATE_VIEW + "?id=" + item?.id, {
  //             state: resp?.body?.[0],
  //           });
  //         } else {
  //           setReportOpen(true);
  //         }
  //       })
  //       .catch((e) => console.log(e?.message));
  //   }
  // };

  return (
    <>
      {dataList?.length ? (
        <Table columns={columns}>
          {dataList?.map((item, idx) => {
            let visibleCustomPermission =
              (item?.status === TEMPLATE_STATUS.NEW &&
                item?.createdBy === currentUser?.id) ||
              userRoles?.some((d) => d?.roleCode === ROLES.OMS_ADMIN);
            return (
              <TableRow key={idx}>
                <TableCell
                  text={generateRowNumBn(idx, respMeta)}
                  verticalAlign="top"
                />
                <TableCell
                  text={item?.titleEn || COMMON_LABELS.NOT_ASSIGN}
                  subText={numEnToBn(item?.titleBn) || null}
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
                <TableCell
                  textAlign="center"
                  isActive={item?.isEnamCommittee}
                />
                {/* <TableCell>
                <div className="d-flex justify-content-center">
                  <Tag
                    title={item?.status || COMMON_LABELS.NOT_ASSIGN}
                    color={
                      statusColorMapping(
                        item?.status || "IN_REVIEW",
                        "class"
                      ) as IColors
                    }
                  />
                </div>
              </TableCell> */}
                <TableCell textAlign="end" verticalAlign="top">
                  <Dropdown
                    btnIcon={true}
                    btnContent={<Icon icon="more_vert" size={20} />}
                    id={item?.id}
                  >
                    <DropdownItem onClick={() => navigateToView(item?.id)}>
                      <Icon size={19} icon="visibility" />
                      <h6 className="mb-0 ms-2">বিস্তারিত দেখুন</h6>
                    </DropdownItem>

                    <ACLWrapper
                      visibleToRoles={[
                        ROLES.OMS_ADMIN,
                        ROLES.OMS_TEMPLATE_ENTRY,
                      ]}
                      visibleCustom={visibleCustomPermission}
                    >
                      <DropdownItem onClick={() => navigateToDetails(item)}>
                        <Icon size={19} icon="edit" />
                        <h6 className="mb-0 ms-2">সম্পাদনা করুন</h6>
                      </DropdownItem>
                    </ACLWrapper>

                    <DropdownItem onClick={() => onClone(item)}>
                      <Icon size={19} icon="file_copy" />
                      <h6 className="mb-0 ms-2">ক্লোন করুন</h6>
                    </DropdownItem>
                    {/* <DropdownItem onClick={() => onReportView(item)}>
                    <Icon size={19} icon="summarize" />
                    <h6 className="mb-0 ms-2">অর্গানোগ্রাম দেখুন</h6>
                  </DropdownItem> */}
                    <ACLWrapper
                      visibleToRoles={[
                        ROLES.OMS_ADMIN,
                        ROLES.OMS_TEMPLATE_ENTRY,
                      ]}
                      visibleCustom={visibleCustomPermission}
                    >
                      <DropdownItem onClick={() => onDelete(item)}>
                        <Icon size={19} icon="delete" color="danger" />
                        <h6 className="mb-0 ms-2 text-danger">মুছে ফেলুন</h6>
                      </DropdownItem>
                    </ACLWrapper>
                  </Dropdown>
                </TableCell>
                {/* <TableCell
                text={item?.createdBy || COMMON_LABELS.NOT_ASSIGN}
                subText={currentUser?.id || COMMON_LABELS.NOT_ASSIGN}
              /> */}
              </TableRow>
            );
          })}
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
        organizationGroupList={organizationGroupList}
      />
      {/* <OrganizationReport
        isOpen={isReportOpen}
        onClose={onReportClose}
        templateId={templateId}
        orgList={attachedOrgList}
      /> */}
    </>
  );
};

export default TemplateTable;
