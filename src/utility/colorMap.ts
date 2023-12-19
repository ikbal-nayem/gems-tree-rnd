import { TEMPLATE_STATUS } from "../@constants/template.constant";

export const statusColorMapping = (
  status: string,
  color_type: "code" | "class" = "class"
) => {
  const isCode = color_type === "code";
  if (status === TEMPLATE_STATUS.APPROVED) return isCode ? "#EAEDED" : "dark";
  if (status === TEMPLATE_STATUS.IN_APPROVE)
    return isCode ? "#D0ECE7" : "success";
  if (status === TEMPLATE_STATUS.IN_REVIEW)
    return isCode ? "#FAE5D3" : "warning";
  if (status === TEMPLATE_STATUS.NEW) return isCode ? "#FADBD8" : "danger";

  return isCode ? "#EAEDED" : "dark";
};
