import { LABELS } from "@constants/common.constant";
import { IconButton, Label, Separator, Textarea } from "@gems/components";
import {
  IObject,
  isObjectNull,
  notNullOrUndefined,
  numEnToBn,
} from "@gems/utils";
import { useFieldArray } from "react-hook-form";

interface IAllocationOfBusinessForm {
  formProps: any;
  updateData?: IObject[];
}

const AllocationOfBusinessForm = ({
  formProps,
  updateData,
}: IAllocationOfBusinessForm) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = formProps;

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "businessAllocationDtoList",
  });

  const checkFieldIsDeleted = (field) => {
    return field?.isDeleted ? true : false;
  };

  const handleDelete = (field, index) => {
    if (index >= 0) {
      if (!isObjectNull(field) && field?.isAddition) {
        remove(index);
      } else {
        update(index, { ...field, isDeleted: true, isModified: false });
      }
    }
  };

  const onModified = (field, index, item, fieldName) => {
    if (!isObjectNull(updateData)) {
      let itemUpdateObject = updateData?.[index];

      if (itemUpdateObject?.isAddition || field?.isAddition) return;
      let itemUpdateObjectData =
        itemUpdateObject?.[fieldName] === undefined
          ? ""
          : itemUpdateObject?.[fieldName];

      if (itemUpdateObjectData !== item) {
        update(index, {
          ...field,
          [fieldName]: item,
          isModified: true,
        });
      } else {
        update(index, {
          ...field,
          [fieldName]: item,
          isModified: false,
        });
      }
    }
  };
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.ALLOCATION_OF_BUSINESS}</h4>
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
          const label = "কর্মসমূহ";
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
                <div className="ps-2 row w-100">
                  <div className="col-xl-6 col-12">
                    <Textarea
                      label={idx < 1 ? labelBn : ""}
                      placeholder={labelBn + " লিখুন"}
                      noMargin
                      isRequired
                      registerProperty={{
                        ...register(
                          `businessAllocationDtoList.${idx}.businessOfAllocationBn`,
                          {
                            onChange: (e) => {
                              if (notNullOrUndefined(e.target.value)) {
                                setValue(
                                  `businessAllocationDtoList.${idx}.displayOrder`,
                                  idx + 1
                                );
                              }
                              onModified(
                                f,
                                idx,
                                e?.target?.value,
                                "businessOfAllocationBn"
                              );
                            },
                            required: " ",
                            // validate: bnCheck,
                          }
                        ),
                      }}
                      isError={
                        !!errors?.businessAllocationDtoList?.[idx]
                          ?.businessOfAllocationBn
                      }
                      errorMessage={
                        errors?.businessAllocationDtoList?.[idx]
                          ?.businessOfAllocationBn?.message as string
                      }
                    />
                  </div>
                  <div className={"col-xl-6 col-12 mt-1 mt-xl-0"}>
                    {/* <Input
                    label={idx < 1 ? labelEn : ""}
                    placeholder={labelEn + " লিখুন"}
                    isRequired={!isNotEnamCommittee}
                    noMargin
                    registerProperty={{
                      ...register(
                        `businessAllocationDtoList.${idx}.businessOfAllocationEn`,
                        {
                          onChange: (e) => {
                            if (!isNotEnamCommittee) {
                              setValue(
                                `businessAllocationDtoList.${idx}.businessOfAllocationBn`,
                                e.target.value
                              );
                            }

                            if (notNullOrUndefined(e.target.value)) {
                              setValue(
                                `businessAllocationDtoList.${idx}.displayOrder`,
                                idx + 1
                              );
                            }
                          },
                          required: !isNotEnamCommittee,
                          validate: enCheck,
                        }
                      ),
                    }}
                    isError={
                      !!errors?.businessAllocationDtoList?.[idx]
                        ?.businessOfAllocationEn
                    }
                  /> */}
                    <Textarea
                      label={idx < 1 ? labelEn : ""}
                      placeholder={labelEn + " লিখুন"}
                      noMargin
                      registerProperty={{
                        ...register(
                          `businessAllocationDtoList.${idx}.businessOfAllocationEn`,
                          {
                            onChange: (e) => {
                              if (notNullOrUndefined(e.target.value)) {
                                setValue(
                                  `businessAllocationDtoList.${idx}.displayOrder`,
                                  idx + 1
                                );
                              }
                              onModified(
                                f,
                                idx,
                                e?.target?.value,
                                "businessOfAllocationEn"
                              );
                            },
                            // validate: enCheck,
                          }
                        ),
                      }}
                      isError={
                        !!errors?.businessAllocationDtoList?.[idx]
                          ?.businessOfAllocationEn
                      }
                      errorMessage={
                        errors?.businessAllocationDtoList?.[idx]
                          ?.businessOfAllocationEn?.message as string
                      }
                    />
                  </div>
                </div>
              </div>
              {!checkFieldIsDeleted(f) && (
                <div className={idx < 1 ? "mt-6" : ""}>
                  <IconButton
                    iconName="delete"
                    color="danger"
                    iconSize={15}
                    rounded={false}
                    onClick={() => {
                      handleDelete(f, idx);
                    }}
                  />
                </div>
              )}
              {checkFieldIsDeleted(f) && (
                <div className={idx < 1 ? "mt-6 ms-3" : "mt-1 ms-3"}>
                  <IconButton
                    iconName="change_circle"
                    color="warning"
                    iconSize={15}
                    rounded={false}
                    onClick={() => {
                      update(idx, {
                        ...f,
                        isDeleted: false,
                      });
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllocationOfBusinessForm;
