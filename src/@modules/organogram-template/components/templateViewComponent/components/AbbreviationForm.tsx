import { LABELS } from "@constants/common.constant";
import { Separator } from "@gems/components";
import "../style.scss";

interface IAbbreviationForm {
  data: any;
}

const AbbreviationForm = ({ data }: IAbbreviationForm) => {
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.ABBREVIATIONS}</h4>
      </div>
      <Separator className="mt-1 mb-2" />
      <div className="mt-3"></div>
    </div>
  );
};

export default AbbreviationForm;
