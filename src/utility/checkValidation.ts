import { COMMON_LABELS } from "@constants/common.constant";
import { isObjectNull, notNullOrUndefined } from "@gems/utils";

const ALPHANUMERIC = /^[a-zA-Z0-9]+$/;
const DECIMAL_NUMERIC_REGEX = /^(\d+)?(\.)?(\d{0,2})?$/; // Ex: 123, '123'
const BN_EN_NUMERIC_REGEX = /^[\d\u09E6-\u09EF]+$/; // Ex: 123, '123', '১২৩'
const EN_NUMERIC_REGEX = /^[\d]+$/; // Ex: 123, '123',
const BN_EN_DECIMAL_NUMERIC_REGEX =
	/^(\.|[0-9\u09E6-\u09EF]+(\.[0-9\u09E6-\u09EF]+)?)$/; // Ex: 123, '12.3', '১২.৩'
const BD_PHONE_REGEX = /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/;
const BD_PHONE_BANGLA_REGEX = /^(\+?৮৮০|০)?১[৩-৯][০-৯]{8}$/;
const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const EN_TEXT_REGEX = /^[A-Za-z_.\s+]+$/;
const EN_SP_TEXT_REGEX = /^[A-Za-z0-9_!@#$&()\\-`.+,/"'\-\s+]+$/;

function checkIsActive(pathname: string, url: string) {
	const current = pathname.split(/[?#]/)[0];
	if (!current || !url) {
		return false;
	}
	if (current === url) {
		return true;
	}
	if (current.indexOf(url) > -1) {
		return true;
	}
	return false;
}

const checkRequiredFiles = (
	data: any,
	fields: Array<string | Array<string> | (string & Array<string>)>
) => {
	const returnObj = { hasError: true, fields: [] };
	fields.forEach((f) => {
		if (f instanceof Array) {
			// 1st index should be file sender property and 2nd index will be receiver property
			if (
				!(data?.[f[0]] instanceof File) &&
				(!data?.[f[1]] || !Object.keys(data?.[f[1]])?.length)
			) {
				returnObj.fields.push(f[0]);
			} else if (data?.[f[0]] instanceof File) {
				data[f[1]] = null;
			}
		} else {
			if (
				!(data?.[f] instanceof File) &&
				(!data?.[f] || !Object.keys(data?.[f])?.length)
			) {
				returnObj.fields.push(f);
			}
		}
	});
	returnObj.hasError = !!returnObj.fields.length;
	return returnObj;
};

const isFormValueChanged = (initValues, currentValues, dirtyFields) => {
	let isChanged: boolean = false;
	Object.keys(dirtyFields).forEach((df) => {
		if (isChanged) return;
		const cv = currentValues?.[df] || null;
		let iv = initValues?.[df] || null;
		if (typeof iv === "object" && isObjectNull(iv)) iv = null;
		if (typeof cv === "object") {
			isChanged = JSON.stringify(cv) !== JSON.stringify(iv);
			return;
		} else if (notNullOrUndefined(cv) && notNullOrUndefined(iv)) {
			isChanged = cv?.toString() !== iv?.toString();
			return;
		}
		isChanged = cv !== iv;
	});
	return isChanged;
};

const phoneNumberEnglishAndBanglaValidation = (data: any) => {
	if (data && data.length > 0 && data.charCodeAt(1) > 57)
		return BD_PHONE_BANGLA_REGEX;
	return BD_PHONE_REGEX;
};

const numericCheck = (val: string) => {
	return notNullOrUndefined(val)
		? BN_EN_NUMERIC_REGEX.test(val)
			? true
			: COMMON_LABELS.NUMERIC_ONLY
		: true;
};

const alphanumericCheck = (val: string) => {
	return notNullOrUndefined(val)
		? ALPHANUMERIC.test(val)
			? true
			: "শুধুমাত্র আলফানিউমেরিক লিখুন"
		: true;
};

const decimalCheck = (val: string) => {
	return notNullOrUndefined(val)
		? BN_EN_DECIMAL_NUMERIC_REGEX.test(val)
			? true
			: COMMON_LABELS.NUMERIC_ONLY
		: true;
};

const enCheck = (val: string) => {
	return notNullOrUndefined(val)
		? EN_SP_TEXT_REGEX.test(val)
			? true
			: COMMON_LABELS.EN_ONLY
		: true;
};

const bnCheck = (val: string) => {
	if (!notNullOrUndefined(val)) {
		return true;
	}
	let otherThanBnFound = false;
	for (let i = 0; i < val.length; i++) {
		otherThanBnFound =
			(val.charCodeAt(i) < 2433 && notSpclChar(val.charCodeAt(i))) ||
			val.charCodeAt(i) > 2554;
	}
	return otherThanBnFound ? COMMON_LABELS.BN_ONLY : true;
};

const valueEn = (val: string) => {
	return notNullOrUndefined(val) ? (EN_SP_TEXT_REGEX.test(val) ? val : 0) : 0;
};

const notSpclChar = (val: number) => {
	// 32, 35, 36, 37, 38, 40, 41, 42, 43, 45, 64, 95,
	return (
		val !== 32 &&
		val !== 35 &&
		val !== 36 &&
		val !== 37 &&
		val !== 38 &&
		val !== 40 &&
		val !== 41 &&
		val !== 42 &&
		val !== 43 &&
		val !== 45 &&
		val !== 64 &&
		val !== 95
	);
};

const valueBn = (val: string) => {
	if (!notNullOrUndefined(val)) {
		return 0;
	}
	let otherThanBnFound = false;
	// let otherThanBn = 'otherThanBn ';
	for (let i = 0; i < val.length; i++) {
		otherThanBnFound =
			(val.charCodeAt(i) < 2433 && notSpclChar(val.charCodeAt(i))) ||
			val.charCodeAt(i) > 2554;
		// otherThanBn += otherThanBnFound ? val.charCodeAt(i) + " " : ''
	}
	return otherThanBnFound ? 0 : val;
};

export {
	checkIsActive,
	checkRequiredFiles,
	isFormValueChanged,
	numericCheck,
	decimalCheck,
	alphanumericCheck,
	enCheck,
	bnCheck,
	valueEn,
	valueBn,
	DECIMAL_NUMERIC_REGEX,
	BN_EN_DECIMAL_NUMERIC_REGEX,
	BN_EN_NUMERIC_REGEX,
	EN_NUMERIC_REGEX,
	EN_TEXT_REGEX,
	BD_PHONE_REGEX,
	EMAIL_REGEX,
	BD_PHONE_BANGLA_REGEX,
	phoneNumberEnglishAndBanglaValidation,
};
