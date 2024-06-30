import TextBlock from "@components/TextBlock";
import { COMMON_LABELS, LABELS } from "@constants/common.constant";
import { Icon } from "@gems/components";
import {
  IObject,
  isObjectNull,
  notNullOrUndefined,
  numEnToBn,
} from "@gems/utils";
import { isNotEmptyList, longLineBreaker } from "utility/utils";
import "./my-node.css";

const MyNode = ({ langEn, nodeData, postList, onView }) => {
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

  let deletedClass = nodeData?.isDeleted ? "text-line-through-color-red" : "";
  let additionClass = nodeData?.isAddition ? "text-decoration-underline" : "";

  return (
    <div className={`position rounded border border-gray-400 border-1`}>
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

        <p className={`mb-0 fs-8  text-start ${deletedClass} ${additionClass}`}>
          {/* {(langEn ? nodeData.titleEn : nodeData.titleBn) + " | " + nodeData?.displayOrder} */}
          {/* {longLineBreaker(langEn ? nodeData.titleEn : nodeData.titleBn, 17)} */}
          {langEn
            ? longLineBreaker(nodeData.titleEn || "", 17)
            : nodeData.titleBn
            ? longLineBreaker(nodeData.titleBn || "", 20)
            : COMMON_LABELS.NOT_ASSIGN}
        </p>
        <p className={`mb-0 fs-8 ${deletedClass} ${additionClass}`}>
          {manPower}
        </p>
      </div>

      <div
        className={`text-start ${nodeData?.manpowerList?.length ? "p-1" : ""}`}
      >
        {nodeData?.manpowerList?.length > 0 &&
          nodeData?.manpowerList?.map((item, i) => {
            let itemDeletedClass = item?.isDeleted
              ? "text-line-through-color-red"
              : "";
            let itemAdditionClass = item?.isAddition
              ? "text-decoration-underline"
              : "";

            let mp = item?.numberOfEmployee ? item?.numberOfEmployee : 0;
            mp = langEn ? mp : numEnToBn(mp);
            const postExists = isNotEmptyList(postList) && item?.postId;

            const post = postExists
              ? postList?.find((d) => d?.id === item?.postId)
              : null;

            const postName = !isObjectNull(post)
              ? langEn
                ? post?.nameEn
                : post?.nameBn
              : langEn
              ? COMMON_LABELS.EN.NOT_ASSIGN
              : COMMON_LABELS.NOT_ASSIGN;

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
                    }`}
                  >
                    <p
                      className={`mb-0 fs-8 ${
                        deletedClass || itemDeletedClass
                      } ${additionClass || itemAdditionClass}`}
                    >
                      {mp}{" "}
                    </p>
                    <p
                      className={`mb-0 ms-1 fs-8 ${
                        deletedClass || itemDeletedClass
                      } ${additionClass || itemAdditionClass}`}
                    >
                      x
                    </p>
                    <p
                      className={`ms-1 mb-0 fs-8 ${
                        deletedClass || itemDeletedClass
                      } ${additionClass || itemAdditionClass}`}
                    >
                      {longLineBreaker(postName, 17)}
                      {item?.alternativePostListDTO?.length > 0
                        ? item?.alternativePostListDTO?.map((ap: IObject) =>
                            longLineBreaker(
                              ` / ${langEn ? ap?.nameEn : ap?.nameBn}`,
                              17
                            )
                          )
                        : ""}
                      {/* {longLineBreaker(
                        item?.alternativePostListDTO?.length > 0
                          ? item?.alternativePostListDTO?.map(
                              (ap: IObject) =>
                                ` / ${langEn ? ap?.nameEn : ap?.nameBn}`
                            )
                          : "",
                        17
                      )} */}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}
      </div>
      {notNullOrUndefined(nodeData?.commentNode) && (
        <div className="pt-3 ps-2 text-start ">
          <TextBlock value={nodeData?.commentNode} />
        </div>
      )}
    </div>
  );
};

export default MyNode;
