import { numEnToBn } from "./textMapping";

export const makeBDLocalTime = (date) =>
	new Date(new Date(date).toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));

export const makeTwoDigit = (val: string) => {
	return val?.length < 2 ? "0" + val : val;
};

export const splitDate = (dateString: string | number | Date = "") => {
	let date = makeBDLocalTime(dateString);
	const dateStr = date.toDateString().split(" ");
	const timeStr = date.toLocaleTimeString("en-US").split(":");
	return {
		day: dateStr[0],
		dd: dateStr[2],
		mm: String(date.getMonth() + 1),
		MM: dateStr[1],
		yyyy: dateStr[3],
		hour: timeStr[0],
		minute: timeStr[1],
		second: timeStr[2]?.split(" ")?.[0] || "",
		ampm: timeStr[2]?.split(" ")?.[1] || "",
	};
};

export const generateDateFormat = (
	date: string | number | Date,
	format: string,
	outputFormat?: "en" | "bn"
) => {
	const dateTime = splitDate(date);
	const output = format
		.replace("%day%", dateTime?.day || "0")
		.replace("%dd%", dateTime?.dd || "0")
		.replace("%mm%", makeTwoDigit(dateTime?.mm) || "0")
		.replace("%MM%", dateTime?.MM || "0")
		.replace("%yyyy%", dateTime?.yyyy || "0")
		.replace("%hour%", makeTwoDigit(dateTime?.hour) || "0")
		.replace("%minute%", makeTwoDigit(dateTime?.minute) || "0")
		.replace("%second%", makeTwoDigit(dateTime?.second) || "0")
		.replace("%ampm%", dateTime?.ampm);
	return outputFormat === "en" ? output : numEnToBn(output);
};

export const prepareDuration = (data) => {
	let y = data ? parseInt(data.split("-")[0]) : 0;
	let m = data ? parseInt(data.split("-")[1]) : 0;
	let d = data ? parseInt(data.split("-")[2]) : 0;
	return numEnToBn(
		(y > 0 ? y + " বছর " : "") +
			(m > 0 ? m + " মাস " : "") +
			(d > 0 ? d + " দিন" : "")
	);
};

export const calculateDuration = (startDate, endDate?) => {
	startDate = makeBDLocalTime(startDate);
	endDate = addRemoveDays(makeBDLocalTime(endDate || new Date())); // Count including end date

	const yearDiff = endDate.getFullYear() - startDate.getFullYear();
	const monthDiff = endDate.getMonth() - startDate.getMonth();
	const dayDiff = endDate.getDate() - startDate.getDate();

	let yearDuration = yearDiff;
	let monthDuration = monthDiff;
	let dayDuration = dayDiff;

	if (dayDiff < 0) {
		const daysInMonth = new Date(
			endDate.getFullYear(),
			endDate.getMonth(),
			0
		).getDate();
		dayDuration = daysInMonth - startDate.getDate() + endDate.getDate();
		monthDuration--;
	}
	if (monthDiff < 0) {
		monthDuration += 12;
		yearDuration--;
	}

	let result = "";
	result = yearDuration > 0 ? result + yearDuration + " বছর " : result;
	result =
		monthDuration > 0
			? result + makeTwoDigit(monthDuration.toString()) + " মাস "
			: result;
	result =
		result.length > 0 && dayDuration === 0
			? result
			: result + makeTwoDigit(dayDuration.toString()) + " দিন";

	return {
		resultString: numEnToBn(
			`${yearDuration} বছর ${makeTwoDigit(
				monthDuration.toString()
			)} মাস ${makeTwoDigit(dayDuration.toString())} দিন`
		),
		shortResult: numEnToBn(result),
		years: yearDuration,
		months: makeTwoDigit(monthDuration.toString()),
		days: makeTwoDigit(dayDuration.toString()),
	};
};

export const addRemoveDays = (date, days = 1, isAdd = true) => {
	date = date ? new Date(date) : new Date();
	return isAdd
		? new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
		: new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
};
