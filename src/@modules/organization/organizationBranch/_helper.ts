import { OMSService } from "@services/api/OMS.service";

const initPayload = {
  meta: {
    page: 0,
    limit: 20,
  },
  body: { searchKey: "", isActive: true, isDeleted: false },
};

export const searchOrgList = (searchKey, callback) => {
  initPayload.body = { searchKey, isActive: true, isDeleted: false };
  OMSService.getOrganizationList(initPayload).then((resp) =>
    callback(resp?.body)
  );
};
