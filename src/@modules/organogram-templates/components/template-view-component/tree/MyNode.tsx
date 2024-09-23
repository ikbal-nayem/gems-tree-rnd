import TextBlock from "@components/TextBlock";
import { COMMON_LABELS, LABELS } from "@constants/common.constant";
import { Icon } from "@gems/components";
import {
  IObject,
  isObjectNull,
  notNullOrUndefined,
  numEnToBn,
} from "@gems/utils";
import { longLineBreaker } from "utility/utils";
import "./my-node.css";

const MyNode = ({ langEn, nodeData, onViewOrManPowertableView }) => {
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
      <div className="bg-light rounded-top d-flex ">
      {!nodeData?.isDeleted && (
          <div>
            <Icon
              icon="fact_check"
              variants="outlined"
              hoverTitle={LABEL.ACTIVITIES}
              size={20}
              className={`${nodeData?.postFunctionalityList?.length && 'text-hover-warning'} me-1`}
              color={
                nodeData?.postFunctionalityList &&
                nodeData?.postFunctionalityList?.length > 0
                  ? "primary"
                  : "dark"
              }
              disabled={true}
              onClick={() =>
                nodeData?.postFunctionalityList?.length &&
                onViewOrManPowertableView(nodeData, "view")
              }
            />
          </div>
        )}
        <div className="fs-8 text-start">
          <span
            className={`text-hover-primary cursor-pointer ${deletedClass} ${additionClass}`}
            onClick={() => onViewOrManPowertableView(nodeData, "manPower")}
          >
            {langEn
              ? longLineBreaker(nodeData.titleEn || "", 17)
              : nodeData.titleBn
              ? longLineBreaker(nodeData.titleBn || "", 20)
              : COMMON_LABELS.NOT_ASSIGN}
          </span>
          <span> {manPower}</span>
        </div>
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

            const postName = !isObjectNull(item?.postDTO)
              ? langEn
                ? item?.postDTO?.nameEn
                : item?.postDTO?.nameBn
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
                    <span
                      className={`ms-1 mb-0 fs-8 ${
                        deletedClass || itemDeletedClass
                      } ${additionClass || itemAdditionClass}`}
                      // For grade tooltip
                      // data-bs-toggle="tooltip"
                      // data-bs-placement="right"
                      // title={
                      //   langEn
                      //     ? "Grade: " + item?.gradeDTO?.nameEn ||
                      //       COMMON_LABELS.EN.NOT_ASSIGN
                      //     : "গ্রেড: " + item?.gradeDTO?.nameBn ||
                      //       COMMON_LABELS.NOT_ASSIGN
                      // }
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
                    </span>
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

export const ShortNode = ({ langEn, nodeData, onViewOrManPowertableView }) => {
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
      <div className="rounded-top d-flex">
        {!nodeData?.isDeleted && (
          <div>
            <Icon
              icon="fact_check"
              variants="outlined"
              hoverTitle={LABEL.ACTIVITIES}
              size={20}
              className={`${nodeData?.postFunctionalityList?.length && 'text-hover-warning'} me-1`}
              color={
                nodeData?.postFunctionalityList &&
                nodeData?.postFunctionalityList?.length > 0
                  ? "primary"
                  : "light"
              }
              disabled={true}
              onClick={() =>
                nodeData?.postFunctionalityList?.length &&
                onViewOrManPowertableView(nodeData, "view")
              }
            />
          </div>
        )}
        <div className="fs-8 text-start">
          <span
            className={`text-hover-primary cursor-pointer ${deletedClass} ${additionClass}`}
            onClick={() => onViewOrManPowertableView(nodeData, "manPower")}
          >
            {langEn
              ? longLineBreaker(nodeData.titleEn || "", 17)
              : nodeData.titleBn
              ? longLineBreaker(nodeData.titleBn || "", 20)
              : COMMON_LABELS.NOT_ASSIGN}
          </span>
          <span> {manPower}</span>
        </div>
      </div>
    </div>
  );
};

export default MyNode;
