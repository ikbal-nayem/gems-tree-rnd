import { Icon } from "@gems/components";

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
};

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
}: ISwitch) => {
	return (
		<div
			className={`d-flex align-items-center justify-content-between ${
				noMargin ? "" : "mb-6"
			} ${className || ""}`}
		>
			<label className="d-flex align-items-center fs-5">
				<span className={isRequired ? "required" : ""}>{label}</span>
				{hasInfo && <Icon icon="info" size={15} hoverTitle={infoText} />}
			</label>

			<div className="form-check form-switch form-switch-sm form-check-custom form-check-solid">
				<input
					className="form-check-input cursor-pointer"
					required={isRequired}
					type="checkbox"
					value={value || ""}
					name={name || "switch"}
					onChange={onChange}
					defaultChecked={defaultChecked}
					{...registerProperty}
				/>
				<label className="form-check-label">{switchLabel || null}</label>
			</div>
		</div>
	);
};

export default Switch;
