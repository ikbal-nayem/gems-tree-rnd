import { LABELS } from "@constants/common.constant";
import { Separator } from "@gems/components";
import "../style.scss";

interface IActivitiesForm {
  data: any;
}
const ActivitiesForm = ({ data }: IActivitiesForm) => {
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.MAIN_ACTIVITIES}</h4>
      </div>
      <Separator className="mt-1 mb-2" />
      <div>
        <ol className="bn_ol">
          {data?.length > 0 &&
            data?.map((item, i) => {
              return <li key={i}>&nbsp;&nbsp;{item?.mainActivityBn}&nbsp;&nbsp;({item?.mainActivityEn})</li>;
            })}
        </ol>
      </div>
    </div>
  );
};

export default ActivitiesForm;
