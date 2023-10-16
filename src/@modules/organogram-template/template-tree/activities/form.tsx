import { IconButton, Input } from "@gems/components";
import { numEnToBn } from "@gems/utils";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

const Form = ({ data, onOtherDataSet }) => {
  const {
    register,
    control,
    formState: { errors },
    reset,
    getValues,
  } = useForm<any>({
    defaultValues: { activities: [""] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "activities",
  });

  useEffect(() => {
    data ? reset({ ...data?.activities }) : append("");
  }, [data]);

  const onDataChange = () => {
    onOtherDataSet("activities", getValues()?.activities);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="m-0">কার্যক্রম</h5>
        <IconButton iconName="add" color="primary" onClick={() => append("")} />
      </div>
      <form>
        {fields.map((f, idx) => (
          <div key={idx} className="d-flex gap-3 mt-3">
            <Input
              placeholder={`কার্যক্রম ${numEnToBn(idx + 1)}`}
              isRequired
              noMargin
              autoFocus
              registerProperty={{
                ...register(`activities.${idx}`, {
                  required: "কার্যক্রম যুক্ত করুন",
                  onChange: onDataChange,
                }),
              }}
              isError={!!errors?.activities?.[idx]}
              errorMessage={errors?.activities?.[idx]?.message as string}
            />
            <IconButton
              iconName="delete"
              color="danger"
              isDisabled={fields.length === 1}
              iconSize={15}
              rounded={false}
              onClick={() => {
                remove(idx);
                onDataChange();
              }}
            />
          </div>
        ))}
      </form>
    </>
  );
};

export default Form;
