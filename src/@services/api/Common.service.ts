import { EMSPMIS_SERVICE } from "@gems/utils";
import { axiosIns } from "config/api.config";

export const CommonService = {
  checkDraft: async (): Promise<any> =>
    await axiosIns.get(EMSPMIS_SERVICE + "draft/has-draft"),
};
