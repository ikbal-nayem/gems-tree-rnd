// import { ROLES_PERMISSION_TYPES } from "@constants/common.constant";
import { Icon } from "@gems/components";
import { IObject } from "@gems/utils";
import { useState } from "react";

interface IModuleNodeComponent {
  data?: any;
}

type ChildNodeProps = {
  nodeData: IObject;
  isOpen?: boolean;
  handleClose?: () => void;
  hasChild?: boolean;
};

const ChildNode = ({
  nodeData,
  isOpen,
  handleClose,
  hasChild,
}: ChildNodeProps) => {
  return (
    <div className="mb-6">
      <div className="d-flex mb-2">
        <Icon
          icon={isOpen ? "remove_circle_outline" : "add_circle_outline"}
          className={`${!hasChild ? "text-muted" : ""} me-2`}
          size={20}
          disabled={!hasChild}
          onClick={handleClose}
        />
        <div>
          {nodeData?.nameBn}
          <p className="mb-0 text-gray-600"> {nodeData?.nameEn}</p>
        </div>
      </div>
    </div>
  );
};

const ParentNode = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(!isOpen);

  if (item?.children?.length)
    return (
      <div>
        <ChildNode
          nodeData={item}
          isOpen={isOpen}
          handleClose={handleClose}
          hasChild
        />
        {isOpen && (
          <div className="ms-8">
            <ModuleNodeComponent data={item?.children} />
          </div>
        )}
      </div>
    );
  return <ChildNode nodeData={item} />;
};

const ModuleNodeComponent = ({ data }: IModuleNodeComponent) => {
  let isDataArray = Array.isArray(data);
  return (
    <>
      {isDataArray
        ? data?.length > 0 &&
          data?.map((item, i) => (
            <div key={i}>
              <ParentNode item={item} />
            </div>
          ))
        : Object.keys(data)?.length > 0 && (
            <div>
              <ParentNode item={data} />
            </div>
          )}
    </>
  );
};

export default ModuleNodeComponent;
