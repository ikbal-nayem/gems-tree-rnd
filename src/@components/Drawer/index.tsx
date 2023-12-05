import { ReactNode } from "react";
import DrawerHeader from "./DrawerHeader";

type DrawerProps = {
  title?: string | ReactNode;
  children: JSX.Element | JSX.Element[] | string;
  isOpen: boolean;
  handleClose?: () => void;
  className?: string;
  closeOnBackdropClick?: boolean;
  width?: "0" | "25" | "50" | "75" | "100";
  widthMd?: "0" | "25" | "50" | "75" | "100";
  widthXl?: "0" | "25" | "50" | "75" | "100";
};

export default ({
  title,
  className,
  children,
  isOpen,
  handleClose,
  closeOnBackdropClick = true,
  width,
  widthMd,
  widthXl,
}: DrawerProps) => {
  if (!isOpen) return null;
  return (
    <>
      <div
        className={`bg-body drawer drawer-end drawer-on w-${
          width || "100"
        } w-md-${widthMd || "50"} w-xl-${widthXl || "25"} ${className || ""}`}
        // className={`bg-body drawer drawer-end drawer-on w-50`}
      >
        <div className="w-100">
          {title ? (
            <DrawerHeader
              title={title}
              closeIconAction={handleClose}
              backIconAction={handleClose}
            />
          ) : null}
          {children}
          {/* <DrawerBody>{children}</DrawerBody> */}
        </div>
      </div>
      <div
        className="drawer-overlay"
        style={{ zIndex: 109 }}
        onClick={() => closeOnBackdropClick && handleClose()}
      />
    </>
  );
};
