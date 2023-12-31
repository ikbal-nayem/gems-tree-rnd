import { ContentPreloader } from "@gems/components";
import { ENV } from "config/ENV.config";
import { useEffect, useState } from "react";
import Graph from "./Graph";
import { COMMON_LABELS } from "@gems/utils";
import { chartRespValidate } from "utility/utils";

const RankBasedManpower = ({ reqBody }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataFound, setDataFound] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any>({
    series: [
      {
        name: "",
        data: [],
      },
    ],
    categories: [" ", " ", " ", " ", " ", " "],
  });

  useEffect(() => {
    // setIsLoading(true);
    setTimeout(getData, ENV.initLoadTime);
  }, [reqBody]);

  const getData = () => {
    // DashboardService.getRankBasedManpowerList({ ...reqBody })
    //   .then((res) => {
    //     if (chartRespValidate(res)) {
    //       setChartData(res?.body);
    //       setDataFound(true);
    //     } else {
    //       setDataFound(false);
    //     }
    //   })
    //   .finally(() => setIsLoading(false));
  };

  return (
    <div className="card p-5 mb-5" style={{ height: 320 }}>
      <Graph data={chartData} />

      <ContentPreloader show={isLoading} loaderText="তথ্য প্রস্তুত হচ্ছে" />
    </div>
  );
};

export default RankBasedManpower;
