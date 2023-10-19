import { Icon } from "@gems/components";
// import { Dropdown, DropdownItem, Icon, IconButton } from "@gems/components";
import "./my-node.css";
// import { Dropdown, DropdownItem } from "../Dropdown";
// import { Button, Modal } from "react-bootstrap";
// const propTypes = {
//   nodeData: PropTypes.object.isRequired
// };

const MyNode = ({ nodeData, treeDispatch }) => {
  return (
    <div>
      <div className="position rounded">
        <div className="d-flex justify-content-between">
          {/* <IconButton iconName="more_vert" color="warning" iconSize={16}/> */}
          <Icon
            icon="edit_square"
            size={22}
            color="warning"
            onClick={() => treeDispatch("EDIT", nodeData)}
          />
          <div>
            <h5 className="p-1 mb-0">{nodeData.nameBn}</h5>
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
              size={22}
              color="success"
              onClick={() => treeDispatch("ADD", nodeData)}
            />
            <Icon
              icon="remove_circle"
              size={22}
              color="danger"
              onClick={() => treeDispatch("REMOVE", nodeData)}
            />
          </div>
        </div>
        <div
          className={`bg-light text-start ${
            nodeData?.employee?.length ? "p-3" : ""
          }`}
        >
          {nodeData?.employee?.length > 0 &&
            nodeData?.employee?.map((item, i) => {
              return (
                <div key={i}>
                  {item?.employeeNumber || item?.post?.nameBn ? (
                    <p className="mb-0">
                      {item?.employeeNumber || null} x{" "}
                      {item?.post?.nameBn || null}
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
