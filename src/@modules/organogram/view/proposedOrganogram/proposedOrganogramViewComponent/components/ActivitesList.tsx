import { COMMON_LABELS, LABELS } from "@constants/common.constant";
import { Separator } from "@gems/components";
import "../style.scss";

interface IActivitiesForm {
  data: any;
  langEn: boolean;
}
const ActivitiesForm = ({ data, langEn }: IActivitiesForm) => {
  const LABEL = langEn ? LABELS.EN : LABELS.BN;
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABEL?.MAIN_ACTIVITIES}</h4>
      </div>
      <Separator className="mt-1 mb-1" />
      {data?.length > 0 && (
        <ol className={langEn ? "" : "bn_ol"}>
          {data?.map((item, i) => {
            return (
              <li key={i}>
                &nbsp;&nbsp;
                {langEn
                  ? item?.mainActivityEn || COMMON_LABELS.NOT_ASSIGN
                  : item?.mainActivityBn || COMMON_LABELS.NOT_ASSIGN}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default ActivitiesForm;
