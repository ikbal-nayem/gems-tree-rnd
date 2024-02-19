import { Icon } from "@gems/components";
import { ReactNode } from "react";

type DrawerHeaderProps = {
  title: string | ReactNode;
  closeIconAction?: () => void;
  backIconAction?: () => void;
};

const DrawerHeader = ({
  title,
  closeIconAction,
  backIconAction,
}: DrawerHeaderProps) => {
  return (
    <div className="bg-white border-bottom position-sticky sticky-top d-flex align-items-center justify-content-between p-6">
      <div className="d-flex align-items-center">
        {backIconAction ? (
          <span
            className="material-icons-outlined me-2"
            role="button"
            onClick={backIconAction}
          >
            arrow_back
          </span>
        ) : null}
        <h3 className="mb-0">{title}</h3>
      </div>
      {closeIconAction ? (
        <Icon icon="close" color="danger"  onClick={closeIconAction} role="button" />
      ) : null}
    </div>
  );
};

export default DrawerHeader;
