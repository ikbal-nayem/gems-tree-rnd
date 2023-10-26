import { topProgress } from "@gems/components";
import { TemplateListPDFcontent } from "./pdf";
import { generatePDF } from "@gems/utils";

export const downloadAsPDF = (reqPayload, totalRecords) => {
	topProgress.show();
	const req = { ...reqPayload };
	// ReportService.getDCPromotableEmployeeList({
	// 	...req,
	// 	meta: { ...req.meta, limit: totalRecords },
	// })
	// 	.then((resp) =>
	// 		generatePDF(TemplateListPDFcontent(resp?.body, reqPayload?.body))
	// 	)
	// 	.finally(() => topProgress.hide());
};
