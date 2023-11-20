import { CORE_SERVICE } from "@gems/utils";
import { axiosIns } from "config/api.config";

export const CoreService = {
  getByMetaTypeList: async (metaType: string): Promise<any> =>
    await axiosIns.get(
      CORE_SERVICE + "master-meta/get-by-meta-type/" + metaType
    ),

  getGrades: async (): Promise<any> =>
    await axiosIns.get(CORE_SERVICE + "grade/get"),
};
