import { numEnToBn } from "@gems/utils";
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { arryEnToBn } from "utility/utils";
import { bnFont, tooltip_box } from "../commonConfig";

interface IGraph {
  data: {
    series: any[];
    categories: any[];
    ids: any[];
  };
}

const Graph = ({ data }: IGraph) => {
  let categories = data?.categories;

  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      // events: {
      // 	xAxisLabelClick: (_, __, config) => {
      // 		const rank = data?.ids[config?.labelIndex];
      // 		window.open(
      // 			`${EMPLOYEE_SEARCH}?rankIds=${rank}`,
      // 			"_blank"
      // 		);
      // 	},
      // 	dataPointSelection: (_, __, config) => {
      // 		const rank = data?.ids[config?.dataPointIndex];
      // 		const gender = ["GENDER_MALE", "GENDER_FEMALE"][config?.seriesIndex];
      // 		window.open(
      // 			`${EMPLOYEE_SEARCH}?rankIds=${rank}&gender=${gender}`,
      // 			"_blank"
      // 		);
      // 	},
      // },
    },
    subtitle: {
      text: "<-------- মহিলা জনবল : : পুরুষ জনবল -------->",
      align: "center",
      style: {
        color: "#4655ac",
        fontFamily: bnFont,
        fontWeight: 1,
        fontSize: "13px",
      },
    },
    plotOptions: {
      bar: {
        distributed: true,
        horizontal: true,
        barHeight: "50%",
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0.2,
      colors: ["#fff"],
    },

    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      labels: {
        show: true,

        style: {
          fontSize: "8.5px",
          fontWeight: 500,
        },
      },
    },

    tooltip: {
      enabled: true,
      custom({ series, seriesIndex, dataPointIndex, w }) {
        // let tooltipBG = series[seriesIndex][dataPointIndex] > 0 ? 'text-primary' : 'text-danger'
        let genderTitle =
          series[seriesIndex][dataPointIndex] > 0
            ? '<div><u className="text-primary">পুরুষ : </u></div>'
            : '<div><u className="text-danger">মহিলা : </u></div>'; //নারী
        let label = w.globals.labels[dataPointIndex];

        let data =
          numEnToBn(Math.abs(series[seriesIndex][dataPointIndex])) + " জন";
        label = genderTitle + label.split("=")[0];
        // (label.includes("গ্রেড-১")
        // 	? numEnToBn(
        // 		label.split("গ্রেড-১")[0] +
        // 		" জন<br/>গ্রেড-১ " +
        // 		label.split("গ্রেড-১")[1] +
        // 		" জন<br/>মোট"
        // 	)
        // 	: label.split("=")[0]);

        // return tooltip_box(label, data, true, tooltipBG);
        return tooltip_box(label, data);
      },

      fixed: {
        enabled: false,
        position: "topRight",
        offsetX: 0,
        offsetY: 0,
      },
    },
    title: {
      text: "পদভিত্তিক জনবল",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#000",
      },
    },

    xaxis: {
      // title:{
      // 	text:'<---- মহিলা : : 0 : : পুরুষ ---->',
      // 	// offsetX: -50,
      // 	style:{
      // 		// color: "black",
      // 		fontFamily: bnFont,
      // 		fontWeight: 0,
      // 	}
      // },
      categories: arryEnToBn(categories),
      labels: {
        formatter: function (val) {
          return numEnToBn(Math.abs(Math.round(Number(val))));
        },
      },
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={data?.series || []}
      type="bar"
      height={300}
    />
  );
};

export default Graph;
