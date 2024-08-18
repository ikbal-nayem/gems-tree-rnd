import TextBlock from "@components/TextBlock";
import { COMMON_LABELS } from "@constants/common.constant";
import { Icon } from "@gems/components";
import { notNullOrUndefined, numEnToBn } from "@gems/utils";
import { isNotEmptyList, longLineBreaker } from "utility/utils";
import "./my-node.css";

const MyNode = ({
  nodeData,
  treeDispatch,
  firstNode,
  maxNodeCode,
  setMaxNodeCode,
  maxManpowerCode,
  setMaxManpowerCode,
}) => {
  isNotEmptyList(nodeData?.manpowerList) &&
    nodeData?.manpowerList.sort((a, b) => {
      if (!notNullOrUndefined(a.gradeOrder)) return 1;
      if (!notNullOrUndefined(b.gradeOrder)) return -1;
      if (a.gradeOrder === b.gradeOrder) return 0;
      return a.gradeOrder > b.gradeOrder ? 1 : -1;
    });
  return (
    <div>
      <div
        className={`position rounded ${
          nodeData?.isDeleted ? "text-line-through-color-red " : " "
        }${nodeData?.isAddition ? "text-underline-color-black" : ""}`}
      >
        <div className="d-flex justify-content-between">
          {/* <IconButton iconName="more_vert" color="warning" iconSize={16}/> */}
          {!nodeData?.isDeleted && (
            <div>
              <Icon
                icon="edit_square"
                size={20}
                color="warning"
                onClick={() => treeDispatch("EDIT", nodeData)}
                hoverTitle={"এই নোড আপডেট করুন"}
              />
            </div>
          )}
          <div>
            <p
              className={`p-1 mb-0 fs-7 ${
                nodeData?.isModified ? "text-underline-color-yellow" : ""
              }`}
            >
              {nodeData.titleBn
                ? longLineBreaker(nodeData.titleBn || "", 20)
                : COMMON_LABELS.NOT_ASSIGN}
            </p>
          </div>
          {!nodeData?.isDeleted && (
            <div>
              <Icon
                icon="add_circle"
                size={20}
                color="success"
                onClick={() => {
                  treeDispatch("ADD", nodeData);
                  setMaxNodeCode(maxNodeCode + 1);
                  setMaxManpowerCode(maxManpowerCode + 1);
                }}
                hoverTitle={"পরবর্তী স্তরে নতুন নোড যোগ করুন"}
              />
              {!firstNode && (
                <Icon
                  icon="remove_circle"
                  size={20}
                  color="danger"
                  onClick={() => treeDispatch("REMOVE", nodeData)}
                  hoverTitle={"এই নোড মুছুন"}
                />
              )}
            </div>
          )}
          {nodeData?.isDeleted && !nodeData?.isParentDeleted && (
            <div className="text-decoration-none">
              <Icon
                icon="change_circle"
                size={20}
                color="warning"
                onClick={() => treeDispatch("REMOVE_UNDO", nodeData)}
                hoverTitle={"মুছে ফেলা এই নোড পূর্বাবস্থায় নিন"}
              />
            </div>
          )}
        </div>
        <div
          className={`bg-light text-start ${
            nodeData?.manpowerList?.length ? "p-1" : ""
          }`}
        >
          {nodeData?.manpowerList?.length > 0 &&
            nodeData?.manpowerList?.map((item, i) => {
              let mp = item?.numberOfEmployee ? item?.numberOfEmployee : 0;
              mp = numEnToBn(mp);
              const postName =
                item?.postDTO?.nameBn || COMMON_LABELS.NOT_ASSIGN;

              return (
                <div key={i}>
                  {item?.numberOfEmployee || postName ? (
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
                      }${
                        item?.isAddition ? "text-underline-color-black" : " "
                      }${
                        item?.isModified ? "text-underline-color-yellow" : ""
                      }`}
                    >
                      <p className="mb-0 fs-7">{mp} </p>
                      <p className="mb-0 fs-7 ms-1">x</p>
                      <p className="mb-0 fs-7 ms-1">
                        {longLineBreaker(postName, 17)}
                      </p>
                    </div>
                  ) : null}
                </div>
              );
            })}
        </div>
        {notNullOrUndefined(nodeData?.commentNode) && (
          <div className="pt-3 ps-2 bg-light text-start ">
            <TextBlock value={nodeData?.commentNode} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNode;
