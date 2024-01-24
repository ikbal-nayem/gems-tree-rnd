import { ROUTE_L2 } from "@constants/internal-route.constant";
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
  toast,
} from "@gems/components";
import {
  COMMON_LABELS,
  DATE_PATTERN,
  IColors,
  IMeta,
  IObject,
  generateDateFormat,
  generateRowNumBn,
  notNullOrUndefined,
} from "@gems/utils";
import { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { statusColorMapping } from "utility/colorMap";
import { statusMapper } from "utility/textMapping";
import { LABELS } from "./labels";
// import OrganogramClone from "./organogramClone";
import { ROLES, TEMPLATE_STATUS } from "@constants/template.constant";
import { OMSService } from "@services/api/OMS.service";

type TableProps = {
  children: ReactNode;
  dataList: any[];
  isLoading: boolean;
  respMeta?: IMeta;
  // getDataList: () => void;
  onDelete: (data) => void;
  status: "draft" | "inreview" | "inapprove" | "approved";
};

const OrganogramTable: FC<TableProps> = ({
  children,
  dataList,
  isLoading,
  respMeta,
  // getDataList,
  onDelete,
  status,
}) => {
  const onOrganogramView = (item: IObject) => {
    if (item?.id) {
      OMSService.getAttachedOrganizationByTemplateId(item?.id)
        .then((resp) => {
          if (!notNullOrUndefined(resp?.body) || resp?.body?.length < 1) {
            toast.warning("কোন প্রতিষ্ঠান সংযুক্ত করা হয় নি ...");
            return;
          }

          if (resp?.body?.length === 1) {
            navigate(ROUTE_L2.ORG_TEMPLATE_VIEW + "?id=" + item?.id, {
              state: resp?.body?.[0],
            });
          }
        })
        .catch((e) => console.log(e?.message));
    }
  };
  let columns: ITableHeadColumn[] =
    status === "draft"
      ? [
          { title: COMMON_LABELS.SL_NO, width: 50 },
          { title: LABELS.ORGANIZATION_NAME, width: 250 },
          { title: LABELS.ORGANOGRAM_DATE, width: 100 },
          { title: LABELS.STATUS, width: 100, align: "center" },
          { title: COMMON_LABELS.ACTION, width: 80, align: "end" },
        ]
      : [
          { title: COMMON_LABELS.SL_NO, width: 50 },
          { title: LABELS.ORGANIZATION_NAME, width: 250 },
          { title: LABELS.ORGANOGRAM_DATE, width: 100 },
          { title: COMMON_LABELS.ACTION, width: 80, align: "end" },
        ];

  const navigate = useNavigate();
  const navigateToDetails = (item: IObject) => {
    OMSService.getCheckUserOrgPermissionByTemplateId(item?.id)
      .then((resp) => {
        if (resp?.body) {
          navigate(ROUTE_L2.ORG_TEMPLATE_UPDATE + "?id=" + item?.id, {
            state: {
              organizationId: item?.organizationId || null,
              draftListRecord: true,
            },
          });
        } else {
          alert("This is not your organogram");
        }
      })
      .catch(() =>
        navigate(ROUTE_L2.ORG_TEMPLATE_UPDATE + "?id=" + item?.id, {
          state: {
            organizationId: item?.organizationId || null,
            draftListRecord: true,
          },
        })
      );
  };
  // const onTemplateView = (id: string) => {
  //   navigate(ROUTE_L2.ORG_TEMPLATE_VIEW + "?id=" + id);
  // };

  // const [template, setTemplate] = useState<any>();
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  // const onClose = () => setIsOpen(false);
  // const onClone = (template) => {
  //   setTemplate(template);
  //   setIsOpen(true);
  // };

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
                  item?.isEnamCommittee
                    ? "Enam Committe Report (26/12/1982)"
                    : item?.organogramDate
                    ? generateDateFormat(
                        item?.organogramDate,
                        DATE_PATTERN.GOVT_STANDARD
                      ) + " রিপোর্ট"
                    : COMMON_LABELS.NOT_ASSIGN
                }
              />

              {status === "draft" && (
                <TableCell
                  tagText={
                    statusMapper(item?.status) || COMMON_LABELS.NOT_ASSIGN
                  }
                  textAlign="center"
                  tagColor={
                    statusColorMapping(
                      item?.status || "IN_REVIEW",
                      "class"
                    ) as IColors
                  }
                />
              )}
              <TableCell textAlign="end" verticalAlign="top">
                <Dropdown
                  btnIcon={true}
                  btnContent={<Icon icon="more_vert" size={20} />}
                  id={item?.id}
                >
                  <DropdownItem onClick={() => onOrganogramView(item)}>
                    <Icon size={19} icon="summarize" />
                    <h6 className="mb-0 ms-2">বিস্তারিত দেখুন</h6>
                  </DropdownItem>
                  {/* <DropdownItem onClick={() => onOrganogramView(item)}>
                    <Icon size={19} icon="visibility" />
                    <h6 className="mb-0 ms-2">
                      {status === "draft"
                        ? "অর্গানোগ্রাম দেখুন"
                        : "বিস্তারিত দেখুন"}
                    </h6>
                  </DropdownItem> */}
                  {/* <DropdownItem onClick={() => onClone(item)}>
                    <Icon size={19} icon="file_copy" />
                    <h6 className="mb-0 ms-3">ডুপ্লিকেট করুন</h6>
                  </DropdownItem> */}
                  <ACLWrapper
                    visibleToRoles={[ROLES.OMS_TEMPLATE_ENTRY]}
                    visibleCustom={item?.status === TEMPLATE_STATUS.NEW}
                  >
                    <DropdownItem onClick={() => navigateToDetails(item)}>
                      <Icon size={19} icon="edit" />
                      <h6 className="mb-0 ms-2">সম্পাদনা করুন</h6>
                    </DropdownItem>
                    <DropdownItem onClick={() => onDelete(item)}>
                      <Icon size={19} icon="delete" color="danger" />
                      <h6 className="mb-0 ms-2 text-danger">মুছে ফেলুন</h6>
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
        <NoData details="কোনো অর্গানোগ্রামের তথ্য পাওয়া যায়নি!" />
      )}
      {children}
    </>
  );
};

export default OrganogramTable;
