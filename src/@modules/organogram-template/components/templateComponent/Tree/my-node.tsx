import { Icon } from "@gems/components";
// import { Dropdown, DropdownItem, Icon, IconButton } from "@gems/components";
import "./my-node.css";
import { COMMON_LABELS } from "@constants/common.constant";
// import { Dropdown, DropdownItem } from "../Dropdown";
// import { Button, Modal } from "react-bootstrap";
// const propTypes = {
//   nodeData: PropTypes.object.isRequired
// };

const MyNode = ({ nodeData, treeDispatch, postList, firstNode }) => {
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
          />
          <div>
            <p className="p-1 mb-0 fs-7">{nodeData.titleEn}</p>
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
            />
            {!firstNode && (
              <Icon
                icon="remove_circle"
                size={20}
                color="danger"
                onClick={() => treeDispatch("REMOVE", nodeData)}
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
              return (
                <div key={i}>
                  {item?.numberOfEmployee || item?.postDto?.nameBn ? (
                    <div className="d-flex">
                      <p className="mb-0 fs-7">
                        {item?.numberOfEmployee
                          ? item?.numberOfEmployee
                          : 0 || null}{" "}
                      </p>
                      <p className="mb-0 fs-7 ms-1">x</p>
                      <p className="mb-0 fs-7 ms-1">
                        {(postList?.length > 0 &&
                          item?.organizationPost?.id &&
                          postList?.find(
                            (d) => d?.id === item?.organizationPost?.id
                          )?.nameEn) ||
                          COMMON_LABELS.EN.NOT_ASSIGN}
                      </p>
                    </div>
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
