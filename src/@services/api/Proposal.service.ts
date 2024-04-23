import { OMS_SERVICE } from "@gems/utils";
import { axiosIns } from "config/api.config";

export const ProposalService = {
  // ======================= FETCH API =================================
  FETCH: {
    organogramDetailsByOrganogramId: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + "organization-organogram/get-by-organogram-id/" + id
      ),

    inventoryByOrganogramId: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE +
          "organogram-template/get-organogram-inventory-list-group-by-type/" +
          id
      ),

    manpowerSummaryById: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE +
          "organogram-template/get-summary-manpower-list-by-organogramId/" +
          id
      ),

    nodeWisePresentManpowerById: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE +
          "organogram-proposal/get-proposal-present-manpower-by-id/" +
          id
      ),

    nodeWiseProposedManpowerById: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + "organogram-proposal/get-proposal-manpower-by-id/" + id
      ),

    manpowerPresentSummaryById: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE +
          "organogram-proposal/get-proposal-present-manpower-summary-by-id/" +
          id
      ),

    manpowerProposedSummaryById: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE +
          "organogram-proposal/get-proposal-manpower-summary-by-id/" +
          id
      ),

    nodeWiseManpowerById: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE +
          "organization-organogram/get-proposal-node-manpower-by/" +
          id
      ),

    attachedOrganizationById: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE +
          "organization-organogram/get-attached-by-organogram-id/" +
          id
      ),

    parentOrganizationByOrgId: async (organizationId: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + "organization-organogram/get-parent-org/" + organizationId
      ),

    manpowerDifferenceByOrganogram: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE +
          "organization-organogram/summary-manpower-difference-by-organogram/" +
          id
      ),

    miscellaneousPointByOrganogramId: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + "miscellaneous-point/get-by-organogram-id/" + id
      ),

    abbreviationByOrganogramId: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + "abbreviation/get-by-organogram-id/" + id
      ),

    mainActivityByOrganogramId: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + "main-activity/get-by-organogram-id/" + id
      ),

    businessOfAllocationByOrganogramId: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + "business-allocation/get-by-organogram-id/" + id
      ),

    organogramChangeTypeList: async (payload): Promise<any> =>
      await axiosIns.post(
        OMS_SERVICE + "organogram-change-action-type/get-list",
        payload
      ),
  },

  // ======================= SAVE API =================================

  SAVE: {
    // orgPostConfig: async (payload): Promise<any> =>
    //   await axiosIns.post(OMS_SERVICE + "org-post/save", payload),

    organogramChangeType: async (payload): Promise<any> =>
      await axiosIns.post(
        OMS_SERVICE + "organogram-change-action-type/create",
        payload
      ),
  },

  // ======================= UPDATE API =================================

  UPDATE: {
    statusByOrganogramId: async (id, status, payload): Promise<any> =>
      await axiosIns.put(
        OMS_SERVICE +
          "organogram-template/update-template-status-by-id/" +
          id +
          "/" +
          status,
        payload
      ),

    approveOrganogramById: async (id): Promise<any> =>
      await axiosIns.put(
        OMS_SERVICE + "organogram-template/template-approve/" + id
      ),

    proposalOrganogramUpdate: async (payload): Promise<any> =>
      await axiosIns.put(
        OMS_SERVICE + "organogram-template/update-proposed-organogram-by-id",
        payload
      ),

    organogramChangeType: async (payload): Promise<any> =>
      await axiosIns.put(
        OMS_SERVICE + "organogram-change-action-type/update",
        payload
      ),
  },

  // ======================= DELETE API =================================

  DELETE: {
    proposedOrganogramByID: async (id: string): Promise<any> =>
      await axiosIns.delete(
        OMS_SERVICE + "/organogram-proposal/delete-by-id/" + id
      ),
    organogramChangeType: async (payload): Promise<any> =>
      await axiosIns.put(
        OMS_SERVICE + "organogram-change-action-type/delete-all",
        payload
      ),
  },
};
