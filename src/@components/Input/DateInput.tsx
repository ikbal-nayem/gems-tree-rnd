import { ISizes } from "@interface/common.interface";
import { FC, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import { range } from "utility/random-generate";
import "./style.scss";
import { DATE_PATTERN, generateDateFormat } from "@gems/utils";
import { IconButton } from "@gems/components";

const getMonth = (date) => date.getMonth();
const getYear = (date) => date.getFullYear();

const Calender = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => {
  const years = range(1900, getYear(new Date()) + 5, 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <div className="d-flex justify-content-center m-3">
      <IconButton
        onClick={decreaseMonth}
        isDisabled={prevMonthButtonDisabled}
        iconName="navigate_before"
      />
      <select
        className="form-control form-control-sm"
        value={months[getMonth(date)]}
        onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
      >
        {months.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        className="form-control form-control-sm"
        value={getYear(date)}
        onChange={({ target: { value } }) => changeYear(value)}
      >
        {years.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <IconButton
        onClick={increaseMonth}
        isDisabled={nextMonthButtonDisabled}
        iconName="navigate_next"
      />
    </div>
  );
};

type IDateInputProps = {
  control?: any;
  onChange?: (val: { name: string; value: number }) => void;
  value?: any;
  name?: string;
  placeholder?: string;
  size?: ISizes;
  variant?: "solid" | "outline";
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  isRequired?: boolean | string;
  hasInfo?: boolean;
  infoText?: string;
  isError?: boolean;
  isValid?: boolean;
  errorMessage?: string;
  noMargin?: boolean;
  disabled?: boolean;
  className?: string;
  blockFutureDate?: boolean;
  helpText?: string;
  viewOnly?: string | number | Date;
};

const DateInput: FC<IDateInputProps> = ({
  control,
  name,
  placeholder,
  onChange,
  value,
  label,
  size = "sm",
  variant = "outline",
  minDate,
  maxDate,
  hasInfo,
  infoText,
  isRequired,
  className,
  disabled,
  errorMessage,
  isError,
  isValid,
  noMargin,
  blockFutureDate,
  helpText,
  viewOnly,
}) => {
  const [dateValue, setDateValue] = useState<any>();

  useEffect(() => {
    setDateValue(value);
  }, [value]);

  const onDateSelect = (d) => {
    setDateValue(d);
    !!onChange && onChange({ name, value: d });
  };

  const DPComponent = ({ onDateChange, date }) => (
    <ReactDatePicker
      placeholderText={placeholder || "dd/mm/yyyy"}
      onChange={(d) => onDateChange(d?.getTime())}
      selected={date ? new Date(date) : null}
      popperPlacement="auto"
      name={name}
      disabled={disabled}
      dateFormat="dd/MM/yyyy"
      minDate={minDate ? new Date(minDate) : null}
      maxDate={
        blockFutureDate ? new Date() : maxDate ? new Date(maxDate) : null
      }
      renderCustomHeader={Calender}
      customInput={<InputMask type="text" mask="99/99/9999" />}
      className={`form-control form-control-${size} form-control-${variant} ${
        isError ? "is-invalid" : ""
      } ${isValid ? "is-valid" : ""}`}
    />
  );

  return (
    <div
      className={`w-100 fv-row ${className || ""} ${noMargin ? "" : "mb-6"}`}
    >
      {label ? (
        <label className="d-flex align-items-center fs-5">
          <span className={isRequired ? "required" : ""}>{label}</span>
          {hasInfo && (
            <i
              className="fas fa-exclamation-circle ms-2 fs-7"
              data-bs-toggle="tooltip"
              title={infoText}
            />
          )}
        </label>
      ) : null}
      {!!viewOnly ? (
        <span className="ms-2 fs-4">
          {generateDateFormat(viewOnly, DATE_PATTERN.CASUAL)}
        </span>
      ) : control ? (
        <Controller
          control={control}
          name={name}
          rules={{ required: isRequired }}
          render={({ field }) => (
            <DPComponent
              onDateChange={(dt) => {
                field.onChange(dt);
                !!onChange && onChange({ name, value: dt });
              }}
              date={field.value}
            />
          )}
        />
      ) : (
        <DPComponent onDateChange={onDateSelect} date={dateValue} />
      )}
      {isError && !viewOnly ? (
        <div className="invalid-feedback d-block">{errorMessage}</div>
      ) : !!helpText && !viewOnly ? (
        <div className="form-text text-gray-600">{helpText}</div>
      ) : null}
    </div>
  );
};

export { DateInput };
