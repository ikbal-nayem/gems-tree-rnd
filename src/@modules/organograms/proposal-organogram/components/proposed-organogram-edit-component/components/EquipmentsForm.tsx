import { LABELS } from "@constants/common.constant";
import {
  Autocomplete,
  Checkbox,
  IconButton,
  Input,
  Label,
  Separator,
  toast,
} from "@gems/components";
import { TextEditor } from "@gems/editor";
import {
  IObject,
  isObjectNull,
  notNullOrUndefined,
  numEnToBn,
} from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";

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
    update: miscellaneousPointDtoListUpdate,
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
      let inventoryList = inventoryDtoList;

      if (itemUpdateObject?.isAddition || field?.isAddition) return;

      if (fieldName === "type" || fieldName === "item") {
        if (itemUpdateObject?.[fieldName]?.id !== item?.id) {
          inventoryList[index] = { ...inventoryList[index], isModified: true };
          setValue("inventoryDtoList", inventoryList);
        } else {
          inventoryList[index] = { ...inventoryList[index], isModified: false };
          setValue("inventoryDtoList", inventoryList);
        }
      } else {
        if (
          (typeof itemUpdateObject?.[fieldName] === "number"
            ? JSON.stringify(itemUpdateObject?.[fieldName])
            : itemUpdateObject?.[fieldName]) !== item
        ) {
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

  const handleMiscellaneousPointDelete = (field, index) => {
    if (index >= 0) {
      if (!isObjectNull(field) && field?.isAddition) {
        miscellaneousPointDtoListRemove(index);
      } else {
        miscellaneousPointDtoListUpdate(index, {
          ...field,
          isDeleted: true,
          isModified: false,
        });
      }
    }
  };

  const onMiscellaneousPointModified = (field, index, item, fieldName) => {
    if (updateMiscellaneousPointData?.length > 0) {
      let itemUpdateObject = updateMiscellaneousPointData?.[index];

      if (itemUpdateObject?.isAddition || field?.isAddition) return;
      let itemUpdateObjectData =
        itemUpdateObject?.[fieldName] === undefined
          ? ""
          : itemUpdateObject?.[fieldName];

      if (itemUpdateObjectData !== item) {
        miscellaneousPointDtoListUpdate(index, {
          ...field,
          [fieldName]: item,
          isModified: true,
        });
      } else {
        miscellaneousPointDtoListUpdate(index, {
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
        <div className="d-flex">
          <h4 className="m-0 me-2">{LABELS.BN.EQUIPMENTS}</h4>
          <Checkbox
            noMargin
            label="অন্যান্য"
            registerProperty={{
              ...register(`isInventoryOthers`),
            }}
          />
        </div>
        {!watch("isInventoryOthers") && (
          <IconButton
            iconName="add"
            color="primary"
            onClick={() =>
              inventoryDtoListAppend({
                isAddition: true,
              })
            }
          />
        )}
      </div>
      <Separator className="mt-1 mb-2" />

      {watch("isInventoryOthers") ? (
        <div>
          <TextEditor
            name="inventoryOthersObject"
            // label=""
            // minHeight={400}
            placeholder={`পরিবহন, অফিস সরঞ্জাম লিখুন...`}
            isRequired
            control={control}
            isError={!!errors?.inventoryOthersObject}
            errorMessage={errors?.inventoryOthersObject?.message as string}
          />
        </div>
      ) : (
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
                      filterProps={["inventoryTypeBn", "inventoryTypeEn"]}
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
                      filterProps={["itemTitleBn", "itemTitleEn"]}
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
                  <div className="col-md-2 mt-1 mt-xl-0">
                    <Input
                      label={idx < 1 ? "সংখ্যা" : ""}
                      placeholder="সংখ্যা লিখুন"
                      noMargin
                      type="number"
                      defaultValue={1}
                      min={0}
                      registerProperty={{
                        ...register(`inventoryDtoList.${idx}.quantity`, {
                          required: "সংখ্যা লিখুন",
                          onBlur: (e) => {
                            onInventoryModified(
                              f,
                              idx,
                              e?.target?.value,
                              "quantity"
                            );
                          },
                        }),
                      }}
                      isError={!!errors?.inventoryDtoList?.[idx]?.quantity}
                    />
                  </div>
                  <div className="col-md-2 mt-1 mt-xl-0">
                    <Input
                      label={idx < 1 ? "প্রদর্শন ক্রম" : ""}
                      placeholder="প্রদর্শন ক্রম লিখুন"
                      noMargin
                      type="number"
                      defaultValue={idx ? idx + 1 : 1}
                      min={0}
                      registerProperty={{
                        ...register(`inventoryDtoList.${idx}.serialNo`, {
                          required: "প্রদর্শন ক্রম লিখুন",
                          onBlur: (e) => {
                            onInventoryModified(
                              f,
                              idx,
                              e?.target?.value,
                              "serialNo"
                            );
                          },
                        }),
                      }}
                      isError={!!errors?.inventoryDtoList?.[idx]?.serialNo}
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
      )}

      <Separator className="mt-4 mb-2" />

      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.MISCELLANEOUS}</h4>
        <IconButton
          iconName="add"
          color="primary"
          onClick={() =>
            miscellaneousPointDtoListAppend({
              isAddition: true,
            })
          }
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
                      noMargin
                      isRequired={idx < 1}
                      registerProperty={{
                        ...register(
                          `miscellaneousPointDtoList.${idx}.titleBn`,
                          {
                            required: " ",
                            onChange: (e) => {
                              if (notNullOrUndefined(e.target.value)) {
                                setValue(
                                  `miscellaneousPointDtoList.${idx}.displayOrder`,
                                  idx + 1
                                );
                              }
                              onMiscellaneousPointModified(
                                f,
                                idx,
                                e?.target?.value,
                                "titleBn"
                              );
                            },
                          }
                        ),
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
                        ...register(
                          `miscellaneousPointDtoList.${idx}.titleEn`,
                          {
                            onChange: (e) => {
                              if (notNullOrUndefined(e.target.value)) {
                                setValue(
                                  `miscellaneousPointDtoList.${idx}.displayOrder`,
                                  idx + 1
                                );
                              }
                              onMiscellaneousPointModified(
                                f,
                                idx,
                                e?.target?.value,
                                "titleEn"
                              );
                            },
                            // validate: enCheck,
                          }
                        ),
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
              </div>

              {!checkFieldIsDeleted(f) && (
                <div className={idx < 1 ? "mt-6" : ""}>
                  <IconButton
                    iconName="delete"
                    color="danger"
                    iconSize={15}
                    rounded={false}
                    onClick={() => {
                      handleMiscellaneousPointDelete(f, idx);
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
                      miscellaneousPointDtoListUpdate(idx, {
                        ...f,
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

export default EquipmentsForm;
