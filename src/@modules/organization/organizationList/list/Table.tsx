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
  generateDateFormat,
  generateRowNumBn,
} from "@gems/utils";
import { FC, ReactNode } from "react";

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
  data?: any;
  handleUpdate: (data) => void;
  handleDelete: (data) => void;
  meta?: IMeta;
};

const OrgTable: FC<OrgTableProps> = ({
  children,
  data = [],
  handleUpdate,
  handleDelete,
  meta,
}) => {
  if (!data?.length) return;
  return (
    <>
      <Table columns={columns}>
        {data?.map((data, i) => {
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
                      {data?.location?.titleBn || COMMON_LABELS.NOT_ASSIGN}
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
                  data?.organizationTypeDTO?.orgTypeBn ||
                  COMMON_LABELS.NOT_ASSIGN
                }
              />
              <TableCell
                text={
                  data?.organizationGroupDTO?.orgGroupBn ||
                  COMMON_LABELS.NOT_ASSIGN
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
