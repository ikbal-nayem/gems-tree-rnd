import { Icon } from "@gems/components";
import { IColors } from "@gems/utils";
import { useState } from "react";

type ISwitch = {
  label?: string;
  isRequired?: boolean;
  hasInfo?: boolean;
  infoText?: string;
  value?: string | number;
  name?: string;
  defaultChecked?: boolean;
  switchLabel?: string | number;
  onChange?: (event) => void;
  registerProperty?: any;
  className?: string;
  noMargin?: boolean;
  color?: IColors;
};

const hexaColor = {
	primary:'#009ef7',
    secondary: '#E4E6EF',
    success: '#229954',
    info: '#7239ea',
    warning: '#E67E22',
    danger: '#ca3525',
    dark: '#5E6278',
}

const Switch = ({
  label,
  isRequired,
  hasInfo,
  infoText,
  value,
  name,
  defaultChecked,
  switchLabel,
  onChange,
  registerProperty,
  className,
  noMargin = false,
  color='primary',
}: ISwitch) => {
  const [isChecked, setIsChecked] = useState(false);

  const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    onChange(event);
  };
  return (
    <div
      className={`d-flex align-items-center justify-content-between ${
        noMargin ? "" : "mb-6"
      } ${className || ""}`}
    >
      <label
        htmlFor={name || "switch"}
        className="d-flex align-items-center fs-5 cursor-pointer"
      >
        <span className={isRequired ? "required" : ""}>{label}</span>
        {hasInfo && <Icon icon="info" size={15} hoverTitle={infoText} />}
      </label>

      <div className="form-check form-switch form-switch-sm form-check-custom form-check-solid">
        <input
          className={`form-check-input cursor-pointer `}
          required={isRequired}
          type="checkbox"
          value={value || ""}
          name={name || "switch"}
          id={name || "switch"}
          onChange={onHandleChange}
          defaultChecked={defaultChecked}
          style={{
            backgroundColor: isChecked ? hexaColor[color] : "#B5B5C3",
          }}
          {...registerProperty}
        />
        <label htmlFor={name || "switch"} className="form-check-label cursor-pointer">
          {switchLabel || null}
        </label>
      </div>
    </div>
  );
};

export default Switch;
