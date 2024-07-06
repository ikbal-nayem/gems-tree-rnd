import { IObject, isObjectNull } from "@gems/utils";

export const searchParamsToObject = (searchParams) => {
  let params = {};
  searchParams.forEach(
    (item: string, key: string) =>
      item !== "" &&
      item !== "null" &&
      item !== "undefined" &&
      (params[key] = item)
  );
  return params;
};

export const searchParamsToRequestBody = (
  searchObj: any,
  currentBody?: IObject
) => {
  searchObj = searchParamsToObject(searchObj);
  const bodyIgnore = ["page", "limit"];
  const body: IObject = {};
  Object.keys(searchObj)?.forEach((obj) => {
    if (!bodyIgnore.includes(obj)) {
      body[obj] =
        searchObj[obj].toLowerCase() === "true"
          ? true
          : searchObj[obj].toLowerCase() === "false"
          ? false
          : searchObj[obj];
    }
  });
  const reqBody = {
    meta: {
      page: searchObj?.page || 0,
      limit: searchObj?.limit || currentBody?.meta?.limit || 10,
      orderBy: currentBody?.meta?.orderBy || [],
      filterBy: currentBody?.meta?.filterBy || [],
    },
    body,
  };
  return reqBody;
};

export const objectToQueryString = (obj: IObject) => {
  const keys = Object.keys(obj);
  const keyValuePairs = keys.map((key) => {
    return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
  });
  return keyValuePairs.join("&");
};
