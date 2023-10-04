import React, { useState } from "react";
import "./my-node.css";
import { Dropdown, DropdownItem, Icon } from "@gems/components";
import { COMMON_LABELS } from "@gems/utils";
// import { Dropdown, DropdownItem } from "../Dropdown";
// import { Button, Modal } from "react-bootstrap";
// const propTypes = {
//   nodeData: PropTypes.object.isRequired
// };

const MyNode = ({ nodeData, treeDispatch }) => {
  const [show, setShow] = useState(false);
  const selectNode = () => {
    alert(
      "Hi All. I'm " +
        nodeData.nameBn +
        ". I'm a " +
        nodeData.organization.nameBn +
        "."
    );
  };

  // const [show, setShow] = useState(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  return (
    // <div onClick={selectNode}>
    <div>
      <div className="position">
        <div className="d-flex justify-content-between">
          <span className="me-1">{nodeData.nameBn}</span>
          <Dropdown
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
              &nbsp; টাস্ক যুক্ত করুন
            </DropdownItem>
            <DropdownItem onClick={() => treeDispatch("REMOVE", nodeData)}>
              <Icon icon="person_remove" color="danger" />
              &nbsp; জনবল বিলুপ্ত করুন
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
      {/* {show && <div className="fullname">{nodeData.organization.nameBn}</div>} */}
    </div>
  );
};

// MyNode.propTypes = propTypes;

export default MyNode;
