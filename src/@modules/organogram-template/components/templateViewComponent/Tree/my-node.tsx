import { COMMON_LABELS, LABELS } from "@constants/common.constant";
import { Icon } from "@gems/components";
import { notNullOrUndefined, numEnToBn } from "@gems/utils";
import "./my-node.css";
import TextBlock from "@components/TextBlock";

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
          className="text-hover-warning"
          color={
            nodeData?.postFunctionalityList &&
            nodeData?.postFunctionalityList?.length > 0
              ? "primary"
              : "light"
          }
          onClick={() => onView(nodeData)}
        />
        <p className="mb-0 fs-8">
          {langEn ? nodeData.titleEn : nodeData.titleBn}
        </p>
        <p className="mb-0 fs-8">{manPower}</p>
      </div>

      <div
        className={`bg-light text-start ${
          nodeData?.manpowerList?.length ? "p-1" : ""
        }`}
      >
        {nodeData?.manpowerList?.length > 0 &&
          nodeData?.manpowerList?.map((item, i) => {
            return (
              <div key={i}>
                {item?.numberOfEmployee || item?.postDto?.nameBn ? (
                  <div className="d-flex">
                    <p className="mb-0 fs-8">
                      {langEn
                        ? item?.numberOfEmployee || 0
                        : numEnToBn(item?.numberOfEmployee || 0)}{" "}
                    </p>
                    <p className="mb-0 ms-1 fs-8">x</p>
                    <p className="ms-1 mb-0 fs-8">
                      {(postList?.length > 0 &&
                        item?.organizationPost?.id &&
                        (langEn
                          ? postList?.find(
                              (d) => d?.id === item?.organizationPost?.id
                            )?.nameEn
                          : postList?.find(
                              (d) => d?.id === item?.organizationPost?.id
                            )?.nameBn)) ||
                        (langEn
                          ? COMMON_LABELS.EN.NOT_ASSIGN
                          : COMMON_LABELS.NOT_ASSIGN)}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}
      </div>
      {notNullOrUndefined(nodeData?.commentNode) && (
          <div className="pt-3 ps-2 bg-light text-start ">
            {/* <u>{isNotEnamCommittee ? "বি. দ্র. :" : "N.B. :"}</u>   */}
            <TextBlock value={nodeData?.commentNode} />
            {/* {nodeData?.commentNode} */}
          </div>
        )}
    </div>
  );
};

export default MyNode;
