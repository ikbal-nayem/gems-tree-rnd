import { TEMPLATE_STATUS } from "../@constants/template.constant";

export const statusColorMapping = (
	status: string,
	color_type: "code" | "class" = "class"
) => {
	const isCode = color_type === "code";
	if (status === TEMPLATE_STATUS.APPROVED)
		return isCode ? "#D0ECE7" : "success";
	if (status === TEMPLATE_STATUS.IN_REVIEW)
		return isCode ? "#D6EAF8" : "info";
	// if (
	// 	status === APPLICATION_STATUS.EMS_APPLICATION_STATUS_RETURNED_FOR_REVIEW ||
	// 	status === APPLICATION_STATUS.EMS_APPLICATION_STATUS_RETURNED ||
	// 	status === APPLICATION_STATUS.EMS_APPLICATION_STATUS_REJECTED
	// )
	// 	return isCode ? "#FADBD8" : "danger";
	// if (
	// 	status === APPLICATION_STATUS.EMS_APPLICATION_STATUS_ACCEPTED_FOR_REVIEW ||
	// 	status === APPLICATION_STATUS.EMS_APPLICATION_STATUS_ACCEPTED_FOR_APPROVAL
	// )
	// 	return isCode ? "#EAEDED" : "dark";
	// if (status === APPLICATION_STATUS.EMS_APPLICATION_STATUS_PENDING_FOR_REVIEW)
	// 	return isCode ? "#FAE5D3" : "warning";

	return isCode ? "#EAEDED" : "dark";
};
