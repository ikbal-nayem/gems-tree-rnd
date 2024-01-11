import { CORE_SERVICE } from "@gems/utils";
import { axiosIns } from "config/api.config";

const initPayload = {
  meta: {
    page: 0,
    limit: 10000000,
    sort: [{ order: "asc", field: "createdOn" }],
  },
  body: {},
};

export const CoreService = {
  getByMetaTypeList: async (metaType: string): Promise<any> =>
    await axiosIns.get(
      CORE_SERVICE + "master-meta/get-by-meta-type/" + metaType
    ),

  getGrades: async (): Promise<any> =>
    await axiosIns.get(CORE_SERVICE + "grade/get"),

  getPostList: async (payload = initPayload): Promise<any> =>
    await axiosIns.post(CORE_SERVICE + "post/get-list", payload),
  getLocationBySearch: async (payload): Promise<any> =>
    await axiosIns.post(CORE_SERVICE + "locations/search", payload),
};
