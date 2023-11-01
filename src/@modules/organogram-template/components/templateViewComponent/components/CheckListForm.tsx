import { LABELS } from "@constants/common.constant";
import { Checkbox, IconButton, Input, Separator } from "@gems/components";
import { numEnToBn } from "@gems/utils";
import { useFieldArray } from "react-hook-form";
import "../style.scss";
import { bnCheck, enCheck } from "utility/checkValidation";

interface ICheckListForm {
  formProps: any;
}

const CheckListForm = ({ formProps }: ICheckListForm) => {
  const {
    register,
    control,
    formState: { errors },
  } = formProps;

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
          <div
            key={idx}
            className="d-flex align-items-center gap-3 mt-3 w-100 border rounded p-3 my-2 bg-gray-100"
          >
            <div className="row w-100">
              <div className="col-xl-5 col-12">
                <Input
                  label="তালিকা বাংলা"
                  placeholder={`তালিকা বাংলা ${numEnToBn(idx + 1)}`}
                  autoFocus
                  registerProperty={{
                    ...register(`attachmentDtoList.${idx}.titleBn`, {
                      // required: "তালিকা যুক্ত করুন",
                      validate: bnCheck,
                    }),
                  }}
                  isError={!!errors?.attachmentDtoList?.[idx].titleBn}
                  errorMessage={
                    errors?.attachmentDtoList?.[idx]?.titleBn?.message as string
                  }
                />
              </div>
              <div className="col-xl-4 col-12">
                <Input
                  label="তালিকা ইংরেজি"
                  placeholder={`তালিকা ইংরেজি ${numEnToBn(idx + 1)}`}
                  autoFocus
                  registerProperty={{
                    ...register(`attachmentDtoList.${idx}.titleEn`, {
                      // required: "তালিকা যুক্ত করুন",
                      validate: enCheck,
                    }),
                  }}
                  isError={!!errors?.attachmentDtoList?.[idx].titleEn}
                  errorMessage={
                    errors?.attachmentDtoList?.[idx]?.titleEn?.message as string
                  }
                />
              </div>
              <div className="col-xl-3 mt-xl-7 mt-0">
                <Checkbox
                  label="বাধ্যতামূলক ?"
                  noMargin
                  labelClass="mb-0"
                  registerProperty={{
                    ...register(`attachmentDtoList.${idx}.isMandatory`),
                  }}
                />
              </div>
            </div>
            <div>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckListForm;
