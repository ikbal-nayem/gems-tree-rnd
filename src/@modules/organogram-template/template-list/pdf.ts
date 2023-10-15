import {
	COMMON_LABELS,
	DATE_PATTERN,
	TDocumentDefinitions,
	generateDateFormat,
	makeBDLocalTime,
	makeTwoDigit,
	numEnToBn,
	prepareDuration,
} from "@gems/utils";
import { LABELS } from "./labels";

export const promotableEmployeePDFcontent = (
	data,
	reqPayload
): TDocumentDefinitions => {
	const cellWidths = [25, 25, 120, 140, 150, "*", 50];
	const columns = [
		{ nameBn: COMMON_LABELS.SL_NO, key: null },
		// { nameBn: LABELS.GOVID, key: "govtId" },
		{ nameBn: LABELS.NAME, key: "nameBn" },
		// {
		// 	nameBn: LABELS.POST,
		// 	key: "postNameBn",
		// },
		// { nameBn: LABELS.EDUCATION, key: "educationalDTOS" },
		// {
		// 	nameBn: `${LABELS.POSTING_INFO}`,
		// 	key: "fieldPostingDTOS",
		// },
		// { nameBn: LABELS.POSTING_INFO_TOTAL, key: "totalDuration" },
	];

	const today = makeBDLocalTime(new Date());

	return {
		footer: (currentPage, pageCount) => {
			return [
				{
					columns: [
						{
							text: `তারিখ: ${generateDateFormat(
								today,
								DATE_PATTERN.GOVT_STANDARD
							)}`,
						},
						{
							text: "Powered by GEMS",
							fontSize: 8,
							color: "#009ef7",
							alignment: "center",
							marginTop: 3,
						},
						{
							text: `পৃষ্ঠা: ${numEnToBn(currentPage.toString())}/${numEnToBn(
								pageCount
							)}`,
							alignment: "right",
						},
					],
					marginLeft: 20,
					marginRight: 20,
				},
			];
		},
		content: [
			{ text: "জনপ্রশাসন মন্ত্রণালয়", style: "header" },
			{ text: "লোক প্রশাসন কম্পিউটার কেন্দ্র (পিএসিসি)", style: "header" },
			{
				text: `জেলা প্রশাসক হিসাবে পদায়নের যোগ্যতার প্রতিবেদন (${generateDateFormat(
					reqPayload?.toDate,
					DATE_PATTERN.GOVT_STANDARD
				)} তারিখ পর্যন্ত)`,
				style: "subHeader",
			},
			{
				text: "শর্ত: উপসচিব, নির্ধারিত ব্যাচ (প্রশাসন ক্যাডার), বয়স < ৫০ বছর, মাঠ প্রশাসনে চাকুরির অভিজ্ঞতা (অতিরিক্ত জেলা প্রশাসক, অতিরিক্ত জেলা ম্যাজিষ্ট্রেট, উপজেলা নির্বাহী কর্মকর্তা, উপ-পরিচালক স্থানীয় সরকার, সচিব (জেলা পরিষদ), প্রধান নির্বাহী কর্মকর্তা (জেলা পরিষদ/পৌরসভা)) দুই বছর বা তার অধিক চারুকীর অভিজ্ঞতা থাকতে হবে।",
				style: "subHeader",
			},
			{ text: "", style: "line_gap" },
			{
				table: {
					headerRows: 1,
					dontBreakRows: true,
					widths: cellWidths,
					body: [
						columns.map((col) => ({
							text: col.nameBn,
							style: "tableHeader",
						})),
						...data?.map((d, idx) =>
							columns.map((col) => {
								if (col?.key) {
									switch (col?.key) {
										// case "imageUrl":
										// 	return {
										// 		image: d?.employeeId,
										// 		fit: [28, 28],
										// 	};
										case "nameBn":
											return [
												{ text: d[col?.key], fontSize: 10 },
												{
													text: `জেলা (নিজ): ${
														d?.ownDistrict || COMMON_LABELS.NOT_ASSIGN
													}`,
													style: "text_muted",
												},
												{
													text: `জেলা (স্পাউস): ${
														d?.spouseHomeDistrict || COMMON_LABELS.NOT_ASSIGN
													}`,
													style: "text_muted",
												},
												{
													text: `ব্যাচ: ${d?.batchName}`,
													style: "text_muted",
												},
												{
													text: `প্র.যো.তা: ${generateDateFormat(
														d?.joiningDate,
														DATE_PATTERN.GOVT_STANDARD
													)}`,
													style: "text_muted",
												},
												{
													text: `জন্ম তারিখ: ${generateDateFormat(
														d?.dateOfBirth,
														DATE_PATTERN.GOVT_STANDARD
													)}`,
													style: "text_muted",
												},
												{
													text: `পিআরএল: ${generateDateFormat(
														d?.prlDate,
														DATE_PATTERN.GOVT_STANDARD
													)}`,
													style: "text_muted",
												},
												{
													text: `বয়স: ${prepareDuration(d.age)}`,
													style: "text_muted",
												},
												{
													text: `মা.প্ৰ.চা.কাল: ${prepareDuration(
														d.fieldOfficeTotalDuration
													)}`,
													style: "text_muted",
												},
											];
										case "postNameBn":
											return [
												{ text: `${d[col?.key]},` },
												{
													text: d?.orgNameBn || COMMON_LABELS.NOT_ASSIGN,
													style: "text_muted",
												},
												{
													text: `যোগদান: ${generateDateFormat(
														d?.presentPostingJoinDate,
														DATE_PATTERN.GOVT_STANDARD
													)} (${prepareDuration(
														d?.durationFromPresentPosting
													)})`,
													style: "text_muted",
												},
												{
													text: `পদোন্নতি: ${generateDateFormat(
														d?.promotionDate,
														DATE_PATTERN.GOVT_STANDARD
													)}`,
													style: "text_muted",
												},
											];
										case "educationalDTOS":
											return d[col?.key]?.map((edu) => ({
												columns: [
													{
														text: `${edu?.degree}, ${
															edu?.subjectName || COMMON_LABELS.NOT_APPLICABLE
														}, ${edu?.institutionName}`,
														width: 100,
													},
													[
														{
															text: `${numEnToBn(edu?.passingYear)},`,
														},
														{ text: edu?.result },
													],
												],
											}));
										case "fieldPostingDTOS":
											return d[col?.key]?.map((fp) => ({
												columns: [
													{
														text: `${fp?.postNameBn}, ${fp?.orgNameBn}`,
														width: 130,
													},
													[
														{
															text: generateDateFormat(
																fp?.postingJoiningDate,
																DATE_PATTERN.GOVT_STANDARD
															),
															alignment: "center",
														},
														{ text: "থেকে", alignment: "center" },
														{
															text: generateDateFormat(
																fp?.releasePostingDate ||
																	makeBDLocalTime(new Date()),
																DATE_PATTERN.GOVT_STANDARD
															),
															alignment: "center",
														},
													],
													{
														text: prepareDuration(fp?.duration),
														width: 40,
														alignment: "center",
													},
												],
											}));
										case "totalDuration":
											return {
												text: prepareDuration(d[col?.key]),
												alignment: "center",
											};
										default:
											return {
												text: numEnToBn(d[col?.key]),
												alignment: "center",
											};
									}
								} else
									return {
										text: numEnToBn(makeTwoDigit((idx + 1).toString())),
										alignment: "center",
									};
							})
						),
					],
				},
				style: { columnGap: 2 },
				layout: "lightHorizontalLines",
			},
			{ text: "", style: "line_gap" },
			{ text: "", style: "line_gap" },
			{
				table: {
					widths: ["*"],
					body: [
						[
							{
								stack: [
									{ text: "বিঃদ্রঃ ," },
									{
										type: "circle",
										ul: [
											"চা.কাল : চাকুরিকাল",
											"প্র.যো.তা : প্রথম যোগদানের তারিখ",
											"মা.প্ৰ. : মাঠ প্রশাসন",
											"মা.প্ৰ.চা.কাল : মাঠ প্রশাসনে মোট চাকুরিকাল",
										],
									},
								],
								style: "text_muted",
								borderColor: "#555",
							},
						],
					],
				},
			},
		],
		styles: {
			header: {
				fontSize: 13,
				bold: true,
				alignment: "center",
			},
			subHeader: {
				fontSize: 11,
				bold: true,
				alignment: "center",
			},
			tableHeader: {
				bold: true,
				fontSize: 9.5,
				color: "#575757",
			},
			text_muted: {
				color: "#555",
			},
			line_gap: {
				marginBottom: 10,
			},
		},
		pageMargins: [5, 20, 5, 20],
		pageOrientation: "landscape",
	};
};
