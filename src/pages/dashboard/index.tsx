import ACLWrapper from "@acl/ACLWrapper";
import { ROLES } from "@gems/utils";
import Dammy from "./components/Dammy";
import GenderBasedManpower from "./genderBasedManpower";
import RankBasedManpower from "./rankBasedManpower";
import "./app.css";
import ProposalStatistics from "./proposalStatistics";

// const tabs = [
//   {
//     label: "পলিসি ড্যাশবোর্ড",
//     key: "DASHBOARD_OPTION_ALL_OFFICE",
//     isHide: false,
//   },
//   {
//     label: "অফিস অ্যাডমিন ড্যাশবোর্ড",
//     key: "DASHBOARD_OPTION_ATTACHED_OFFICE",
//     isHide: false,
//   },
// ];
const Dashboard = () => {
  // const [reqBody, setReqBody] = useState<IObject>(requestBody);
  // const [isLoading, setLoading] = useState<boolean>(true);
  // const [selectedTab, setSelectedTab] = useState<number>(0);

  // useEffect(() => {
  //   Promise.all([CoreService.getByMetaType(META_TYPE.SERVICE_TYPE)])
  //     .then(([resp]) => {
  //       setReqBody((prev) => ({
  //         ...prev,
  //         serviceTypeKey: resp?.body?.[0]?.metaKey,
  //         option: "DASHBOARD_OPTION_OWN_OFFICE",
  //       }));
  //     })
  //     .finally(() => setLoading(false));
  // }, []);

  // const onFilter = (fData) => {
  // console.log(fData);
  //   setReqBody((prev) => ({
  //     ...prev,
  //     ...fData,
  //   }));
  // };

  // if (isLoading) return <ContentPreloader loaderText="অপেক্ষা করুন" />;

  // const setCurrentTab = (idx: number) => {
  //   setSelectedTab(idx);
  //   setLoading(true);
  // };

  return (
    <>
      {/* <PageTitle>
          <Filter onFilter={onFilter} />
        </PageTitle> */}

      <div className="row">
        {/* 01 => "Piramid Chart Demo" */}
        {/* <div className="col-xl-6 col-lg-6 col-sm-12">
            <RankBasedManpower reqBody={null} />
          </div> */}

        {/* 02 => "Pi Chart Demo" */}
        {/* <div className="col-xxl-3 col-md-6 col-sm-6">
            <GenderBasedManpower reqBody={null} />
          </div> */}

        {/* 03 => "প্রস্তাবের পরিসংখ্যান" */}
        <div className="col-lg-6 col-sm-12">
          <ProposalStatistics reqBody={null} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
