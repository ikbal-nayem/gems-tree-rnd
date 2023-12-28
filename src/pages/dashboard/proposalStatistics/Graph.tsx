import { numEnToBn } from "@gems/utils";
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { bnFont, tooltip_box, yaxis } from "../commonConfig";

interface IGraph {
	data: {
		series: any[];
		categories: any[];
		// ids: string[];
	};
}

const Graph = ({
	data
}: IGraph) => {
	const options: ApexOptions = {
		chart: {
			type: "bar",
			fontFamily: bnFont,
			// events: {
			// 	dataPointSelection: (_, __, config) => {
			// 		const postingType = data?.ids[config?.dataPointIndex];
			// 		window.open(
			// 			`${EMPLOYEE_SEARCH}?postingCategoryKey=${postingType}`,
			// 			"_blank"
			// 		);
			// 	},
			// },
		},
		title: {
			text: "প্রস্তাবের পরিসংখ্যান",
			style: {
				fontSize: "16px",
				fontWeight: "bold",
				color: "#000000",
			},
		},

		colors: ["#D61355", "#F94A29", "#488F31", "#30E3DF", "#8B9A46", "#545454"],
		plotOptions: {
			bar: {
				distributed: true,
				borderRadius: 3,
				columnWidth: "50%",
				dataLabels: {
					position: "top",
				},
			},
		},
		dataLabels: {
			enabled: true,
			offsetY: -15,
			style: {
				// fontSize: "11px",
				colors: ["#0090ff"],
			},
			formatter(value: number, opts?: object): any {
				return numEnToBn(value);
			},
		},
		grid: {
			padding: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
			},
		},

		stroke: {
			show: true,
			width: 1,
			colors: ["#fff"],
		},
		tooltip: {
			enabled: true,
			custom({ series, seriesIndex, dataPointIndex, w }) {
				let posting_type =
					"পদায়নের ধরন: <b>" + w.globals.labels[dataPointIndex] + "</b>";
				let manpower =
					"জনবল: <b>" +
					numEnToBn(Math.abs(series[seriesIndex][dataPointIndex])) +
					" জন</b>";

				return tooltip_box(posting_type, manpower, false);
			},

			fixed: {
				enabled: false,
				position: "topRight",
				offsetX: 0,
				offsetY: 0,
			},
		},
		legend: {
			show: false,
			// position: "bottom",
			// horizontalAlign: "center",
		},
		xaxis: {
			categories: data?.categories || [],
			labels: {
				// offsetX: 4,
				// rotateAlways:true,
				// trim:true,
				// rotate:300,

				style: {
					fontSize: "9px",
					fontWeight: 500,
				},
			},
		},
		yaxis: yaxis,
	};
	return (
		<div>
			{" "}
			<ReactApexChart
				options={options}
				series={data?.series || []}
				type="bar"
				height={300}
			/>
		</div>
	);
};
export default Graph;
