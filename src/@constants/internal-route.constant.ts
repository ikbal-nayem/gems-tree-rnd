export const ROUTE_L1 = {
  DASHBOARD: "/dashboard",
  ORG_TEMPLATE: "/organogram-template",
  OMS_ORGANOGRAM: "/organogram",
  OMS_ORG_EMPLOYEE_LIST: "/employee-list",
  OMS_POST_CONFIG: "/post-config",
  OMS_MASTER_POST: "/master-post",
  OMS_ORGANIZATION: "/organization",
  OMS_CONFIGURATION: "/configuration",
  OMS_AUDIT_LOG: "/audit-log",
};
export const ROUTE_L2 = {
  ORG_TEMPLATE_CREATE: ROUTE_L1.ORG_TEMPLATE + "/create",
  ORG_EXIST_ORGANOGRAM_CREATE:
    ROUTE_L1.ORG_TEMPLATE + "/exist-organogram-create",
  ORG_TEMPLATE_UPDATE: ROUTE_L1.ORG_TEMPLATE + "/update",
  ORG_TEMPLATE_VIEW: ROUTE_L1.ORG_TEMPLATE + "/view",
  ORG_TEMPLATE_LIST: ROUTE_L1.ORG_TEMPLATE + "/list",
  ORG_TEMPLATE_NODE_CREATE: ROUTE_L1.ORG_TEMPLATE + "/node-create",
  ORG_TEMPLATE_NODE_UPDATE: ROUTE_L1.ORG_TEMPLATE + "/node-update",
  OMS_ORGANOGRAM_NODE_LIST: ROUTE_L1.ORG_TEMPLATE + "/organogram-node-list",
  OMS_ORGANOGRAM_MAIN_ACTIVITY:
    ROUTE_L1.ORG_TEMPLATE + "/organogram-main-activity",
  OMS_ORGANOGRAM_ALLOCATION_OF_BUSINESS:
    ROUTE_L1.ORG_TEMPLATE + "/organogram-allocation-of-business",
  OMS_ORGANOGRAM_APPROVED_LIST: ROUTE_L1.OMS_ORGANOGRAM + "/approved-list",
  OMS_ORGANOGRAM_DRAFT_LIST: ROUTE_L1.OMS_ORGANOGRAM + "/draft-list",
  OMS_ORGANOGRAM_INREVIEW_LIST: ROUTE_L1.OMS_ORGANOGRAM + "/inreview-list",
  OMS_ORGANOGRAM_INAPPROVE_LIST: ROUTE_L1.OMS_ORGANOGRAM + "/inapprove-list",
  OMS_ORGANOGRAM_VIEW: ROUTE_L1.OMS_ORGANOGRAM + "/view",
  OMS_ORGANIZATION_LIST: ROUTE_L1.OMS_ORGANIZATION + "/list",
  OMS_ORGANIZATION_TYPE: ROUTE_L1.OMS_ORGANIZATION + "/type",
  OMS_ORGANIZATION_GROUP: ROUTE_L1.OMS_ORGANIZATION + "/group",
  OMS_ORGANIZATION_GROUP_ORG_LIST:
    ROUTE_L1.OMS_ORGANIZATION + "/group/org-list",
  OMS_ORGANIZATION_MAIN_ACTIVITY: ROUTE_L1.OMS_ORGANIZATION + "/main-activity",
  OMS_ORGANIZATION_BUSINESS_OF_ALLOCATION:
    ROUTE_L1.OMS_ORGANIZATION + "/business-of-allocation",
  OMS_ORGANIZATION_NODE_LIST: ROUTE_L1.OMS_ORGANIZATION + "/node-list",
  OMS_ORGANIZATION_BRANCH: ROUTE_L1.OMS_ORGANIZATION + "/branch",
  OMS_CONFIGURATION_ORGANOGRAM_APPROVER_LIST:
    ROUTE_L1.OMS_CONFIGURATION + "/orgm-approver-list",
  OMS_CONFIGURATION_ORGANOGRAM_POST_LIST:
    ROUTE_L1.OMS_CONFIGURATION + "/unapprove-post-list",
  OMS_AUDIT_LOG_ORGANOGRAM_LOG: ROUTE_L1.OMS_AUDIT_LOG + "/log-organogram",
  OMS_AUDIT_LOG_ORGANOGRAM_VIEW: ROUTE_L1.OMS_AUDIT_LOG + "/view",

  // Proposal Organogram Routes
  OMS_PROPOSAL_LIST: ROUTE_L1.OMS_ORGANOGRAM + "/proposal-list",
  OMS_ORGANOGRAM_PROPOSAL_VIEW: ROUTE_L1.OMS_ORGANOGRAM + "/proposal-view",
  OMS_ORGANOGRAM_PROPOSAL_UPDATE: ROUTE_L1.OMS_ORGANOGRAM + "/proposal-update",
  OMS_ORGANOGRAM_PROPOSAL_NODE_LIST:
    ROUTE_L1.OMS_ORGANOGRAM + "/proposal-node-list",
  ORG_ORGANOGRAM_PROPOSAL_NODE_CREATE:
    ROUTE_L1.OMS_ORGANOGRAM + "/proposal-node-create",
  ORG_ORGANOGRAM_PROPOSAL_NODE_UPDATE:
    ROUTE_L1.OMS_ORGANOGRAM + "/proposal-node-update",
  OMS_ORGANOGRAM_PROPOSAL_MAIN_ACTIVITY:
    ROUTE_L1.OMS_ORGANOGRAM + "/proposal-main-activity",
  OMS_ORGANOGRAM_PROPOSAL_ALLOCATION_OF_BUSINESS:
    ROUTE_L1.OMS_ORGANOGRAM + "/proposal-allocation-of-business",
  OMS_ORGANOGRAM_CHANGE_TYPE_LIST:
    ROUTE_L1.OMS_ORGANOGRAM + "/change-type-list",
  OMS_ORGANOGRAM_CHECKLIST: ROUTE_L1.OMS_ORGANOGRAM + "/checklist",
};
