import { numEnToBn } from "@gems/utils";

export const placementEnToBn = (val: any) => {
  if (val) {
    let num;
    if (val.includes("st")) {
      num = val.split("st")[0];
      // return num
      if (num === null || num === "") return "তথ্য নেই";
      num = parseInt(num);

      if (num > 9) {
        return numEnToBn(val).replaceAll("st", "তম");
      }
    }
    if (val.includes("nd")) {
      num = val.split("nd")[0];
      if (num === null || num === "") return "তথ্য নেই";
      num = parseInt(num);

      if (num > 9) {
        return numEnToBn(val).replaceAll("nd", "তম");
      }
    }
    if (val.includes("rd")) {
      num = val.split("rd")[0];
      if (num === null || num === "") return "তথ্য নেই";
      num = parseInt(num);

      if (num > 9) {
        return numEnToBn(val).replaceAll("rd", "তম");
      }
    }
    if (val.includes("th")) {
      num = val.split("th")[0];
      if (num === null || num === "") return "তথ্য নেই";
    }

    return numEnToBn(val)
      ?.replaceAll("st", "ম")
      .replaceAll("nd", "য়")
      .replaceAll("rd", "য়")
      .replaceAll("th", "তম");
  }

  return null;
};


export const statusMapper = (status: any) => {
  return status
    ? status
        .replaceAll("NEW", "খসড়া")
        .replaceAll("IN_REVIEW", "পর্যালোচনাধীন")
        .replaceAll("IN_APPROVE", "অনুমোদনাধীন")
        .replaceAll("APPROVED", "অনুমোদিত")
    : status;
};
