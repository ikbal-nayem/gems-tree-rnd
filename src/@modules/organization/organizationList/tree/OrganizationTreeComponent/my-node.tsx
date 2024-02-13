import { COMMON_LABELS, LABELS } from "@constants/common.constant";
import { numEnToBn } from "@gems/utils";
import { longLineBreaker } from "utility/utils";
import "./my-node.css";

const MyNode = ({ langEn, nodeData }) => {
  let COMMON_LABEL = null,
    LABEL,
    manPower = nodeData?.nodeManpower + "/" + nodeData?.totalManpower;

  if (langEn) {
    COMMON_LABEL = COMMON_LABELS.EN;
    LABEL = LABELS.EN;
  } else {
    LABEL = LABELS.BN;
    COMMON_LABEL = COMMON_LABELS;
    manPower = numEnToBn(manPower);
  }

  return (
    <div className={`position rounded border border-gray-400 border-1 `}>
      <div className="rounded-top">
        <p className="mb-0 fs-8 text-center">
          {langEn
            ? longLineBreaker(nodeData.titleEn || "", 17)
            : nodeData.titleBn
            ? longLineBreaker(nodeData.titleBn || "", 20)
            : COMMON_LABELS.NOT_ASSIGN}
        </p>
      </div>
    </div>
  );
};

export default MyNode;
