import { OMSService } from "@services/api/OMS.service";

const initPayload = {
  meta: {
    page: 0,
    limit: 1000,
    sort: [{ order: "asc", field: "serialNo" }],
  },
  body: { searchKey: "" },
};

export const searchOrgList = (searchKey, callback) => {
  initPayload.body = { searchKey };
  OMSService.getEnamOrganizationList(initPayload).then((resp) =>
    callback(resp?.body)
  );
};
