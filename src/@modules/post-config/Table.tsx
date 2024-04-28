import {
  Dropdown,
  DropdownItem,
  ITableHeadColumn,
  Icon,
  Table,
  TableCell,
  TableRow,
} from "@gems/components";
import { FC, ReactNode } from "react";
import {
  COMMON_LABELS,
  DATE_PATTERN,
  IMeta,
  generateDateFormat,
  generateRowNumBn,
} from "@gems/utils";

const columns: ITableHeadColumn[] = [
  { title: COMMON_LABELS.SL_NO, minWidth: 50 },
  { title: "পদবি", minWidth: 100 },
  { title: "প্রতিষ্ঠান", minWidth: 100 },
  { title: "অর্গানোগ্রাম তারিখ", minWidth: 75 },
  { title: "সার্ভিসের ধরন", minWidth: 75 },
  //   { title: "সার্ভিস/ক্যাডারের নাম", minWidth: 75 },
  { title: "গ্রেড", minWidth: 75 },
  { title: COMMON_LABELS.ACTION, align: "end" },
];

type TrainingOrgTableProps = {
  children?: ReactNode;
  data?: any;
  handleUpdate: (data) => void;
  handleDelete: (data) => void;
  meta?: IMeta;
};

const RankMinistryTable: FC<TrainingOrgTableProps> = ({
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
          const serviceType = data?.serviceTypeDto?.metaKey;
          return (
            <TableRow key={i}>
              <TableCell text={generateRowNumBn(i, meta)} />
              <TableCell
                text={data?.postDTO?.nameBn || COMMON_LABELS.NOT_ASSIGN}
                subText={data?.postDTO?.nameEn}
              />

              <TableCell
                text={data?.organization?.nameBn || COMMON_LABELS.NOT_ASSIGN}
                subText={data?.organization?.nameEn || ""}
              />

              <TableCell
                text={
                  data?.organogramDate
                    ? generateDateFormat(
                        data?.organogramDate,
                        DATE_PATTERN.GOVT_STANDARD
                      )
                    : COMMON_LABELS.NOT_ASSIGN
                }
              />

              <TableCell
                tagText={
                  data?.serviceTypeDto?.titleBn || COMMON_LABELS.NOT_ASSIGN
                }
                tagColor={
                  serviceType === "SERVICE_TYPE_CADRE"
                    ? "info"
                    : serviceType === "SERVICE_TYPE_NON_CADRE"
                    ? "dark"
                    : "danger"
                }
              />
              {/* <TableCell
                text={data?.serviceTypeDto?.titleBn || COMMON_LABELS.NOT_ASSIGN}
                subText={data?.serviceTypeDto?.titleEn || ""}
              /> */}

              {/* <TableCell
                text={data?.cadre?.titleBn || COMMON_LABELS.NOT_ASSIGN}
                subText={data?.cadre?.titleEn || ""}
              /> */}

              <TableCell
                text={data?.gradeDTO?.nameBn || COMMON_LABELS.NOT_ASSIGN}
                subText={data?.gradeDTO?.nameEn || ""}
              />

              {/* Action */}
              <TableCell textAlign="end">
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

export default RankMinistryTable;
