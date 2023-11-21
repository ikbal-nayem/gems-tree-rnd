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
    await axiosIns.post(OMS_SERVICE+ "organogram-template/save", payload),

  templateClone: async (payload): Promise<any> =>
    await axiosIns.post(
      OMS_SERVICE + "organogram-template/clone/save",
      payload
    ),

  getTemplateList: async (payload): Promise<any> =>
    await axiosIns.post("organogram-template/get-list", payload),

  getTemplateDetailsByTemplateId: async (templateId: string): Promise<any> =>
    await axiosIns.get(
      OMS_SERVICE +
        "organogram-template/get-organogram-template-by-id/" +
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

  templateUpdate: async (payload, templateId): Promise<any> =>
    await axiosIns.put(
      OMS_SERVICE +
        "organogram-template/update-organogram-template-by-id/" +
        templateId,
      payload
    ),
  updateTemplateStatusById: async (templateId, status): Promise<any> =>
    await axiosIns.put(
      OMS_SERVICE +
        "organogram-template/update-template-status-by-id/" +
        templateId +
        "/" +
        status
    ),
  approveTemplateById: async (templateId): Promise<any> =>
    await axiosIns.put(
      OMS_SERVICE + "organogram-template/template-approve/" + templateId
    ),

  getOrganizationList: async (payload: IObject): Promise<any> =>
    await axiosIns.post(OMS_SERVICE + "organization/get-list", payload),

  getOrganizationOrganogramList: async (payload): Promise<any> =>
    await axiosIns.post(
      OMS_SERVICE + "organization-organogram/get-list",
      payload
    ),

  getOrganogramDetailsByOrganogramId: async (
    organogramId: string
  ): Promise<any> =>
    await axiosIns.get(
      OMS_SERVICE +
        "organization-organogram/get-by-organogram-id/" +
        organogramId
    ),

  getOrganizationByType: async (type: string): Promise<any> =>
    await axiosIns.get(OMS_SERVICE + "organization/get-by-org-type/" + type),
};
