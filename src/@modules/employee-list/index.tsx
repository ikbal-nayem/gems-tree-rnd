import { PageTitle } from "@context/PageData";
import {
	DownloadMenu,
	Pagination,
	Separator,
} from "@gems/components";
import {
	IMeta,
	IObject,
	numEnToBn,
	searchParamsToObject,
} from "@gems/utils";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Filter from "./Filter";
import EmployeeReportTable from "./Table";
import { downloadAsPDF } from "./downloads";
import { MENU } from "@constants/menu-titles.constant";

const initPayload = {
	meta: {
		page: 0,
		limit: 10,
		sort: [{ order: "asc", field: "govtId" }],
	},
	body: { searchKey: "" },
};

const EmployeeList = () => {
	const [employeeList, setEmployeeList] = useState<IObject[]>();
	const [respMeta, setRespMeta] = useState<IMeta>();
	const [isLoading, setLoading] = useState<boolean>(false);
	const [searchParams] = useSearchParams();
	const reqPayload = useRef(initPayload);
	const isInit = useRef<boolean>(true);
	const filterProps = useRef<IObject>({});

	useEffect(() => {
		const params = searchParamsToObject(searchParams);
		if (params?.page || params?.limit)
			reqPayload.current.meta = {
				...reqPayload.current.meta,
				page: +params?.page || 0,
				limit: +params?.limit || 10,
			};
		// if (!isInit.current) getEmployeeList();
		else isInit.current = false;
	}, [searchParams]);

	const onFilter = (filterBody) => {
		filterProps.current = filterBody;
		reqPayload.current.meta.page = 0;
		reqPayload.current.body = { ...reqPayload.current.body, ...filterBody };
		// getEmployeeList();
	};

	// const getEmployeeList = () => {
	// 	topProgress.show();
	// 	setLoading(true);
	// 	ReportService.getDCPromotableEmployeeList(reqPayload.current)
	// 		.then((resp) => {
	// 			setEmployeeList(resp?.body);
	// 			setRespMeta(resp?.meta);
	// 		})
	// 		.catch((err) => {
	// 			toast.error(err?.message);
	// 			setEmployeeList([]);
	// 			setRespMeta({});
	// 		})
	// 		.finally(() => {
	// 			topProgress.hide();
	// 			setLoading(false);
	// 		});
	// };

	return (
		<>
			<PageTitle> {MENU.BN.EMPLOYEE_LIST} </PageTitle>
			<div className="card p-4">
				<Filter onFilter={onFilter} />
				<Separator />
				{!!employeeList?.length && (
					<div className="d-flex justify-content-between gap-3">
						<div />
						<div className="text-primary text-center">
							{!!filterProps?.current?.batchToDto?.length && (
								<>
									<br />
									<span>
										ব্যাচ:&nbsp;
										{filterProps?.current?.batchToDto
											?.sort((a, b) => +a?.code - +b?.code)
											?.map((b) => b?.titleBn)
											.join(", ")}
									</span>
								</>
							)}
							<h5 className="my-3">
								মোট {numEnToBn(respMeta?.totalRecords)} জন
							</h5>
						</div>
						<DownloadMenu
							fnDownloadPDF={() =>
								downloadAsPDF(reqPayload.current, respMeta?.totalRecords)
							}
						/>
					</div>
				)}
				<EmployeeReportTable
					dataList={employeeList}
					respMeta={respMeta}
					isLoading={isLoading}
					filterProps={filterProps.current}
				>
					<Pagination meta={respMeta} pageNeighbours={2} setSearchParams />
				</EmployeeReportTable>
			</div>
		</>
	);
};

export default EmployeeList;
