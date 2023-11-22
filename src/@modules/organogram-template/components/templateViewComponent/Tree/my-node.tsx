import { COMMON_LABELS, LABELS } from "@constants/common.constant";
import { Icon } from "@gems/components";
import { numEnToBn } from "@gems/utils";
import "./my-node.css";

const MyNode = ({ langEn, nodeData, postList, onView }) => {
  let COMMON_LABEL,
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
    <div className="position rounded border border-gray-400 border-1">
      <div className="d-flex justify-content-between">
        <Icon
          icon="fact_check"
          variants="outlined"
          hoverTitle={LABEL.ACTIVITIES}
          size={20}
          color={
            nodeData?.postFunctionalityList &&
            nodeData?.postFunctionalityList?.length > 0
              ? "primary"
              : "light"
          }
          onClick={() => onView(nodeData)}
        />
        <p className="p-1 mb-0 fw-bold fs-7">
          {langEn ? nodeData.titleEn : nodeData.titleBn}
        </p>
        <div>
          <p className="border border-dark border-1 m-1 px-1 rounded">
            {manPower}
          </p>
        </div>
      </div>

      <div
        className={`bg-light text-start ${
          nodeData?.manpowerList?.length ? "p-3" : ""
        }`}
      >
        {nodeData?.manpowerList?.length > 0 &&
          nodeData?.manpowerList?.map((item, i) => {
            return (
              <div key={i}>
                {item?.numberOfEmployee || item?.postDto?.nameBn ? (
                  <p className="mb-0 fs-7">
                    {langEn
                      ? item?.numberOfEmployee || 0
                      : numEnToBn(item?.numberOfEmployee || 0)}{" "}
                    x{" "}
                    {(postList?.length > 0 &&
                      item?.organizationPost?.id &&
                      (langEn
                        ? postList?.find(
                            (d) => d?.id === item?.organizationPost?.id
                          )?.nameEn
                        : postList?.find(
                            (d) => d?.id === item?.organizationPost?.id
                          )?.nameBn)) ||
                      COMMON_LABELS.NOT_ASSIGN}
                  </p>
                ) : null}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MyNode;
