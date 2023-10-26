import { IconButton, Input, Separator } from "@gems/components";
// import Form from "./form";
import { LABELS } from "@constants/common.constant";
import { numEnToBn } from "@gems/utils";
import { useFieldArray } from "react-hook-form";
import "../style.scss";

interface IActivitiesForm {
  formProps: any;
}
const ActivitiesForm = ({ formProps }: IActivitiesForm) => {
  const { register, control } = formProps;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "mainActivitiesDtoList",
  });
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.MAIN_ACTIVITIES}</h4>
        <IconButton iconName="add" color="primary" onClick={() => append("")} />
      </div>
      <Separator className="mt-1 mb-2" />
      <div>
        {fields.map((f, idx) => (
          <div key={idx} className="d-flex justify-content-between gap-3 mt-3">
            <Input
              placeholder={`কার্যক্রম ${numEnToBn(idx + 1)}`}
              // isRequired
              noMargin
              autoFocus
              registerProperty={{
                ...register(`mainActivitiesDtoList.${idx}.mainActivity`, {
                  // required: "কার্যক্রম যুক্ত করুন",
                  // onChange: onDataChange,
                }),
              }}
              // isError={!!errors?.mainActivitiesDtoList?.[idx]?.mainActivity}
              // errorMessage={errors?.mainActivitiesDtoList?.[idx]?.mainActivity?.message as string}
            />
            <IconButton
              iconName="delete"
              color="danger"
              // isDisabled={fields.length === 1}
              iconSize={15}
              rounded={false}
              onClick={() => {
                remove(idx);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesForm;
