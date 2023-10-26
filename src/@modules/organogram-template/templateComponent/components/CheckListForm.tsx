import { LABELS } from "@constants/common.constant";
import { IconButton, Input, Separator } from "@gems/components";
import { numEnToBn } from "@gems/utils";
import { useFieldArray } from "react-hook-form";
import "../style.scss";

interface ICheckListForm {
  formProps: any;
}

const CheckListForm = ({ formProps }: ICheckListForm) => {
  const { register, control } = formProps;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attachmentDtoList",
  });

  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.CHECK_LIST}</h4>
        <IconButton iconName="add" color="primary" onClick={() => append("")} />
      </div>
      <Separator className="mt-1 mb-2" />
      <div>
        {fields.map((f, idx) => (
          <div key={idx} className="d-flex gap-3 mt-3">
            <Input
              placeholder={`তালিকা ${numEnToBn(idx + 1)}`}
              // isRequired
              noMargin
              autoFocus
              registerProperty={{
                ...register(`attachmentDtoList.${idx}.titleBn`, {
                  // required: "তালিকা যুক্ত করুন",
                }),
              }}
              // isError={!!errors?.attachmentDtoList?.[idx].titleBn}
              // errorMessage={
              //   errors?.attachmentDtoList?.[idx]?.titleBn?.message as string
              // }
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

export default CheckListForm;
