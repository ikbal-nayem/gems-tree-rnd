import { COMMON_LABELS, LABELS } from "@constants/common.constant";
import { numEnToBn } from "@gems/utils";
import { longLineBreaker } from "utility/utils";
import "./my-node.css";

const MyNode = ({ nodeData }) => {
  return (
    <div className={`position rounded border border-gray-400 border-1 `}>
      <div className="rounded-top d-flex justify-content-between">
        <p className="mb-0 fs-8 text-center">
          {nodeData.nameBn
            ? longLineBreaker(nodeData.nameBn || "", 20)
            : COMMON_LABELS.NOT_ASSIGN}
        </p>
        <p className="mb-0 fs-8">
          {nodeData?.childCount ? `(${nodeData?.childCount})` : ""}
        </p>
      </div>
    </div>
  );
};

export default MyNode;
