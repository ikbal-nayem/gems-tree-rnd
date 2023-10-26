export const numEnToBn = (num: any) => {
	if (num === null || num === undefined ) { return null }
	return num
		?.toString()
		.replaceAll("0", "০")
		.replaceAll("1", "১")
		.replaceAll("2", "২")
		.replaceAll("3", "৩")
		.replaceAll("4", "৪")
		.replaceAll("5", "৫")
		.replaceAll("6", "৬")
		.replaceAll("7", "৭")
		.replaceAll("8", "৮")
		.replaceAll("9", "৯")
		.replaceAll("Jan", "জানুয়ারি")
		.replaceAll("Feb", "ফেব্রুয়ারী")
		.replaceAll("Mar", "মার্চ")
		.replaceAll("Apr", "এপ্রিল")
		.replaceAll("May", "মে")
		.replaceAll("Jun", "জুন")
		.replaceAll("Jul", "জুলাই")
		.replaceAll("Aug", "আগস্ট")
		.replaceAll("Sep", "সেপ্টেম্বর")
		.replaceAll("Oct", "অক্টোবর")
		.replaceAll("Nov", "নভেম্বর")
		.replaceAll("Dec", "ডিসেম্বর")
		.replaceAll("Years", "বছর")
		.replaceAll("Months", "মাস")
		.replaceAll("Days", "দিন")
		.replaceAll("AM", "এ এম")
		.replaceAll("PM", "পি এম");
};

export const placementEnToBn = (val: any) => {
	if (val) {
		let num
		if (val.includes('st')) {
			num = val.split('st')[0]
			// return num
			if (num === null || num === '') return 'তথ্য নেই'
			num = parseInt(num)

			if (num > 9) { return numEnToBn(val).replaceAll("st", "তম"); }
		}
		if (val.includes('nd')) {
			num = val.split('nd')[0]
			if (num === null || num === '') return 'তথ্য নেই'
			num = parseInt(num)

			if (num > 9) { return numEnToBn(val).replaceAll("nd", "তম"); }
		}
		if (val.includes('rd')) {
			num = val.split('rd')[0]
			if (num === null || num === '') return 'তথ্য নেই'
			num = parseInt(num)

			if (num > 9) { return numEnToBn(val).replaceAll("rd", "তম"); }
		}
		if (val.includes('th')) {
			num = val.split('th')[0]
			if (num === null || num === '') return 'তথ্য নেই'
		}

		return numEnToBn(val)
			?.replaceAll("st", "ম")
			.replaceAll("nd", "য়")
			.replaceAll("rd", "য়")
			.replaceAll("th", "তম")
	}

	return null
};

export const numBnToEn = (num: any) => {
	return num
		? num
			.toString()
			.replaceAll("০", "0")
			.replaceAll("১", "1")
			.replaceAll("২", "2")
			.replaceAll("৩", "3")
			.replaceAll("৪", "4")
			.replaceAll("৫", "5")
			.replaceAll("৬", "6")
			.replaceAll("৭", "7")
			.replaceAll("৮", "8")
			.replaceAll("৯", "9")
		: num;
};
