import { LABELS } from "@constants/common.constant";
import { Separator } from "@gems/components";
import "../style.scss";

interface ICheckListForm {
  data: any;
}

const CheckListForm = ({ data }: ICheckListForm) => {
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.CHECK_LIST}</h4>
      </div>
      <Separator className="mt-1 mb-2" />
      <div></div>
    </div>
  );
};

export default CheckListForm;
