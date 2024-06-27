import { IObject, OMS_SERVICE } from "@gems/utils";
import { axiosIns } from "config/api.config";

export const OMSService = {
  getPostList: async (): Promise<any> =>
    await axiosIns.get(OMS_SERVICE + "org-post/get-post-list"),

  getInventoryTypeList: async (): Promise<any> =>
    await axiosIns.get(OMS_SERVICE + "inventory-type/list"),

  getInventoryItemListByType: async (inventoryTypeId: string): Promise<any> =>
    await axiosIns.get(
      OMS_SERVICE + "inventory-item/get-by-inventory-type-id/" + inventoryTypeId
    ),

  templateCreate: async (payload): Promise<any> =>
    await axiosIns.post(OMS_SERVICE + "organogram-template/save", payload),

  templateClone: async (payload): Promise<any> =>
    await axiosIns.post(
      OMS_SERVICE + "organogram-template/clone/save",
      payload
    ),

  getTemplateList: async (payload): Promise<any> =>
    await axiosIns.post(
      OMS_SERVICE + "organogram-template/custom/get-list",
      payload
    ),

  getTemplateDetailsByTemplateId: async (templateId: string): Promise<any> =>
    await axiosIns.get(
      OMS_SERVICE +
        "organogram-template/get-organogram-template-by-id/" +
        templateId
    ),
  getDetailsWithDeletedDataByTemplateId: async (
    templateId: string
  ): Promise<any> =>
    await axiosIns.get(
      OMS_SERVICE +
        "organogram-template/get-organogram-template-by-id-with-is-deleted/" +
        templateId
    ),
  getCheckUserOrgPermissionByTemplateId: async (
    templateId: string
  ): Promise<any> =>
    await axiosIns.get(
      OMS_SERVICE +
        "organogram-template/check-user-org-organogram/" +
        templateId
    ),

  getAttachedOrganizationByTemplateId: async (
    templateId: string
  ): Promise<any> =>
    await axiosIns.get(
      OMS_SERVICE +
        "organogram-template/get-attached-organizations/" +
        templateId
    ),

  getTemplateInventoryByTemplateId: async (templateId: string): Promise<any> =>
    await axiosIns.get(
      OMS_SERVICE +
        "organogram-template/get-organogram-inventory-list-group-by-type/" +
        templateId
    ),

  getTemplateManpowerSummaryById: async (templateId: string): Promise<any> =>
    await axiosIns.get(
      OMS_SERVICE +
        "organogram-template/get-summary-manpower-list-by-organogramId/" +
        templateId
    ),
  getAttachedOrganizationById: async (templateId: string): Promise<any> =>
    await axiosIns.get(
      OMS_SERVICE +
        "organization-organogram/get-attached-by-organogram-id/" +
        templateId
    ),
  getOrganizationParentByOrgId: async (organizationId: string): Promise<any> =>
    await axiosIns.get(
      OMS_SERVICE + "organization-organogram/get-parent-org/" + organizationId
    ),
  getAttachedOrganizationByTemplateAndOrgId: async (
    templateId: string,
    orgId
  ): Promise<any> =>
    await axiosIns.get(
      OMS_SERVICE +
        "organogram-template/get-attached-by-organogram-temp-id-org-id/" +
        templateId +
        "/" +
        orgId
    ),

  duplicateTemplateTitleCheck: async (
    title: string,
    isEn: boolean
  ): Promise<any> =>
    await axiosIns.get(
      OMS_SERVICE +
        "organogram-template/get-organogram-template-is-exist/" +
        isEn +
        "/" +
        title
    ),

  templateUpdate: async (payload): Promise<any> =>
    await axiosIns.put(
      OMS_SERVICE + "organogram-template/update-organogram-template-by-id",
      payload
    ),
  updateTemplateStatusById: async (templateId, status, payload): Promise<any> =>
    await axiosIns.put(
      OMS_SERVICE +
        "organogram-template/update-template-status-by-id/" +
        templateId +
        "/" +
        status,
      payload
    ),
  approveTemplateById: async (templateId): Promise<any> =>
    await axiosIns.put(
      OMS_SERVICE + "organogram-template/template-approve/" + templateId
    ),

  getOrganizationList: async (payload: IObject): Promise<any> =>
    await axiosIns.post(OMS_SERVICE + "organization/get-list", payload),

  getPreviousOrganizationList: async (payload: IObject): Promise<any> =>
    await axiosIns.post(
      OMS_SERVICE + "organization/previous/get-list",
      payload
    ),

  getEnamOrganizationList: async (payload: IObject): Promise<any> =>
    await axiosIns.post(OMS_SERVICE + "organization/enum/get-list", payload),

  getOrganizationCustomList: async (payload: IObject): Promise<any> =>
    await axiosIns.post(OMS_SERVICE + "organization/custom/get-list", payload),

  getOrganogramDetailsByOrganogramId: async (
    organogramId: string
  ): Promise<any> =>
    await axiosIns.get(
      OMS_SERVICE +
        "organization-organogram/get-by-organogram-id/" +
        organogramId
    ),

  getOrganogramWithOutDeletionAdditionByOrganogramId: async (
    organogramId: string
  ): Promise<any> =>
    await axiosIns.get(
      OMS_SERVICE +
        "organization-organogram/get-approved-organogram/" +
        organogramId
    ),
  getVersionListByOrganogramId: async (organogramId: string): Promise<any> =>
    await axiosIns.get(
      OMS_SERVICE +
        "organization-organogram/get-by-organogram-version-id/" +
        organogramId
    ),

  getOrganizationByType: async (type: string): Promise<any> =>
    await axiosIns.get(OMS_SERVICE + "organization/get-by-org-type/" + type),

  getTreeByParentOrganization: async (payload: string): Promise<any> =>
    await axiosIns.get(
      OMS_SERVICE + "organization/get-tree-by-parent/" + payload
    ),
  getOrgByTypes: async (payload: string): Promise<any> =>
    await axiosIns.get(
      OMS_SERVICE + "organization/get-by-org-types/" + payload
    ),
  organizationCreate: async (payload): Promise<any> =>
    await axiosIns.post(OMS_SERVICE + "organization/create", payload),

  organizationUpdate: async (payload): Promise<any> =>
    await axiosIns.put(OMS_SERVICE + "organization/update", payload),

  FETCH: {
    organizationById: async (id): Promise<any> =>
      await axiosIns.get(OMS_SERVICE + "organization/get-by-id/" + id),

    orgPostConfig: async (payload): Promise<any> =>
      await axiosIns.post(OMS_SERVICE + "org-post/get-list", payload),

    nodeTitle: async (): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + "organogram-template/get-organogram-title"
      ),

    childOrgByLoggedUser: async (): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + "organization/get-child-org-by-logged-user"
      ),

    manpowerDifferenceByOrganogram: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE +
          "organization-organogram/summary-manpower-difference-by-organogram/" +
          id
      ),

    organogramProposalList: async (payload): Promise<any> =>
      await axiosIns.post(
        OMS_SERVICE + "organogram-proposal/get-list",
        payload
      ),

    draftOrganogramList: async (payload): Promise<any> =>
      await axiosIns.post(
        OMS_SERVICE + "organogram-template/custom/draft/get-list",
        payload
      ),

    inReviewOrganogramList: async (payload): Promise<any> =>
      await axiosIns.post(
        OMS_SERVICE + "organogram-template/custom/review/get-list",
        payload
      ),

    inApproveOrganogramList: async (payload): Promise<any> =>
      await axiosIns.post(
        OMS_SERVICE + "organogram-template/custom/approve/get-list",
        payload
      ),

    organogramList: async (payload): Promise<any> =>
      await axiosIns.post(
        OMS_SERVICE + "organization-organogram/custom/get-list",
        payload
      ),

    organizationTypeList: async (): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + "organization-category/get-all-org-type"
      ),

    organizationGroupbyOrgType: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE +
          "organization-category/get-all-org-group-by-org-type-id/" +
          id
      ),

    organizationsByGroupId: async (id): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + "organization/get-all-org-by-org-group-id/" + id
      ),

    organizationParentListByOrgType: async (payload): Promise<any> =>
      await axiosIns.post(
        OMS_SERVICE + "organization/get-parent-list-by-org-group-level",
        payload
      ),
    organizationParentListByOrgGroup: async (payload: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + "organization/get-list-by-org-group/" + payload
      ),

    organogramNodeList: async (payload): Promise<any> =>
      await axiosIns.post(
        OMS_SERVICE + "organogram-custom-structure/custom/get-list",
        payload
      ),

    mainActivityList: async (payload): Promise<any> =>
      await axiosIns.post(
        OMS_SERVICE + "organogram-main-activity/get-list",
        payload
      ),

    mainActivityListByOrgId: async (id): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE +
          "organization-organogram/get-latest-main-activity-by/" +
          id
      ),

    allocationOfBusinessListByOrgId: async (id): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE +
          "organization-organogram/get-latest-business-allocation-by/" +
          id
      ),

    nodeParentListByOrganogramId: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + "organogram-structure/get-all-by-organogram-id/" + id
      ),
    nodeDetailsById: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + "organogram-structure/get-all-by-structure-id/" + id
      ),

    organizationGroupList: async (): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + "organization-category/get-all-org-group"
      ),

    organizationCategoryList: async (payload): Promise<any> =>
      await axiosIns.post(
        OMS_SERVICE + "organization-category/get-list",
        payload
      ),

    ministryDivisionDepartmentList: async (): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + "organization/get-ministry-division-and-departmentOf"
      ),

    organogramMainActivityById: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + "organogram-main-activity/get-by-organogram-id/" + id
      ),

    organogramBusinessAllocationById: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE +
          "organogram-business-allocation/get-by-organogram-id/" +
          id
      ),

    oranizationTreeByOrganizationId: async (
      organizationId: string
    ): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + "organization/get-organization-tree/" + organizationId
      ),

    orgGroupTreeByOrganizationId: async (
      organizationId: string
    ): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + "organization/get-sum-organization/" + organizationId
      ),
    organizationBranchList: async (payload): Promise<any> =>
      await axiosIns.post(
        OMS_SERVICE + "organization-branch/get-org-branch-list",
        payload
      ),
    approveUserList: async (): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + "organization-organogram/get-oms-approved-user"
      ),
  },

  SAVE: {
    orgPostConfig: async (payload): Promise<any> =>
      await axiosIns.post(OMS_SERVICE + "org-post/save", payload),

    organogramProposal: async (payload): Promise<any> =>
      await axiosIns.post(OMS_SERVICE + "organogram-proposal/save", payload),

    organogramClone: async (payload): Promise<any> =>
      await axiosIns.post(
        OMS_SERVICE + "organization-organogram/clone/save",
        payload
      ),
    organogramSingleNodeCreate: async (payload): Promise<any> =>
      await axiosIns.post(
        OMS_SERVICE + "/organogram-structure/single-save",
        payload
      ),

    organizationType: async (payload): Promise<any> =>
      await axiosIns.post(
        OMS_SERVICE + "organization-category/create",
        payload
      ),

    organogramMainActivity: async (payload): Promise<any> =>
      await axiosIns.post(
        OMS_SERVICE + "organogram-main-activity/save",
        payload
      ),

    organogramBusinessAllocation: async (payload): Promise<any> =>
      await axiosIns.post(
        OMS_SERVICE + "organogram-business-allocation/save",
        payload
      ),

    organizationBranch: async (payload): Promise<any> =>
      await axiosIns.post(OMS_SERVICE + "organization-branch/create", payload),
  },

  UPDATE: {
    orgPostConfig: async (payload): Promise<any> =>
      await axiosIns.put(OMS_SERVICE + "org-post/update", payload),

    organogramSingleNodeById: async (
      id: string,
      payload: IObject
    ): Promise<any> =>
      await axiosIns.put(
        OMS_SERVICE +
          "organogram-structure/update-single-organogram-structure-by-id/" +
          id,
        payload
      ),

    organizationType: async (payload): Promise<any> =>
      await axiosIns.put(OMS_SERVICE + "organization-category/update", payload),

    organogramMainActivity: async (payload): Promise<any> =>
      await axiosIns.put(
        OMS_SERVICE + "organogram-main-activity/update",
        payload
      ),

    organogramBusinessAllocation: async (payload): Promise<any> =>
      await axiosIns.put(
        OMS_SERVICE + "organogram-business-allocation/update",
        payload
      ),

    organizationParentByOrgGroupId: async (groupId: string): Promise<any> =>
      await axiosIns.put(
        OMS_SERVICE +
          "organization-category/update-org-parent-by-category-grouping-id/" +
          groupId
      ),

    undoOrganogramNodeWithChildById: async (
      nodeId: string,
      organogramId: string
    ): Promise<any> =>
      await axiosIns.put(
        OMS_SERVICE +
          "organogram-template/undo-frompreserved-organogram-structure-by-id/" +
          nodeId +
          "/" +
          organogramId
      ),
  },

  DELETE: {
    organogramByID: async (id: string): Promise<any> => {
      await axiosIns.delete(
        OMS_SERVICE + "organogram-template/delete-organogram-by-id/" + id
      );
    },

    organizationType: async (payload): Promise<any> =>
      await axiosIns.put(
        OMS_SERVICE + "organization-category/delete-all",
        payload
      ),

    organogramMainActivity: async (id): Promise<any> =>
      await axiosIns.delete(
        OMS_SERVICE + "organogram-main-activity/delete-by-id/" + id
      ),

    organogramBusinessAllocation: async (id): Promise<any> =>
      await axiosIns.delete(
        OMS_SERVICE + "organogram-business-allocation/delete-by-id/" + id
      ),

    organogramNodeDeleteById: async (nodeId): Promise<any> =>
      await axiosIns.delete(
        OMS_SERVICE +
          "organogram-structure/delete-organogram-structure-node-by-id/" +
          nodeId
      ),

    organogramNodeWithChildById: async (nodeId): Promise<any> =>
      await axiosIns.delete(
        OMS_SERVICE +
          "organogram-template/delete-organogram-structure-by-id/" +
          nodeId
      ),

    clonedOrganogramNodeWithChildById: async (
      nodeId,
      organogramId
    ): Promise<any> =>
      await axiosIns.delete(
        OMS_SERVICE +
          "organogram-template/delete-clone-frompreserved-organogram-structure-by-id/" +
          nodeId +
          "/" +
          organogramId
      ),

    organizationBranchDeleteById: async (id): Promise<any> => {
      await axiosIns.delete(OMS_SERVICE + "organization-branch/delete/" + id);
    },
  },
};
