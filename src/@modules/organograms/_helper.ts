import { IObject } from "@gems/utils";

export const no_img =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";

export const makeReqBody = (data, filterKeyMapping): IObject => {
  const reqBody = {};
  Object.keys(data).forEach((key) => {
    if (data[key]) {
      if (typeof data[key] === "string") reqBody[key] = data[key];
      else {
        data[key]?.length
          ? (reqBody[key] = data[key]?.map((obj) =>
              filterKeyMapping?.[key]
                ? obj?.[filterKeyMapping[key]]
                : obj?.metaKey
            ))
          : (reqBody[key] = filterKeyMapping?.[key]
              ? data[key]?.[filterKeyMapping[key]]
              : data[key]?.metaKey || data[key]);
      }
    } else reqBody[key] = data[key];
  });
  return reqBody;
};
