import { LABELS } from "@constants/common.constant";
import {
  Checkbox,
  IconButton,
  Input,
  Label,
  Separator,
} from "@gems/components";
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
        {fields.map((f, idx) => {
          const label = "তালিকা";
          const labelBn = label + " (বাংলা)";
          const labelEn = label + " (ইংরেজি)";

          return (
            <div
              key={idx}
              className="d-flex align-items-top gap-3 mt-3 w-100 border rounded pt-3 px-3 my-2 bg-gray-100 pb-3 pb-xl-0"
            >
              <div className={idx < 1 ? "mt-8" : "mt-2"}>
                <Label> {numEnToBn(idx + 1) + "।"} </Label>
              </div>
              <div className="row w-100">
                <div className="col-xl-5 col-12">
                  <Input
                    label={idx < 1 ? labelBn : ""}
                    placeholder={labelBn + " লিখুন"}
                    autoFocus
                    registerProperty={{
                      ...register(`attachmentDtoList.${idx}.titleBn`, {
                        required: labelBn + " লিখুন",
                        validate: bnCheck,
                      }),
                    }}
                    isError={!!errors?.attachmentDtoList?.[idx].titleBn}
                    errorMessage={
                      errors?.attachmentDtoList?.[idx]?.titleBn
                        ?.message as string
                    }
                  />
                </div>
                <div className="col-xl-4 col-12">
                  <Input
                    label={idx < 1 ? labelEn : ""}
                    placeholder={labelEn + " লিখুন"}
                    autoFocus
                    registerProperty={{
                      ...register(`attachmentDtoList.${idx}.titleEn`, {
                        required: labelEn + " লিখুন",
                        validate: enCheck,
                      }),
                    }}
                    isError={!!errors?.attachmentDtoList?.[idx].titleEn}
                    errorMessage={
                      errors?.attachmentDtoList?.[idx]?.titleEn
                        ?.message as string
                    }
                  />
                </div>
                <div
                  className={
                    idx < 1 ? "col-xl-3 mt-xl-9 mt-0" : "col-xl-3 mt-3"
                  }
                >
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
              <div className={idx < 1 ? "mt-6" : ""}>
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
          );
        })}
      </div>
    </div>
  );
};

export default CheckListForm;
