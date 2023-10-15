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

type TableProps = {
	children: ReactNode;
	dataList: any[];
	isLoading: boolean;
	respMeta?: IMeta;
	filterProps?: IObject;
};

const TemplateTable: FC<TableProps> = ({
	children,
	dataList,
	isLoading,
	respMeta,
	filterProps,
}) => {

	const columns: ITableHeadColumn[] = [
		{ title: COMMON_LABELS.SL_NO, width: 50, align: "center" },
		{ title: LABELS.NAME, width: 250 },
		{ title: COMMON_LABELS.ACTION, width: 80, align: "end" },
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

							</TableCell>
							<TableCell verticalAlign="top">

							</TableCell>
							<TableCell>{prepareDuration(item?.totalDuration)}</TableCell>
							<TableCell textAlign="end" verticalAlign="top">
								<IconButton
									iconName="edit"
									iconColor="primary"
									onClick={() => null}
								/>

								<IconButton
									iconName="delete"
									iconColor="danger"
									onClick={() => null}
								/>

							</TableCell>
						</TableRow>
					))}
				</Table>
			) : isLoading ? (
				<ContentPreloader />
			) : (
				<NoData details="কোনো টেমপ্লেটের তথ্য পাওয়া যায়নি!" />
			)}
			{children}
		</>
	);
};

export default TemplateTable;
