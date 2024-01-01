import { Icon } from "@gems/components";
// import { Dropdown, DropdownItem, Icon, IconButton } from "@gems/components";
import TextBlock from "@components/TextBlock";
import { COMMON_LABELS } from "@constants/common.constant";
import { notNullOrUndefined, numEnToBn } from "@gems/utils";
import { isNotEmptyList, longLineBreaker } from "utility/utils";
import "./my-node.css";
// import { Dropdown, DropdownItem } from "../Dropdown";
// import { Button, Modal } from "react-bootstrap";
// const propTypes = {
//   nodeData: PropTypes.object.isRequired
// };

const MyNode = ({
  nodeData,
  treeDispatch,
  postList,
  firstNode,
  isNotEnamCommittee,
}) => {
  return (
    <div>
      <div className="position rounded">
        <div className="d-flex justify-content-between">
          {/* <IconButton iconName="more_vert" color="warning" iconSize={16}/> */}
          <Icon
            icon="edit_square"
            size={20}
            color="warning"
            onClick={() => treeDispatch("EDIT", nodeData)}
            hoverTitle={
              isNotEnamCommittee ? "এই নোড আপডেট করুন" : "Update this node"
            }
          />
          <div>
            <p className="p-1 mb-0 fs-7">
              {isNotEnamCommittee
                ? longLineBreaker(nodeData.titleBn||"", 20)
                : longLineBreaker(nodeData.titleEn||"", 17)}
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
          <div>
            <Icon
              icon="add_circle"
              size={20}
              color="success"
              onClick={() => treeDispatch("ADD", nodeData)}
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
        </div>
        <div
          className={`bg-light text-start ${
            nodeData?.manpowerList?.length ? "p-1" : ""
          }`}
        >
          {nodeData?.manpowerList?.length > 0 &&
            nodeData?.manpowerList?.map((item, i) => {
              let mp = item?.numberOfEmployee ? item?.numberOfEmployee : 0;
              mp = isNotEnamCommittee ? numEnToBn(mp) : mp;
              const postExists =
                isNotEmptyList(postList) && item?.organizationPost?.id;

              const post = postExists
                ? postList?.find((d) => d?.id === item?.organizationPost?.id)
                : null;

              const postName = isNotEnamCommittee
                ? post?.nameBn || COMMON_LABELS.NOT_ASSIGN
                : post?.nameEn || COMMON_LABELS.EN.NOT_ASSIGN;

              return (
                <div key={i}>
                  {item?.numberOfEmployee || item?.postDto?.nameBn ? (
                    <div
                      className={`d-flex ${
                        item?.postType === "proposed"
                          ? "text-primary"
                          : item?.postType === "nonPermanent"
                          ? "text-success"
                          : ""
                      }`}
                    >
                      <p className="mb-0 fs-7">{mp} </p>
                      <p className="mb-0 fs-7 ms-1">x</p>
                      <p className="mb-0 fs-7 ms-1">{postName}</p>
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
