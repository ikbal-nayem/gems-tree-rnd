/* eslint-disable react-hooks/rules-of-hooks */
import { AbilityContext } from "@context/Can";
import { useContext } from "react";
import { makeTwoDigit } from "./splitDate";
import { numEnToBn } from "./textMapping";
import { getUser } from "@services/helper/auth.helper";

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
