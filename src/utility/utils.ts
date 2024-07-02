/* eslint-disable react-hooks/rules-of-hooks */
import { AbilityContext } from "@context/Can";
import { useContext } from "react";
import { makeTwoDigit } from "./splitDate";
import { numEnToBn } from "./textMapping";
import { getUser } from "@services/helper/auth.helper";
const userInfo = getUser();

export const viewMenuGroup = (item) => {
  let ability: any = useContext(AbilityContext);
  const hasAnyVisibleChild =
    item.children &&
    item.children.some((i) => ability.can(i.action, i.resource));

  if (!(item.action && item.resource)) {
    return hasAnyVisibleChild;
  }
  return ability.can(item.action, item.resource) && hasAnyVisibleChild;
};

export const vieMenuItem = (item) => {
  let abilityItem: any = useContext(AbilityContext);
  return abilityItem.can(item.action, item.resource);
};

export const generateRowNumBn = (index, ln?) => {
  if (ln === "en") {
    return makeTwoDigit((index + 1).toString());
  } else {
    return numEnToBn(makeTwoDigit((index + 1).toString()));
  }
};

export const makeTwoDecimalPoint = (val: string) => {
  return val
    ? val.toString().split(".")[1]?.length < 2
      ? +val + "0"
      : val
    : null;
};

export const notNullOrUndefined = (data) =>
  !(
    data === null ||
    data === undefined ||
    data === "null" ||
    data === "undefined" ||
    data === ""
  );

export const durationEnToBn = (dur: any) => {
  if (dur) {
    // i.e. - periodDate : "0 Years 0 Months 10 Days "
    let y = parseInt(dur.split(" Years ")[0]);
    let m = parseInt(dur.split(" Years ")[1].split(" Months ")[0]);
    let d = parseInt(dur.split(" Months ")[1].split(" Days ")[0]);
    return (
      (y > 0 ? numEnToBn(y) + " বছর " : "") +
      (m > 0 ? numEnToBn(m) + " মাস " : "") +
      (d > 0 ? numEnToBn(d) + " দিন " : "")
    );
  }
  return dur;
};

export const isFileImg = (extension: string) => {
  extension = extension.toLocaleLowerCase();
  return (
    extension === "png" ||
    extension === "jpg" ||
    extension === "jpeg" ||
    extension === "image/png" ||
    extension === "image/jpg" ||
    extension === "image/jpeg"
  );
};

export const isFilePdf = (extension: string) => {
  extension = extension?.toLocaleLowerCase();
  return extension === "pdf" || extension === "application/pdf";
};

export const payscaleFormatter = (year: any, grade: any, payscale: any) => {
  return year && grade
    ? numEnToBn(year) + " , " + grade + " , " + payscale
    : payscale;
};

export const getPermittedRouteList = (routeList) => {
  let userInfo = getUser();
  return (
    routeList.filter(
      (d) =>
        Object.keys(userInfo?.userPermissionDTO)?.length > 0 &&
        userInfo?.userPermissionDTO?.sitemapList?.length > 0 &&
        userInfo?.userPermissionDTO?.sitemapList?.find(
          (e) => d?.routeKey === e?.routeKey
        )
    ) || []
  );
};

export const isNotEmptyList = (list) => list && list?.length > 0;

export const numOfNewLines = (val) => {
  if (val?.length) {
    return (val.match(/\n/g) || []).length;
  }
  return 0;
};

export const numOfTabs = (val) => {
  if (notNullOrUndefined(val))
    return val.length - val.replace("    ", "").length;
};

export const breakNewLines = (val) => val.split("\n");

export const slashBreaker = (val) => val.replaceAll("/", "/ ");

export const longWordBreaker = (
  val,
  threshHoldLength: number = 10,
  result = ""
) => {
  if (!notNullOrUndefined(val)) return (result += val);
  if (val.length < threshHoldLength + 1) result += val;
  else {
    if (val.charAt(threshHoldLength) === " ") {
      return longWordBreaker(
        val.substring(threshHoldLength + 1),
        threshHoldLength,
        result + val.substring(0, threshHoldLength + 1)
      );
    } else {
      return longWordBreaker(
        val.substring(threshHoldLength - 1),
        threshHoldLength,
        result + val.substring(0, threshHoldLength - 1) + "- "
      );
    }
  }
  return result;
};

export const longLineBreaker = (line, threshHoldLength: number = 20) => {
  const words = slashBreaker(line).split(" ");
  for (let i = 0; i < words?.length; i++)
    words[i] = longWordBreaker(words[i], threshHoldLength);
  return words.join(" ");
};

export const focusById = (id: string, markAsErrorBlock: boolean = false) => {
  const block = document.getElementById(id);
  block?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
  if (markAsErrorBlock) block?.classList.add("border-danger");
};

export const deFocusById = (id: string) => {
  document.getElementById(id)?.classList.remove("border-danger");
};

export const chartRespValidate = (resp: any) => {
  return resp?.body?.series?.length > 0 && resp?.body?.categories?.length > 0;
};

export const donutChartRespValidate = (resp: any) => {
  return resp?.body?.series?.length > 0 && resp?.body?.labels?.length > 0;
};

export const arryEnToBn = (enArray, step: number = 1): any[] => {
  let arry = [];
  for (let i = 0; i < enArray.length; i++) {
    if (step === 1) {
      // no Intervals
      arry.push(numEnToBn(enArray[i]));
    } else {
      // Intervals inserted
      if (i % step === 0) {
        arry.push(numEnToBn(enArray[i]));
      } else {
        arry.push("");
      }
    }
  }
  return arry;
};

export const pdfCellAlign = (data: any) => {
  return notNullOrUndefined(data) ? "start" : "center";
};
