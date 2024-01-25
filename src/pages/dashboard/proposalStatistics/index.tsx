import { ContentPreloader } from "@gems/components";
import { ENV } from "config/ENV.config";
import { useEffect, useState } from "react";
// import { COMMON_LABELS } from "@gems/utils";
// import { chartRespValidate } from "utility/utils";
import Graph from "./Graph";

const ProposalStatistics = ({ reqBody }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [dataFound, setDataFound] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any>({
    series: [
      {
        name: "প্রস্তাবের পরিসংখ্যান",
        data: [120, 35, 85],
      },
    ],
    categories: [
      "আগত প্রস্তাবসমূহ",
      "অপেক্ষমান প্রস্তাবসমূহ",
      "নিষ্পত্তিকৃত প্রস্তাবসমূহ",
    ],
  });
  useEffect(() => {
    // setIsLoading(true);
    setTimeout(() => getData(), ENV.initLoadTime);
  }, [reqBody]);

  const getData = () => {
    // DashboardService.getRecruitmentStatisticsList(reqBody)
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
    <div>
      <div className="card p-5 mb-5" style={{ height: 320 }}>
        <Graph data={chartData} />

        <ContentPreloader show={isLoading} loaderText="তথ্য প্রস্তুত হচ্ছে" />
      </div>
    </div>
  );
};
export default ProposalStatistics;
