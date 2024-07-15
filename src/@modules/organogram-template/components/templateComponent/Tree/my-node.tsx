import TextBlock from "@components/TextBlock";
import { COMMON_LABELS } from "@constants/common.constant";
import { Icon } from "@gems/components";
import { IObject, notNullOrUndefined, numEnToBn } from "@gems/utils";
import { isNotEmptyList, longLineBreaker } from "utility/utils";
import "./my-node.css";

const MyNode = ({
  nodeData,
  treeDispatch,
  firstNode,
  isNotEnamCommittee,
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
          nodeData?.isDeleted ? "text-line-through-color-red" : ""
        }`}
      >
        <div className="d-flex justify-content-between">
          {/* <IconButton iconName="more_vert" color="warning" iconSize={16}/> */}
          {!nodeData?.isDeleted && (
            <Icon
              icon="edit_square"
              size={20}
              color="warning"
              onClick={() => treeDispatch("EDIT", nodeData)}
              hoverTitle={
                isNotEnamCommittee ? "এই নোড আপডেট করুন" : "Update this node"
              }
            />
          )}
          <div>
            <p className="p-1 mb-0 fs-7">
              {isNotEnamCommittee
                ? nodeData.titleBn
                  ? longLineBreaker(nodeData.titleBn || "", 20)
                  : COMMON_LABELS.NOT_ASSIGN
                : longLineBreaker(nodeData.titleEn || "", 17)}
              {/* + " (" +
                nodeData.displayOrder +
                ")"} */}
            </p>
          </div>
          {/* <span className="me-1 p-2">{nodeData.nameBn}</span> */}
          {/* <Dropdown
						btnContent={<Icon icon="more_vert" size={20} />}
						btnIcon
						btnColor="dark"
					>
						<DropdownItem onClick={() => treeDispatch("ADD", nodeData)}>
							<Icon icon="person_add" />
							&nbsp; জনবল যুক্ত করুন
						</DropdownItem>
						<DropdownItem onClick={() => treeDispatch("EDIT", nodeData)}>
							<Icon icon="add_task" color="danger" />
							&nbsp; তথ্য হালনাগাদ করুন
						</DropdownItem>
						<DropdownItem onClick={() => treeDispatch("REMOVE", nodeData)}>
							<Icon icon="person_remove" color="danger" />
							&nbsp; বিলুপ্ত করুন
						</DropdownItem>
					</Dropdown> */}
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
                hoverTitle={
                  isNotEnamCommittee
                    ? "পরবর্তী স্তরে নতুন নোড যোগ করুন"
                    : "Add new node into next layer"
                }
              />
              {!firstNode && (
                <Icon
                  icon="remove_circle"
                  size={20}
                  color="danger"
                  onClick={() => treeDispatch("REMOVE", nodeData)}
                  hoverTitle={
                    isNotEnamCommittee ? "এই নোড মুছুন" : "Delete this node"
                  }
                />
              )}
            </div>
          )}
        </div>
        <div
          className={`bg-light text-start ${
            nodeData?.manpowerList?.length ? "p-1" : ""
          }`}
        >
          {isNotEmptyList(nodeData?.manpowerList) &&
            nodeData?.manpowerList?.map((item, i) => {
              let mp = item?.numberOfEmployee ? item?.numberOfEmployee : 0;
              mp = isNotEnamCommittee ? numEnToBn(mp) : mp;

              const postName = isNotEnamCommittee
                ? item?.postDTO?.post?.nameBn || COMMON_LABELS.NOT_ASSIGN
                : item?.postDTO?.nameEn || COMMON_LABELS.EN.NOT_ASSIGN;

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
                        item?.isDeleted ? "text-line-through-color-red" : ""
                      }`}
                    >
                      <p className="mb-0 fs-7">{mp} </p>
                      <p className="mb-0 fs-7 ms-1">x</p>
                      <p className="mb-0 fs-7 ms-1">
                        {postName || ""}
                        {item?.alternativePostListDTO?.length > 0
                          ? item?.alternativePostListDTO?.map(
                              (ap: IObject) =>
                                ` / ${
                                  isNotEnamCommittee ? ap?.nameBn : ap?.nameEn
                                }`
                            )
                          : ""}
                      </p>
                    </div>
                  ) : null}
                </div>
              );
            })}
        </div>
        {notNullOrUndefined(nodeData?.commentNode) && (
          <div className="pt-3 ps-2 bg-light text-start ">
            {/* <u className="d-flex justify-content-start ">{isNotEnamCommittee ? "বি. দ্র. :" : "N.B. :"}</u>   */}
            <TextBlock value={nodeData?.commentNode} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNode;
