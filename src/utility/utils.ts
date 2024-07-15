/* eslint-disable react-hooks/rules-of-hooks */
import { notNullOrUndefined, numEnToBn } from "@gems/utils";

// export const getPermittedRouteList = (routeList) => {
//   let userInfo = getUser();
//   return (
//     routeList.filter(
//       (d) =>
//         Object.keys(userInfo?.userPermissionDTO)?.length > 0 &&
//         userInfo?.userPermissionDTO?.sitemapList?.length > 0 &&
//         userInfo?.userPermissionDTO?.sitemapList?.find(
//           (e) => d?.routeKey === e?.routeKey
//         )
//     ) || []
//   );
// };

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

export const sortBy = (
  list,
  criteria: "property" | "propLength" = "property",
  prop: string = "displayOrder",
) => {
  if (isNotEmptyList(list)) {
    return list.sort((a, b) => {
      if (!notNullOrUndefined(a[prop])) return 1;
      if (!notNullOrUndefined(b[prop])) return -1;
      if (criteria === "property") {
        if (a[prop] === b[prop]) return 0;
      return a[prop] > b[prop] ? 1 : -1;
      } else {
        if (a[prop]?.length === b[prop]?.length) return 0;
        return a[prop]?.length > b[prop]?.length ? 1 : -1;
      }
      
    });
  }
  return null;
};
