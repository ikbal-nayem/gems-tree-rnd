import { COMMON_LABELS } from "@gems/utils";
import "./my-node.css";
import { Icon } from "@gems/components";

const MyNode = ({ nodeData, postList, onView }) => {
  return (
    <div>
      <div className="position rounded">
        <div className="row">
          <div className="col-11 d-flex justify-content-center">
            <h5 className="p-1 mb-0">{nodeData.titleBn}</h5>
          </div>
          <div className="col-1 d-flex justify-content-end">
            <div className="d-flex justify-content-end">
              <Icon
                icon="visibility"
                size={20}
                color="primary"
                onClick={() => onView(nodeData)}
              />
            </div>
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
                      {item?.numberOfEmployee || null} x{" "}
                      {(postList?.length > 0 &&
                        item?.organizationPost?.id &&
                        postList?.find(
                          (d) => d?.id === item?.organizationPost?.id
                        )?.nameBn) ||
                        COMMON_LABELS.NOT_ASSIGN}
                    </p>
                  ) : null}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default MyNode;
