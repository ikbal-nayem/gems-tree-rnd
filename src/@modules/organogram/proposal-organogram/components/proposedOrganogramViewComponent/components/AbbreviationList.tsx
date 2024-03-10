import { LABELS } from "@constants/common.constant";
import { Separator } from "@gems/components";
import "../style.scss";
import { COMMON_LABELS } from "@gems/utils";

interface IAbbreviationForm {
  data: any;
  langEn: boolean;
}

const AbbreviationForm = ({ data, langEn }: IAbbreviationForm) => {
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
        <h4 className="m-0">{LABEL.ABBREVIATIONS}</h4>
      </div>
      <Separator className="mt-1 mb-1" />
      <div>
        {data?.map((item, i) => {
          return (
            <p className="mb-0 fs-7" key={i}>
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

export default AbbreviationForm;
