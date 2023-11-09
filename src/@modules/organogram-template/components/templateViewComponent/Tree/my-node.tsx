import "./my-node.css";
import { Icon } from "@gems/components";
import { COMMON_LABELS, LABELS } from "@constants/common.constant";
import { numEnToBn } from "@gems/utils";

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
    <div className="position rounded">
      <div className="row ms-2">
        <div className="col-1 d-flex justify-content-end">
          <Icon
            icon="visibility"
            hoverTitle={LABEL.ACTIVITIES}
            size={20}
            color="primary"
            onClick={() => onView(nodeData)}
          />
        </div>
        <div className="col-10 d-flex justify-content-center">
          <h5 className="p-1 mb-0">
            {langEn ? nodeData.titleEn : nodeData.titleBn}
          </h5>
        </div>
        <div className="col-1 d-flex justify-content-end ">
          <span className="border border-dark border-1 m-1 px-1 rounded">
            {manPower}
          </span>
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
                  <p className="mb-0">
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
