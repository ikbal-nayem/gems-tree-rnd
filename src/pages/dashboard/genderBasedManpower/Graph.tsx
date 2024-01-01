import { numEnToBn } from "@gems/utils";
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { bnFont } from "../commonConfig";

interface IGraph {
  data: {
    series: any[];
    labels: any[];
    ids: string[];
  };
}

const Graph = ({ data }: IGraph) => {
  const options: ApexOptions = {
    chart: {
      type: "donut",
      // events: {
      // 	dataPointSelection: (_, __, config) => {
      // 		const gender = data?.ids[config?.dataPointIndex];
      // 		window.open(
      // 			`${EMPLOYEE_SEARCH}?gender=${gender}`,
      // 			"_blank"
      // 		);
      // 	},
      // },
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
          customIcons: [],
        },
        export: {
          csv: {
            filename: undefined,
            columnDelimiter: ",",
            headerCategory: "category",
            headerValue: "value",
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString();
            },
          },
          svg: {
            filename: undefined,
          },
          png: {
            filename: undefined,
          },
        },
        autoSelected: "zoom",
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: 20,
        },
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontFamily: bnFont,
            },
            value: {
              show: true,
              fontFamily: bnFont,
              formatter: function (value: string) {
                return numEnToBn(value) + " জন";
              },
            },
            total: {
              show: true,
              fontFamily: bnFont,
              formatter: function (w) {
                return (
                  numEnToBn(
                    w.globals.seriesTotals.reduce((a, b) => {
                      return a + b;
                    }, 0)
                  ) + " জন"
                );
              },
              label: "মোট",
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return numEnToBn(value) + " জন";
        },
      },
    },
    colors: ["#0996c7", "#D61355", "#30E3DF", "#C75DD0"],

    title: {
      text: "জেন্ডারভিত্তিক জনবল",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#000000",
      },
    },

    labels: data?.labels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            //   width: 100,
          },
        },
      },
    ],

    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
    },

    dataLabels: {
      // add this part to remove %
      enabled: true,
      offsetY: 0,
      textAnchor: "end",
      background: {
        enabled: true,
        foreColor: "black",
        padding: 5,
        borderColor: "black",
        borderRadius: 4,
      },

      formatter(value: any, opts: any): any {
        return (
          opts.w.config.labels[opts.seriesIndex] +
          " : " +
          numEnToBn(opts.w.config.series[opts.seriesIndex]) +
          " জন"
        );
      },
    },
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        series={data?.series || []}
        type="donut"
        height={320}
      />
    </div>
  );
};
export default Graph;
