import { LABELS } from "@constants/common.constant";
import {
  Autocomplete,
  IconButton,
  Input,
  Label,
  Separator,
  toast,
} from "@gems/components";
import {
  IObject,
  isObjectNull,
  notNullOrUndefined,
  numEnToBn,
} from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { enCheck } from "utility/checkValidation";

interface IForm {
  formProps: any;
  updateInventoryData?: IObject[];
  updateMiscellaneousPointData?: IObject[];
}

const EquipmentsForm = ({
  formProps,
  updateInventoryData,
  updateMiscellaneousPointData,
}: IForm) => {
  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = formProps;

  const {
    fields: inventoryDtoListFields,
    append: inventoryDtoListAppend,
    remove: inventoryDtoListRemove,
    update: inventoryDtoListUpdate,
  } = useFieldArray({
    control,
    name: "inventoryDtoList",
  });

  const {
    fields: miscellaneousPointDtoListFields,
    append: miscellaneousPointDtoListAppend,
    remove: miscellaneousPointDtoListRemove,
  } = useFieldArray({
    control,
    name: "miscellaneousPointDtoList",
  });

  const [inventoryTypeList, setInventoryTypeList] = useState<IObject[]>([]);
  const [inventoryItemList, setInventoryItemList] = useState<IObject[][]>([]);

  useEffect(() => {
    OMSService.getInventoryTypeList().then((resp) =>
      setInventoryTypeList(resp.body || [])
    );
  }, []);

  const inventoryDtoList = watch("inventoryDtoList");

  useEffect(() => {
    Promise.all(
      inventoryDtoList?.map((item) =>
        OMSService.getInventoryItemListByType(item?.type?.id)
      )
    ).then((resp) => {
      let cInventoryItemList = [...inventoryItemList];
      resp?.forEach((item, i) => {
        cInventoryItemList[i] = [...item?.body];
      });
      setInventoryItemList(cInventoryItemList);
    });
  }, [inventoryDtoList]);

  const onInventoryTypeChange = (e, idx) => {
    setValue(`inventoryDtoList.[${idx}].item`, null);
    if (e?.id) {
      OMSService.getInventoryItemListByType(e?.id).then((resp) => {
        const cInventoryItemList = [...inventoryItemList];
        cInventoryItemList[idx] = [...resp?.body];
        setInventoryItemList(cInventoryItemList);
      });
    } else setInventoryItemList([]);
  };

  const onInventoryChange = (obj, idx) => {
    if (obj?.id) {
      const inventoryDtoList = getValues("inventoryDtoList") || [];
      for (let i = 0; i < inventoryDtoList.length; i++) {
        if (i !== idx && inventoryDtoList[i]?.item?.id === obj?.id) {
          toast.error(
            "'" + inventoryDtoList[i]?.item?.itemTitleBn + "' আইটেমটি অনন্য নয়"
          );

          setError(`inventoryDtoList.[${idx}].item`, {
            type: "manaul",
            message:
              "'" +
              inventoryDtoList[i]?.item?.itemTitleBn +
              "' আইটেমটি অনন্য নয় !",
          });
          break;
        }
        clearErrors(`inventoryDtoList.[${idx}].item`);
      }
    } else clearErrors(`inventoryDtoList.[${idx}].item`);
  };

  const checkFieldIsDeleted = (field) => {
    return field?.isDeleted ? true : false;
  };

  const handleInventoryDelete = (field, index) => {
    if (index >= 0) {
      if (!isObjectNull(field) && (field?.isNewManpower || field?.isAddition)) {
        inventoryDtoListRemove(index);
      } else {
        inventoryDtoListUpdate(index, {
          ...field,
          isDeleted: true,
          isModified: false,
        });
      }
    }
  };

  const onInventoryModified = (field, index, item, fieldName) => {
    if (updateInventoryData?.length > 0) {
      let itemUpdateObject = updateInventoryData?.[index];
      let man = watch("manpowerList");

      if (itemUpdateObject?.isAddition) return;

      if (
        fieldName === "postDTO" ||
        fieldName === "gradeDTO" ||
        fieldName === "serviceTypeDto"
      ) {
        if (itemUpdateObject?.[fieldName]?.id !== item?.id) {
          man[index] = { ...man[index], isModified: true };
          setValue("manpowerList", man);
        } else {
          man[index] = { ...man[index], isModified: false };
          setValue("manpowerList", man);
        }
      } else if (fieldName === "numberOfEmployee") {
        if (
          (typeof itemUpdateObject?.[fieldName] === "number"
            ? JSON.stringify(itemUpdateObject?.[fieldName])
            : itemUpdateObject?.[fieldName]) !== item
        ) {
          // man[index] = { ...man[index], isModified: true };
          // setValue("manpowerList", man);
          inventoryDtoListUpdate(index, {
            ...field,
            [fieldName]: item,
            isModified: true,
          });
        } else {
          inventoryDtoListUpdate(index, {
            ...field,
            [fieldName]: item,
            isModified: false,
          });
        }
      } else if (fieldName === "postType" || fieldName === "isHead") {
        if (itemUpdateObject?.[fieldName] !== item) {
          inventoryDtoListUpdate(index, {
            ...field,
            [fieldName]: item,
            isModified: true,
          });
        } else {
          inventoryDtoListUpdate(index, {
            ...field,
            [fieldName]: item,
            isModified: false,
          });
        }
      }
    }
  };

  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.EQUIPMENTS}</h4>
        <IconButton
          iconName="add"
          color="primary"
          onClick={() =>
            inventoryDtoListAppend({
              isAddition: true,
            })
          }
        />
      </div>
      <Separator className="mt-1 mb-2" />
      <div>
        {inventoryDtoListFields.map((f, idx) => (
          <div
            className="d-flex align-items-top gap-3 mt-1 border rounded px-3 my-1 bg-gray-100 pb-3 pb-xl-0"
            key={idx}
          >
            <div
              className={`d-flex align-items-top gap-3 w-100 ${
                checkFieldIsDeleted(f)
                  ? "disabledDiv border border-danger rounded p-1"
                  : ""
              }`}
            >
              <div className={idx < 1 ? "mt-8" : "mt-2"}>
                <Label> {numEnToBn(idx + 1) + "।"} </Label>
              </div>
              <div className="row w-100">
                <div className="col-md-4">
                  <Autocomplete
                    label={idx < 1 ? "টাইপ" : ""}
                    placeholder="টাইপ বাছাই করুন"
                    control={control}
                    options={inventoryTypeList || []}
                    noMargin
                    getOptionLabel={(op) => op?.inventoryTypeBn}
                    getOptionValue={(op) => op?.id}
                    name={`inventoryDtoList.${idx}.type`}
                    onChange={(e) => {
                      onInventoryTypeChange(e, idx);
                      onInventoryModified(f, idx, e, "type");
                    }}
                    isRequired
                    isError={!!errors?.inventoryDtoList?.[idx]?.type}
                    errorMessage={
                      errors?.inventoryDtoList?.[idx]?.type?.message as string
                    }
                  />
                </div>
                <div className="col-md-4 mt-1 mt-xl-0">
                  <Autocomplete
                    label={idx < 1 ? "সরঞ্জামাদি" : ""}
                    placeholder="সরঞ্জামাদি বাছাই করুন"
                    control={control}
                    options={inventoryItemList?.[idx] || []}
                    noMargin
                    getOptionLabel={(op) => op?.itemTitleBn}
                    getOptionValue={(op) => op?.id}
                    name={`inventoryDtoList.${idx}.item`}
                    key={watch(`inventoryDtoList.${idx}.item`)}
                    isDisabled={!watch(`inventoryDtoList.${idx}.type`)}
                    onChange={(obj) => {
                      onInventoryChange(obj, idx);
                      onInventoryModified(f, idx, obj, "item");
                    }}
                    isRequired
                    isError={!!errors?.inventoryDtoList?.[idx]?.item}
                    errorMessage={
                      errors?.inventoryDtoList?.[idx]?.item?.message as string
                    }
                  />
                </div>
                <div className="col-md-4 mt-1 mt-xl-0">
                  <Input
                    label={idx < 1 ? "সংখ্যা" : ""}
                    placeholder="সংখ্যা লিখুন"
                    noMargin
                    type="number"
                    defaultValue={1}
                    registerProperty={{
                      ...register(`inventoryDtoList.${idx}.quantity`, {
                        required: "সংখ্যা লিখুন",
                        onBlur: (e) => {
                          onInventoryModified(f, idx, e, "quantity");
                        },
                      }),
                    }}
                    isError={!!errors?.inventoryDtoList?.[idx]?.quantity}
                  />
                </div>
              </div>
            </div>

            {!checkFieldIsDeleted(f) && (
              <div className={idx < 1 ? "mt-6" : ""}>
                <IconButton
                  iconName="delete"
                  color="danger"
                  rounded={false}
                  onClick={() => {
                    handleInventoryDelete(f, idx);
                  }}
                />
              </div>
            )}
            {checkFieldIsDeleted(f) && (
              <div className={idx < 1 ? "mt-6 ms-3" : "mt-1 ms-3"}>
                <IconButton
                  iconName="change_circle"
                  color="warning"
                  rounded={false}
                  onClick={() => {
                    inventoryDtoListUpdate(idx, {
                      ...f,
                      isDeleted: false,
                    });
                    // manpowerListRemove(index);
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <Separator className="mt-4 mb-2" />

      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.MISCELLANEOUS}</h4>
        <IconButton
          iconName="add"
          color="primary"
          onClick={() => miscellaneousPointDtoListAppend("")}
        />
      </div>
      <Separator className="mt-1 mb-2" />
      <div>
        {miscellaneousPointDtoListFields.map((f, idx) => {
          const label = "বিবিধ";
          const labelBn = label + " (বাংলা)";
          const labelEn = label + " (ইংরেজি)";
          return (
            <div
              className="d-flex align-items-top gap-3 mt-1 w-100 border rounded px-3 my-1 bg-gray-100"
              key={idx}
            >
              <div className={idx < 1 ? "mt-8" : "mt-2"}>
                <Label> {numEnToBn(idx + 1) + "।"} </Label>
              </div>
              <div className="row w-100">
                <div className="col-xl-6 col-12">
                  <Input
                    label={idx < 1 ? labelBn : ""}
                    placeholder={labelBn + " লিখুন"}
                    noMargin
                    isRequired={idx < 1}
                    registerProperty={{
                      ...register(`miscellaneousPointDtoList.${idx}.titleBn`, {
                        required: " ",
                        onChange: (e) => {
                          if (notNullOrUndefined(e.target.value)) {
                            setValue(
                              `miscellaneousPointDtoList.${idx}.displayOrder`,
                              idx + 1
                            );
                          }
                        },
                      }),
                    }}
                    isError={
                      !!errors?.miscellaneousPointDtoList?.[idx]?.titleBn
                    }
                    errorMessage={
                      errors?.miscellaneousPointDtoList?.[idx]?.titleBn
                        ?.message as string
                    }
                  />
                </div>
                <div className={"col-xl-6 col-12 mt-1 mt-xl-0"}>
                  <Input
                    label={idx < 1 ? labelEn : ""}
                    placeholder={labelEn + " লিখুন"}
                    autoFocus
                    noMargin
                    registerProperty={{
                      ...register(`miscellaneousPointDtoList.${idx}.titleEn`, {
                        onChange: (e) => {
                          if (notNullOrUndefined(e.target.value)) {
                            setValue(
                              `miscellaneousPointDtoList.${idx}.displayOrder`,
                              idx + 1
                            );
                          }
                        },
                        validate: enCheck,
                      }),
                    }}
                    isError={
                      !!errors?.miscellaneousPointDtoList?.[idx]?.titleEn
                    }
                    errorMessage={
                      errors?.miscellaneousPointDtoList?.[idx]?.titleEn
                        ?.message as string
                    }
                  />
                </div>
              </div>
              <div className={idx < 1 ? "mt-6" : ""}>
                <IconButton
                  iconName="delete"
                  color="danger"
                  iconSize={15}
                  rounded={false}
                  onClick={() => {
                    miscellaneousPointDtoListRemove(idx);
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

export default EquipmentsForm;
