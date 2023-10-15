import { Separator } from "@gems/components";
import Form from "./form";
import "../style.scss";
import { LABELS } from "@constants/common.constant";

const AllocationOfBusiness = ({ data, onOtherDataSet }) => {
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.ALLOCATION_OF_BUSINESS}</h4>
      </div>
      <Separator className="mt-1 mb-2" />
      <Form data={data} onOtherDataSet={onOtherDataSet} />
    </div>
  );
};

export default AllocationOfBusiness;
