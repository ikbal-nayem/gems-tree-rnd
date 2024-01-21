import TextBlock from "@components/TextBlock";
import { COMMON_LABELS, LABELS } from "@constants/common.constant";
import { Icon } from "@gems/components";
import { notNullOrUndefined, numEnToBn } from "@gems/utils";
import { longLineBreaker } from "utility/utils";
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
    <div
      className={`position rounded border border-gray-400 border-1 ${
        nodeData?.isDeleted ? "text-line-through-color-red " : " "
      }${nodeData?.isAddition ? "text-decoration-underline" : ""}`}
    >
      <div className="bg-light rounded-top d-flex justify-content-between">
        {!nodeData?.isDeleted && (
          <div>
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
          </div>
        )}

        <p className="mb-0 fs-8  text-start">
          {/* {(langEn ? nodeData.titleEn : nodeData.titleBn) + " | " + nodeData?.displayOrder} */}
          {/* {longLineBreaker(langEn ? nodeData.titleEn : nodeData.titleBn, 17)} */}
          {langEn
            ? longLineBreaker(nodeData.titleEn || "", 17)
            : longLineBreaker(nodeData.titleBn || "", 20)}
        </p>
        <div>
          <p className="mb-0 fs-8 text-decoration-nonw">{manPower}</p>
        </div>
      </div>

      <div
        className={`text-start ${nodeData?.manpowerList?.length ? "p-1" : ""}`}
      >
        {nodeData?.manpowerList?.length > 0 &&
          nodeData?.manpowerList?.map((item, i) => {
            return (
              <div key={i}>
                {item?.numberOfEmployee || item?.postId ? (
                  <div
                    className={`d-flex ${
                      item?.postType === "proposed"
                        ? "text-primary"
                        : item?.postType === "nonPermanent"
                        ? "text-success"
                        : item?.postType === "permanent"
                        ? "text-gray-900"
                        : ""
                    } ${
                      item?.isDeleted ? "text-line-through-color-red " : " "
                    }${item?.isAddition ? "text-decoration-underline" : ""}`}
                  >
                    <p className="mb-0 fs-8">
                      {langEn
                        ? item?.numberOfEmployee || 0
                        : numEnToBn(item?.numberOfEmployee || 0)}{" "}
                    </p>
                    <p className="mb-0 ms-1 fs-8">x</p>
                    <p className="ms-1 mb-0 fs-8">
                      {(postList?.length > 0 &&
                        item?.postId &&
                        (langEn
                          ? postList?.find((d) => d?.id === item?.postId)
                              ?.nameEn
                          : postList?.find((d) => d?.id === item?.postId)
                              ?.nameBn)) ||
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
        <div className="pt-3 ps-2 text-start ">
          {/* <u>{isNotEnamCommittee ? "বি. দ্র. :" : "N.B. :"}</u>   */}
          <TextBlock value={nodeData?.commentNode} />
          {/* {nodeData?.commentNode} */}
        </div>
      )}
    </div>
  );
};

export default MyNode;
