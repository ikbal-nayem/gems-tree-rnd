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

export const makeBoolean = (cData) => {
  let data = { ...cData };
  Object.keys(data).forEach(
    (d) =>
      (data[d] =
        data[d] === "true" ? true : data[d] === "false" ? false : data[d])
  );
  return data;
};

export const removeObjectEmptyProperty = (
  obj: IObject,
  removeEmptyObj: boolean = false
) => {
  let params: IObject = {};
  const removable = ["", "null", "undefined", null, undefined];
  Object.keys(obj).forEach((key: string) => {
    if (removeEmptyObj && obj[key] instanceof Object) {
      if (!isObjectNull(obj[key])) params[key] = obj[key];
      else return;
    }
    if (!removable.includes(obj[key])) params[key] = obj[key];
  });
  return params;
};

export const makeFormData = (reqData: IObject) => {
  let data = { ...reqData };
  const fd = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] instanceof File) {
      fd.append(key, data[key]);
      delete data[key];
    } else if (data[key] instanceof FileList) {
      for (const k of Object.keys(data[key])) fd.append(key, data[key][k]);
      delete data[key];
    }
  });
  fd.append("body", JSON.stringify(data));
  return fd;
};

export const makeObjectToString = (dataObj, ignore = []) => {
  let data = { ...dataObj };
  Object.keys(data).forEach(
    (key) =>
      (data[key] =
        !ignore.includes(key) &&
        data[key] instanceof Object &&
        !data[key]?.previewUrl
          ? JSON.stringify(data[key])
          : data[key])
  );
  return data;
};

// Make parse object from 'string object' inside a object
export const makeStringToObject = (dataObj, params) => {
  let data = { ...dataObj };
  params.forEach((p) => {
    data[p] = data?.[p] ? JSON.parse(data[p]) : null;
  });
  return data;
};

// Make timestamp object from 'string time' inside a object
export const makeTimestamp = (dataObj, params) => {
  let data = { ...dataObj };
  params.forEach((p) => {
    data[p] = data?.[p] ? new Date(data[p]).getTime() : null;
  });
  return data;
};

export const objectToQueryString = (obj: IObject) => {
  const keys = Object.keys(obj);
  const keyValuePairs = keys.map((key) => {
    return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
  });
  return keyValuePairs.join("&");
};
