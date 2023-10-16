import { IconButton, Input } from "@gems/components";
import { numEnToBn } from "@gems/utils";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

const Form = ({ data, onOtherDataSet }) => {
  const {
    register,
    control,
    formState: { errors },
    reset,
    getValues,
  } = useForm<any>({
    defaultValues: { checkList: [""] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "checkList",
  });

  useEffect(() => {
    data
      ? reset({ ...data?.checkList })
      : append("");
  }, [data]);

  const onDataChange = () => {
    onOtherDataSet("checkList", getValues()?.checkList);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="m-0">তালিকা</h5>
        <IconButton iconName="add" color="primary" onClick={() => append("")} />
      </div>
      <form>
        {fields.map((f, idx) => (
          <div key={idx} className="d-flex gap-3 mt-3">
            <Input
              placeholder={`তালিকা ${numEnToBn(idx + 1)}`}
              isRequired
              noMargin
              autoFocus
              registerProperty={{
                ...register(`checkList.${idx}`, {
                  required: "তালিকা যুক্ত করুন",
                  onChange: onDataChange,
                }),
              }}
              isError={!!errors?.checkList?.[idx]}
              errorMessage={
                errors?.checkList?.[idx]?.message as string
              }
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
