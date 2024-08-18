import { LABELS } from "@constants/common.constant";
import { Separator } from "@gems/components";
import { COMMON_LABELS } from "@gems/utils";
import "../style.scss";

interface IAbbreviationList {
  data: any;
  langEn: boolean;
  isTabContent?: boolean;
  title?: string;
}

const AbbreviationList = ({
  data,
  langEn,
  isTabContent,
  title,
}: IAbbreviationList) => {
  const LABEL = langEn ? LABELS.EN : LABELS.BN;
  if (langEn) {
    data = data.sort((item1, item2) => {
      if (item1.shortForm > item2.shortForm) return 1;
      if (item1.shortForm < item2.shortForm) return -1;
      return 0;
    });
  }
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className={title ? "m-0 text-primary" : "m-0"}>
          {isTabContent && title ? title : LABEL.ABBREVIATIONS}
        </h4>
      </div>
      <Separator className="mt-1 mb-1" />
      <div>
        {data?.map((item, i) => {
          return (
            <p
              className={`mb-0 fs-7 ${
                isTabContent
                  ? item?.isModified
                    ? "text-underline-color-yellow"
                    : item?.isAddition
                    ? "text-underline-color-black"
                    : item?.isDeleted
                    ? "text-line-through-color-red"
                    : ""
                  : ""
              }`}
              key={i}
            >
              {item?.shortForm || COMMON_LABELS.NOT_ASSIGN}
              &nbsp;=&nbsp;
              {item?.fullForm || COMMON_LABELS.NOT_ASSIGN}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default AbbreviationList;
