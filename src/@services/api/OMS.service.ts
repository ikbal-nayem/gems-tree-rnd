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

  getOrganogramDetailsByOrganogramId: async (
    organogramId: string
  ): Promise<any> =>
    await axiosIns.get(
      OMS_SERVICE +
        "organization-organogram/get-by-organogram-id/" +
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
  },

  UPDATE: {
    orgPostConfig: async (payload): Promise<any> =>
      await axiosIns.put(OMS_SERVICE + "org-post/update", payload),
  },

  DELETE: {
    organogramByID: async (id: string): Promise<any> => {
      await axiosIns.delete(
        OMS_SERVICE + "organogram-template/delete-organogram-by-id/" + id
      );
    },
  },

  getOrganizationTypeList: async (payload): Promise<any> =>
    await axiosIns.post(OMS_SERVICE + "organization-type/get-list", payload),
  organizationTypeCreate: async (payload): Promise<any> =>
    await axiosIns.post(OMS_SERVICE + "organization-type/create", payload),

  organizationTypeUpdate: async (payload): Promise<any> =>
    await axiosIns.put(OMS_SERVICE + "organization-type/update", payload),

  organizationTypeDelete: async (payload): Promise<any> =>
    await axiosIns.put(OMS_SERVICE + "organization-type/delete-all", payload),
};
