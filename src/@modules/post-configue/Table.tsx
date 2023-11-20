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
import { COMMON_LABELS, IMeta, generateRowNumBn } from "@gems/utils";

const columns: ITableHeadColumn[] = [
  { title: COMMON_LABELS.SL_NO, minWidth: 50 },
  { title: "পদ", minWidth: 100 },
  { title: "মন্ত্রণালয়", minWidth: 100 },
  { title: "সার্ভিস/ক্যাডারের ধরণ", minWidth: 75 },
  { title: "সার্ভিস/ক্যাডারের নাম", minWidth: 75 },
  { title: "গ্রেড", minWidth: 75 },
  { title: COMMON_LABELS.ACTIVE, minWidth: 75 },
  { title: COMMON_LABELS.ACTION },
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
          return (
						<TableRow key={i}>
							<TableCell text={generateRowNumBn(i, meta)} />
							<TableCell
								text={data?.rank?.titleBn || COMMON_LABELS.NOT_ASSIGN}
								subText={data?.rank?.titleEn}
								tagText={data?.isEntryRank ? "প্রারম্ভিক পদ" : null}
								tagColor="info"
							/>

							<TableCell
								text={data?.ministry?.nameBn || COMMON_LABELS.NOT_ASSIGN}
								subText={data?.ministry?.nameEn}
							/>

							<TableCell
								text={data?.serviceType?.titleBn || COMMON_LABELS.NOT_ASSIGN}
							/>

							<TableCell
								text={data?.cadre?.titleBn || COMMON_LABELS.NOT_ASSIGN}
							/>

							<TableCell
								text={data?.grade?.nameBn || COMMON_LABELS.NOT_ASSIGN}
							/>

							{/* Active */}
							<TableCell>
								{data?.isActive ? (
									<Icon icon="done" color="success" size={20} />
								) : (
									<Icon icon="close" color="danger" size={20} />
								)}
							</TableCell>

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

export default RankMinistryTable;
