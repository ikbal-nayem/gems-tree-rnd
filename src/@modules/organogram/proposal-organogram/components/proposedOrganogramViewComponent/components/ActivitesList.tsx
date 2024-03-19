import { COMMON_LABELS, LABELS } from "@constants/common.constant";
import { Separator } from "@gems/components";
import "../style.scss";

interface IActivitiesList {
  data: any;
  langEn: boolean;
  isTabContent?: boolean;
  title?: string;
}
const ActivitiesList = ({
  data,
  langEn,
  isTabContent,
  title,
}: IActivitiesList) => {
  const LABEL = langEn ? LABELS.EN : LABELS.BN;
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className={title ? "m-0 text-primary" : "m-0"}>
          {isTabContent && title ? title : LABEL.MAIN_ACTIVITIES}
        </h4>
      </div>
      <Separator className="mt-1 mb-1" />
      {data?.length > 0 && (
        <ol className={langEn ? "" : "bn_ol"}>
          {data?.map((item, i) => {
            return (
              <li key={i}>
                &nbsp;&nbsp;
                <span
                  className={
                    isTabContent
                      ? item?.isModified
                        ? "text-underline-color-yellow"
                        : item?.isAddition
                        ? "text-underline-color-black"
                        : item?.isDeleted
                        ? "text-line-through-color-red"
                        : ""
                      : ""
                  }
                >
                  {langEn
                    ? item?.mainActivityEn || COMMON_LABELS.NOT_ASSIGN
                    : item?.mainActivityBn || COMMON_LABELS.NOT_ASSIGN}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default ActivitiesList;
