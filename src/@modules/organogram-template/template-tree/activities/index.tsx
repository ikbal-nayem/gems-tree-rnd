import { IconButton, Input, Separator } from "@gems/components";
// import Form from "./form";
import { LABELS } from "@constants/common.constant";
import { numEnToBn } from "@gems/utils";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import "../style.scss";

const Activities = ({ data, onOtherDataSet }) => {
  const {
    register,
    control,
    // formState: { errors },
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
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.MAIN_ACTIVITIES}</h4>
        <IconButton iconName="add" color="primary" onClick={() => append("")} />
      </div>
      {/* <div className="d-flex justify-content-between align-items-center">
        <h5 className="m-0">কার্যক্রম</h5>
      </div> */}
      <Separator className="mt-1 mb-2" />
      {/* <Form data={data} onOtherDataSet={onOtherDataSet} /> */}
      <form>
        {fields.map((f, idx) => (
          <div key={idx} className="d-flex gap-3 mt-3">
            <Input
              placeholder={`কার্যক্রম ${numEnToBn(idx + 1)}`}
              // isRequired
              noMargin
              autoFocus
              registerProperty={{
                ...register(`activities.${idx}`, {
                  // required: "কার্যক্রম যুক্ত করুন",
                  onChange: onDataChange,
                }),
              }}
              // isError={!!errors?.activities?.[idx]}
              // errorMessage={errors?.activities?.[idx]?.message as string}
            />
            <IconButton
              iconName="delete"
              color="danger"
              // isDisabled={fields.length === 1}
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
    </div>
  );
};

export default Activities;
