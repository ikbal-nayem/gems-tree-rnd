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

    equipmentsPresentById: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE +
          "organogram-proposal/get-proposal-present-inventory-misle-by-id/" +
          id
      ),

    equipmentsProposedById: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE +
          "organogram-proposal/get-proposal-inventory-misle-by-id/" +
          id
      ),

    attachOrganizationsPresentById: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE +
          "organogram-proposal/get-proposal-present-attached-org-by-id/" +
          id
      ),

    attachOrganizationsProposedById: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE +
          "organogram-proposal/get-proposal-attached-org-by-id/" +
          id
      ),

    nodeWiseManpowerById: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE +
          "organization-organogram/get-proposal-node-manpower-by/" +
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

    organogramChecklist: async (payload): Promise<any> =>
      await axiosIns.post(OMS_SERVICE + "org-check-list/get-list", payload),

    changeTypesByOrganogramId: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE +
          "organogram-change-action-type/get-all-change-type-by-orgmid/" +
          id
      ),

    checklistByChangeTypeId: async (
      changeTypeId: string,
      organogramId: string
    ): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE +
          `org-check-list/get-grouping-by-change-type-id/${changeTypeId}/${organogramId}`
      ),

    letterDetailsById: async (letterId: string): Promise<any> =>
      await axiosIns.get(OMS_SERVICE + `letter-builder/get-by-id/${letterId}`),

    getDraftLetterByOrganogramId: async (id: string): Promise<any> =>
      await axiosIns.get(
        OMS_SERVICE + `orgm-draft-letter-builder/get-by-orgm-id/${id}`
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

    organogramChecklist: async (payload): Promise<any> =>
      await axiosIns.post(OMS_SERVICE + "org-check-list/save", payload),

    proposalChecklist: async (payload): Promise<any> =>
      await axiosIns.post(OMS_SERVICE + "proposal-check-list/save", payload),

    draftLetterCreate: async (payload): Promise<any> =>
      await axiosIns.post(
        OMS_SERVICE + "orgm-draft-letter-builder/create",
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

    organogramChecklist: async (payload): Promise<any> =>
      await axiosIns.put(OMS_SERVICE + "org-check-list/update", payload),
  },

  // ======================= DELETE API =================================

  DELETE: {
    proposedOrganogramByID: async (id: string): Promise<any> =>
      await axiosIns.delete(
        OMS_SERVICE + "/organogram-proposal/delete-by-id/" + id
      ),

    organogramChangeType: async (id: string): Promise<any> =>
      await axiosIns.delete(
        OMS_SERVICE + "organogram-change-action-type/delete/" + id
      ),

    organogramChecklist: async (payload): Promise<any> =>
      await axiosIns.put(OMS_SERVICE + "org-check-list/delete-all", payload),
  },
};
