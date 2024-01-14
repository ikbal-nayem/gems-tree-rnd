import { ContentPreloader, NoData } from "@gems/components";
import { ENV } from "config/ENV.config";
import { useEffect, useState } from "react";
import Graph from "./Graph";
import { COMMON_LABELS } from "@gems/utils";
import { donutChartRespValidate } from "utility/utils";

const GenderBasedManpower = ({ reqBody }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataFound, setDataFound] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any>({
    series: [0, 0],
    labels: ["মহিলা", "পুরুষ"],
  });
  useEffect(() => {
    // setIsLoading(true);
    setChartData({ labels: [] });
    setTimeout(getData, ENV.initLoadTime + 1000);
  }, [reqBody]);

  const getData = () => {
    // DashboardService.getGenderBasedManpowerList({ ...reqBody })
    // 	.then((res) => {
    // 		if (donutChartRespValidate(res)) {
    // 			setGenderBasedManpowerData(res?.body);
    // 			setDataFound(true);
    // 		} else { setDataFound(false) }
    // 	})
    // 	.finally(() => setIsLoading(false));
  };

  return (
    <div className="card p-5 mb-5" style={{ height: 320 }}>
      <Graph data={chartData} />

      <ContentPreloader show={isLoading} loaderText="তথ্য প্রস্তুত হচ্ছে" />
    </div>
  );
};
export default GenderBasedManpower;
