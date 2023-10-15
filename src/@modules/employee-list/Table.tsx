import {
	ContentPreloader,
	ITableHeadColumn,
	IconButton,
	NoData,
	Table,
	TableCell,
	TableRow,
	useEmployeeProfile,
} from "@gems/components";
import {
	COMMON_LABELS,
	DATE_PATTERN,
	IMeta,
	IObject,
	generateDateFormat,
	generateRowNumBn,
	numEnToBn,
	prepareDuration,
} from "@gems/utils";
import { FC, ReactNode } from "react";
import { LABELS } from "./labels";

type EmployeeReportTableProps = {
	children: ReactNode;
	dataList: any[];
	isLoading: boolean;
	respMeta?: IMeta;
	filterProps?: IObject;
};

const EmployeeReportTable: FC<EmployeeReportTableProps> = ({
	children,
	dataList,
	isLoading,
	respMeta,
	filterProps,
}) => {
	const { viewProfile } = useEmployeeProfile();

	const columns: ITableHeadColumn[] = [
		{ title: COMMON_LABELS.SL_NO, width: 50, align: "center" },
		{ title: LABELS.GOVID, width: 75, align: "center" },
		{
			title: LABELS.NAME,
			width: 250,
		},
		{ title: LABELS.POST, width: 200 },
		{ title: "প্রোফাইল", width: 80, align: "end" },
	];

	return (
		<>
			{dataList?.length ? (
				<Table columns={columns}>
					{dataList?.map((item, idx) => (
						<TableRow key={idx}>
							<TableCell
								text={generateRowNumBn(idx, respMeta)}
								textAlign="center"
								verticalAlign="top"
							/>
							<TableCell
								text={numEnToBn(item?.govtId) || "-"}
								textAlign="center"
								verticalAlign="top"
							/>
							<TableCell verticalAlign="top">
								<h6>{item?.nameBn || COMMON_LABELS.NOT_ASSIGN}</h6>
								<span>জেলা (নিজ): {item?.ownDistrict}</span>
								<br />
								<span>জেলা (স্পাউস): {item?.spouseHomeDistrict}</span>
								<br />
								<span>ব্যাচ: {item?.batchName}</span>
								<br />
								<span>
									প্র.যো.তা:&nbsp;
									{generateDateFormat(
										item?.joiningDate,
										DATE_PATTERN.GOVT_STANDARD
									)}
								</span>
								<br />
								<span>
									জন্ম তারিখ:&nbsp;
									{generateDateFormat(
										item?.dateOfBirth,
										DATE_PATTERN.GOVT_STANDARD
									)}
								</span>
								<br />
								<span>
									পিআরএল:&nbsp;
									{generateDateFormat(
										item?.prlDate,
										DATE_PATTERN.GOVT_STANDARD
									)}
								</span>
								<br />
								<span>বয়স: {prepareDuration(item.age)}</span>
								<br />
								<span>
									মা.প্ৰ.চা.কাল:&nbsp;
									{prepareDuration(item.fieldOfficeTotalDuration)}
								</span>
							</TableCell>
							<TableCell verticalAlign="top">
								<span>{item?.postNameBn},</span>
								<br />
								<span>{item?.orgNameBn}</span>
								<br />
								<span>
									যোগদান:&nbsp;
									{generateDateFormat(
										item?.presentPostingJoinDate,
										DATE_PATTERN.GOVT_STANDARD
									)}
									&nbsp;({prepareDuration(item?.durationFromPresentPosting)})
								</span>
							</TableCell>
							<TableCell>{prepareDuration(item?.totalDuration)}</TableCell>
							<TableCell textAlign="end" verticalAlign="top">
								<IconButton
									iconName="visibility"
									color="primary"
									onClick={() => viewProfile(item?.employeeId)}
								/>
							</TableCell>
						</TableRow>
					))}
				</Table>
			) : isLoading ? (
				<ContentPreloader />
			) : (
				<NoData details="কোনো কর্মকর্তা/কর্মচারীর তথ্য পাওয়া যায়নি!" />
			)}
			{children}
		</>
	);
};

export default EmployeeReportTable;
