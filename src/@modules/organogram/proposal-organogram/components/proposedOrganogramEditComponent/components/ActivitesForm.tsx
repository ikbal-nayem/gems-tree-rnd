import { LABELS } from "@constants/common.constant";
import { IconButton, Input, Label, Separator } from "@gems/components";
import { notNullOrUndefined, numEnToBn } from "@gems/utils";
import { useFieldArray } from "react-hook-form";
import { enCheck } from "utility/checkValidation";

interface IActivitiesForm {
  formProps: any;
}
const ActivitiesForm = ({ formProps }: IActivitiesForm) => {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = formProps;

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "mainActivitiesDtoList",
  });

  const checkFieldIsDeleted = (field) => {
    return field?.isDeleted ? true : false;
  };

  console.log(watch("mainActivitiesDtoList"));

  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.MAIN_ACTIVITIES}</h4>
        <IconButton
          iconName="add"
          color="primary"
          onClick={() =>
            append({
              isAddition: true,
            })
          }
        />
      </div>
      <Separator className="mt-1 mb-2" />
      <div>
        {fields.map((f, idx) => {
          const label = "কার্যক্রম";
          const labelBn = label + " (বাংলা)";
          const labelEn = label + " (ইংরেজি)";
          return (
            <div
              key={idx}
              className="d-flex align-items-top gap-3 mt-1 border rounded px-3 my-1 bg-gray-100"
            >
              <div
                className={`d-flex align-items-top w-100 ${
                  checkFieldIsDeleted(f)
                    ? "disabledDiv border border-danger rounded p-1"
                    : ""
                }`}
              >
                <div className={idx < 1 ? "mt-8" : "mt-2"}>
                  <Label> {numEnToBn(idx + 1) + "।"} </Label>
                </div>
                <div className="row w-100">
                  <div className="col-xl-6 col-12">
                    <Input
                      label={idx < 1 ? labelBn : ""}
                      placeholder={labelBn + " লিখুন"}
                      isRequired
                      noMargin
                      registerProperty={{
                        ...register(
                          `mainActivitiesDtoList.${idx}.mainActivityBn`,
                          {
                            required: " ",
                            onChange: (e) => {
                              if (notNullOrUndefined(e.target.value)) {
                                setValue(
                                  `mainActivitiesDtoList.${idx}.displayOrder`,
                                  idx + 1
                                );
                              }
                            },
                          }
                        ),
                      }}
                      isError={
                        !!errors?.mainActivitiesDtoList?.[idx]?.mainActivityBn
                      }
                    />
                  </div>
                  {/* )} */}
                  <div className={"col-xl-6 col-12 mt-1 mt-xl-0"}>
                    <Input
                      label={idx < 1 ? labelEn : ""}
                      placeholder={labelEn + " লিখুন"}
                      noMargin
                      registerProperty={{
                        ...register(
                          `mainActivitiesDtoList.${idx}.mainActivityEn`,
                          {
                            onChange: (e) => {
                              if (notNullOrUndefined(e.target.value)) {
                                setValue(
                                  `mainActivitiesDtoList.${idx}.displayOrder`,
                                  idx + 1
                                );
                              }
                            },
                            validate: enCheck,
                          }
                        ),
                      }}
                      isError={
                        !!errors?.mainActivitiesDtoList?.[idx]?.mainActivityEn
                      }
                    />
                  </div>
                </div>
              </div>
              <div className={idx < 1 ? "mt-6" : ""}>
                <IconButton
                  iconName="delete"
                  color="danger"
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

export default ActivitiesForm;
