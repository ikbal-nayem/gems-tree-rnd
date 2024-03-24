import { LABELS } from "@constants/common.constant";
import { IconButton, Input, Separator, Textarea } from "@gems/components";
import { IObject, isObjectNull } from "@gems/utils";
import { useFieldArray } from "react-hook-form";

interface IAbbreviationForm {
  formProps: any;
  updateData?: IObject[];
}

const AbbreviationForm = ({ formProps, updateData }: IAbbreviationForm) => {
  const {
    register,
    control,
    formState: { errors },
  } = formProps;

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "abbreviationDtoList",
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
    console.log("dd");

    if (updateData?.length > 0) {
      let itemUpdateObject = updateData?.[index];

      if (itemUpdateObject?.isAddition) return;
      console.log("achi");

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
        <h4 className="m-0">{LABELS.BN.ABBREVIATIONS}</h4>
        <IconButton
          iconName="add"
          color="primary"
          onClick={() => {
            append({
              isAddition: true,
            });
          }}
        />
      </div>
      <Separator className="mt-1 mb-2" />
      <div className="mt-3">
        {fields.map((field, index) => {
          const labelBn = "সংক্ষিপ্তরূপ";
          const labelEn = "বিস্তারিত";
          return (
            <div
              className="d-flex align-items-top gap-3 mt-1 border rounded px-3 my-1 bg-gray-100 pb-3 pb-xl-0"
              key={field?.id}
            >
              <div
                className={`d-flex align-items-top w-100 ${
                  checkFieldIsDeleted(field)
                    ? "disabledDiv border border-danger rounded p-1"
                    : ""
                }`}
              >
                <div className="row w-100">
                  <div className="col-md-6">
                    <Input
                      label={index < 1 ? labelBn : ""}
                      placeholder={labelBn + " লিখুন"}
                      isRequired
                      noMargin
                      registerProperty={{
                        ...register(`abbreviationDtoList.${index}.shortForm`, {
                          onBlur: (e) => {
                            onModified(
                              field,
                              index,
                              e?.target?.value,
                              "shortForm"
                            );
                          },
                          required: " ",
                        }),
                      }}
                      isError={
                        !!errors?.abbreviationDtoList?.[index]?.shortForm
                      }
                      errorMessage={
                        errors?.abbreviationDtoList?.[index]?.shortForm
                          ?.message as string
                      }
                    />
                  </div>
                  <div className="col-md-6 mt-1 mt-xl-0">
                    <Textarea
                      label={index < 1 ? labelEn : ""}
                      placeholder={labelEn + " লিখুন"}
                      noMargin
                      isRequired
                      registerProperty={{
                        ...register(`abbreviationDtoList.${index}.fullForm`, {
                          required: " ",
                          onBlur: (e) => {
                            onModified(
                              field,
                              index,
                              e?.target?.value,
                              "fullForm"
                            );
                          },
                        }),
                      }}
                      isError={!!errors?.abbreviationDtoList?.[index]?.fullForm}
                      errorMessage={
                        errors?.abbreviationDtoList?.[index]?.fullForm
                          ?.message as string
                      }
                    />
                  </div>
                </div>
              </div>

              {!checkFieldIsDeleted(field) && (
                <div className={index < 1 ? "mt-6" : ""}>
                  <IconButton
                    iconName="delete"
                    color="danger"
                    iconSize={15}
                    rounded={false}
                    onClick={() => {
                      handleDelete(field, index);
                    }}
                  />
                </div>
              )}
              {checkFieldIsDeleted(field) && (
                <div className={index < 1 ? "mt-6 ms-3" : "mt-1 ms-3"}>
                  <IconButton
                    iconName="change_circle"
                    color="warning"
                    iconSize={15}
                    rounded={false}
                    onClick={() => {
                      update(index, {
                        ...field,
                        isDeleted: false,
                      });
                      // manpowerListRemove(index);
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

export default AbbreviationForm;
