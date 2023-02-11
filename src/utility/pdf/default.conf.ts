import { TDocumentDefinitions } from "pdfmake/interfaces";

export const defaultDef: TDocumentDefinitions = {
	pageSize: "A4",
	pageMargins: [28, 25, 20, 20],
	content: [],
	defaultStyle: {
		font: "Nikosh",
	},
};
