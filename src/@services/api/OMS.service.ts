import { OMS_SERVICE } from "@gems/utils";
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

  getTemplateList: async (payload): Promise<any> =>
    await axiosIns.post(OMS_SERVICE + "organogram-template/get-list", payload),

  getTemplateDetailsByTemplateId: async (templateId: string): Promise<any> =>
    await axiosIns.get(
      OMS_SERVICE +
        "organogram-template/get-0rganogram-template-by-id/" +
        templateId
    ),

  templateUpdate: async (payload): Promise<any> =>
    await axiosIns.post(OMS_SERVICE + "organogram-template/save", payload),
};
