import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { nikosh, ubuntu_regular } from "./fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { defaultDef } from "./default.conf";

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
pdfMake.vfs["Nikosh.ttf"] = nikosh;
pdfMake.vfs["Ubuntu-Regular.ttf"] = ubuntu_regular;

(pdfMake as any).fonts = {
	Nikosh: {
		normal: "Nikosh.ttf",
		bold: "Nikosh.ttf",
		italics: "Nikosh.ttf",
		bolditalics: "Nikosh.ttf",
	},
	Ubuntu: {
		normal: "Ubuntu-Regular.ttf",
		bold: "Ubuntu-Regular.ttf",
		italics: "Ubuntu-Regular.ttf",
		bolditalics: "Ubuntu-Regular.ttf",
	},
};

export const generatePDF = (
	docDefinition: TDocumentDefinitions,
	action?: "open" | "print" | "download",
	fileName?: "file.pdf"
) => {
	docDefinition = {
		...defaultDef,
		...docDefinition,
	};
	const pdf = pdfMake.createPdf(docDefinition);
	switch (action) {
		case "print":
			pdf.print();
			break;
		case "download":
			pdf.download(fileName);
			break;
		default:
			pdf.open();
	}
};
