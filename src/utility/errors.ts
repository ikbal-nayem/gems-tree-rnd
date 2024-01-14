import { toast } from "@gems/components";

const errorList = {
	400: "Bad Request!",
	401: "Unauthorized!",
	402: "Payment Required!",
	403: "Forbidden!",
	404: "Not Found!",
	405: "Method Not Allowed!",
	406: "Not Acceptable!",
	407: "Proxy Authentication Required!",
	408: "Request Timeout!",
	409: "Conflict!",
	410: "Gone!",
	411: "Length Required!",
	412: "Precondition Failed!",
	413: "Payload Too Large!",
	414: "URI Too Long!",
	415: "Unsupported Media Type!",
	416: "Range Not Satisfiable!",
	417: "Expectation Failed!",
	429: "Too Many Requests!",
	500: "Internal Server Error!",
	501: "Not Implemented!",
	502: "Bad Gateway!",
	503: "Service Unavailable!",
	504: "Gateway Timeout!",
	505: "HTTP Version Not Supported!",
	506: "Variant Also Negotiates!",
	507: "Insufficient Storage!",
	508: "Loop Detected!",
	510: "Not Extended!",
	511: "Network Authentication Required!",
};

export const errorMessage = (code: number): string => {
	return errorList[code] || "Unknown Error";
};

export const errorMessageWithToast = (code: number) => {
	return toast.error(errorMessage(code) || "Unknown Error");
};

// // Find first error object of "react-hook-form"
// export const getFirstErrorObj = (errors) => {
// 	if (errors?.ref) return errors;
// 	if (errors instanceof Array) {
// 		errors = errors.filter((val) => val);
// 		return getFirstErrorObj(errors?.[0]);
// 	}
// 	const errorParams = Object.keys(errors);
// 	if (errorParams?.length) {
// 		return getFirstErrorObj(errors?.[errorParams?.[0]]);
// 	}
// };
