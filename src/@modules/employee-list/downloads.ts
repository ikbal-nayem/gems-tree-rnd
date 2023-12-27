// import { ReportService } from "@services/api/Report.service";
import { promotableEmployeePDFcontent } from "./pdf";
import { generatePDF, topProgress } from "@gems/utils";

export const downloadAsPDF = (reqPayload, totalRecords) => {
  topProgress.show();
  const req = { ...reqPayload };
  // ReportService.getDCPromotableEmployeeList({
  // 	...req,
  // 	meta: { ...req.meta, limit: totalRecords },
  // })
  // 	.then((resp) =>
  // 		generatePDF(promotableEmployeePDFcontent(resp?.body, reqPayload?.body))
  // 	)
  // 	.finally(() => topProgress.hide());
};

// export const downloadExcel = (reqPayload, respMeta) => {
// 	topProgress.show();
// 	PMISService.prlDetail({
// 		body: { ...reqPayload },
// 		meta: {
// 			page: 0,
// 			limit: respMeta?.totalRecords,
// 			sort: [{ field: "createdOn", order: "desc" }],
// 		},
// 	})
// 		.then((res) => exportXLSX(exportData(res?.body || []), "Employee list"))
// 		.catch((err) => toast.error(err?.message))
// 		.finally(() => topProgress.hide());
// };

// export const exportData = (data: any[]) =>
// 	data.map((d) => ({
// 		[LABELS.BN.GOVID]: d?.prlYear || COMMON_LABELS.NOT_ASSIGN,
// 		[LABELS.BN.NAME]: d?.secretary || COMMON_LABELS.NOT_ASSIGN,
// 		[LABELS.BN.PRESENTPOSTING]: d?.gradeOne || COMMON_LABELS.NOT_ASSIGN,
// 		[LABELS.BN.JOININGDATE]: d?.assistantSecretary || COMMON_LABELS.NO_DATE,
// 		[LABELS.BN.PRLDATE]: d?.total || COMMON_LABELS.NO_DATE,
// 	}));
