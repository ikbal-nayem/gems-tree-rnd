import { ERR_MSG, LABELS } from "@constants/common.constant";
import {
  Autocomplete,
  Button,
  Checkbox,
  IconButton,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  Select,
  Textarea,
} from "@gems/components";
import {
  COMMON_LABELS,
  IObject,
  isObjectNull,
  notNullOrUndefined,
  numBnToEn,
  numEnToBn,
  numericCheck,
} from "@gems/utils";
import { CoreService } from "@services/api/Core.service";
import { OMSService } from "@services/api/OMS.service";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { enCheck } from "utility/checkValidation";

interface INodeForm {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data) => void;
  updateData?: IObject;
  defaultDisplayOrder?: number;
  postList: IObject[];
  gradeList: IObject[];
  classList: IObject[];
  serviceList: IObject[];
  cadreObj: IObject;
  maxNodeCode: number;
  setMaxNodeCode: (code: number) => void;
  maxManpowerCode: number;
  setMaxManpowerCode: (code: number) => void;
}

const postTypeList = [
  {
    titleEn: "Proposed",
    key: "proposed",
    titleBn: "প্রস্তাবিত",
  },
  {
    titleEn: "Permanent",
    key: "permanent",
    titleBn: "স্থায়ী",
  },
  {
    titleEn: "Non Permanent",
    key: "nonPermanent",
    titleBn: "অস্থায়ী",
  },
];

const NodeForm = ({
  isOpen,
  postList,
  gradeList,
  classList,
  serviceList,
  cadreObj,
  onClose,
  onSubmit,
  updateData,
  defaultDisplayOrder,
  maxNodeCode,
  setMaxNodeCode,
  maxManpowerCode,
  setMaxManpowerCode,
}: INodeForm) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      postFunctionalityList: [],
      manpowerList: [{}],
    },
  });

  const langEn = false;
  const LABEL = langEn ? LABELS.EN : LABELS.BN;
  const ERR = langEn ? ERR_MSG.EN : ERR_MSG.BN;
  const [isHeadIndex, setIsHeadIndex] = useState<number>(null);
  const {
    fields: postFunctionalityListFields,
    append: postFunctionalityListAppend,
    remove: postFunctionalityListRemove,
  } = useFieldArray({
    control,
    name: "postFunctionalityList",
  });
  const {
    fields: manpowerListFields,
    append: manpowerListAppend,
    remove: manpowerListRemove,
    update: manpowerListUpdate,
  } = useFieldArray({
    control,
    name: "manpowerList",
  });

  const postPayload = {
    meta: {
      page: 0,
      limit: 100,
      sort: [{ order: "asc", field: "nameBn" }],
    },
    body: { searchKey: "" },
  };

  const [titleList, setTitleList] = useState<IObject[]>([]);

  const onTitleChange = (val, fieldLang: "en" | "bn") => {
    if (!notNullOrUndefined(val)) return;
    let suggestedValue;
    // if (fieldLang === "en") {
    //   suggestedValue = titleList?.find((obj) => obj?.titleEn === val);
    //   if (notNullOrUndefined(suggestedValue))
    //     setValue("titleBn", suggestedValue?.titleBn);
    // } else {
    suggestedValue = titleList?.find((obj) => obj?.titleBn === val);
    if (notNullOrUndefined(suggestedValue))
      setValue("titleEn", suggestedValue?.titleEn);
    // }
  };

  useEffect(() => {
    OMSService.FETCH.nodeTitle().then((resp) => {
      setTitleList(resp?.body);
    });
  }, []);

  useEffect(() => {
    if (isOpen && !isObjectNull(updateData)) {
      let resetData = updateData;
      if (!isObjectNull(updateData?.manpowerList)) {
        resetData = {
          ...updateData,
          manpowerList: updateData?.manpowerList?.map((item, index) => {
            if (item?.isHead) setIsHeadIndex(index);

            return {
              ...item,
              postDTO:
                (postList?.length > 0 &&
                  postList?.find((d) => d?.id === item?.postId)) ||
                null,
              // alternativePostDTO:
              //   (postList?.length > 0 &&
              //     postList?.find((d) => d?.id === item?.alternativePostId)) ||
              //   null,
              isAlternativePost:
                item?.alternativePostListDTO?.length > 0 ? true : false,

              gradeDTO:
                (gradeList?.length > 0 &&
                  gradeList?.find((d) => d?.id === item?.gradeId)) ||
                null,
              serviceTypeDto:
                (serviceList?.length > 0 &&
                  serviceList?.find(
                    (d) => d?.metaKey === item?.serviceTypeKey
                  )) ||
                null,
            };
          }),
        };
      } else {
        resetData = {
          ...updateData,
          manpowerList: [
            {
              isNewManpower: true,
              isAddition: true,
              serviceTypeDto: cadreObj,
              serviceTypeKey: cadreObj?.metaKey,
              code: maxManpowerCode,
            },
          ],
        };
      }
      reset({
        ...resetData,
      });
    } else
      reset({
        manpowerList: [
          {
            isNewManpower: true,
            isAddition: true,
            serviceTypeDto: cadreObj,
            serviceTypeKey: cadreObj?.metaKey,
            code: maxManpowerCode,
          },
        ],
        postFunctionalityList: [],
      });
  }, [isOpen, updateData, reset, cadreObj]);

  const manpowerNumberCheck = (val) => {
    return numericCheck(val) === true
      ? val < 1
        ? ERR.MIN_NUM_1
        : true
      : COMMON_LABELS.NUMERIC_ONLY;
  };

  const checkFieldIsDeleted = (field) => {
    return field?.isDeleted ? true : false;
  };

  const handleManpowerDelete = (field, index) => {
    if (index >= 0) {
      if (!isObjectNull(field) && (field?.isNewManpower || field?.isAddition)) {
        manpowerListRemove(index);
      } else {
        manpowerListUpdate(index, { ...field, isDeleted: true });
      }
    }
  };

  const onPostChange = (index, opt) => {
    // Post Uniquness Check
    // if (notNullOrUndefined(opt)) {
    //   let noDuplicate = true;
    //   const mpList = getValues("manpowerList") || [];
    //   if (mpList.length > 1) {
    //     for (let i = 0; i < mpList.length; i++) {
    //       if (i !== index && mpList[i]?.postDTO?.id === opt?.id) {
    //         noDuplicate = false;
    //         toast.error(
    //           "'" + mpList[i]?.postDTO?.nameBn + "' পদবিটি অনন্য নয়"
    //         );
    //         setValue(`manpowerList.${index}.postDTO`, null);
    //         break;
    //       }
    //     }
    //   }
    //   if (noDuplicate) setValue(`manpowerList.${index}.postId`, opt?.id);
    // }

    setValue(`manpowerList.${index}.postId`, opt?.id);
  };

  // const onAlternatePostChange = (index, opt) => {
  //   setValue(`manpowerList.${index}.alternativePostId`, opt?.id || null);
  // };

  const getAsyncPostList = useCallback((searchKey, callback) => {
    postPayload.body = { searchKey };
    CoreService.getPostList(postPayload).then((resp) => callback(resp?.body));
  }, []);

  const onFormSubmit = (data) => {
    setIsHeadIndex(null);
    if (isObjectNull(updateData)) {
      data = {
        ...data,
        isAddition: true,
      };
    }

    data.code = data.code || maxNodeCode;
    onSubmit(data);
  };

  const onFormClose = () => {
    setIsHeadIndex(null);
    onClose();
  };

  return (
    <Modal
      title={`পদ/স্তর ${!isObjectNull(updateData) ? "সম্পাদনা" : "তৈরি"} করুন`}
      isOpen={isOpen}
      handleClose={onFormClose}
      holdOn
      size="xl"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <ModalBody>
          <div className="row mb-4 d-flex justify-content-center">
            <div className="col-12 col-md-4 col-lg-3 col-xl-2 border rounded-4 p-2 bg-gray-100">
              <Input
                label="প্রদর্শন ক্রম"
                placeholder="প্রদর্শন ক্রম লিখুন"
                isRequired
                noMargin
                numaricOnly
                defaultValue={defaultDisplayOrder}
                min={1}
                type="number"
                registerProperty={{
                  ...register("displayOrder", {
                    required: " ",
                  }),
                }}
                isError={!!errors?.displayOrder}
              />
            </div>
          </div>
          <div className="row border rounded p-2 my-1 bg-gray-100">
            <div className="col-md-6 col-12">
              <Input
                label="বাংলা নাম (শাখা/সেল/অধিশাখা/অনুবিভাগ)"
                placeholder="বাংলা নাম লিখুন"
                isRequired
                noMargin
                registerProperty={{
                  ...register("titleBn", {
                    onChange: (e) => onTitleChange(e.target.value, "bn"),
                    required: " ",
                  }),
                }}
                suggestionOptions={titleList || []}
                autoSuggestionKey="nodeTitleBn"
                suggestionTextKey="titleBn"
                isError={!!errors?.titleBn}
                errorMessage={errors?.titleBn?.message as string}
              />
            </div>
            <div className={"col-md-6 col-12"}>
              <Input
                label="ইংরেজি নাম (শাখা/সেল/অধিশাখা/অনুবিভাগ)"
                placeholder="নাম ইংরেজিতে লিখুন"
                noMargin
                registerProperty={{
                  ...register("titleEn", {
                    onChange: (e) => {
                      onTitleChange(e.target.value, "en");
                    },
                    validate: enCheck,
                  }),
                }}
                suggestionOptions={titleList || []}
                autoSuggestionKey="nodeTitleEn"
                suggestionTextKey="titleEn"
                isError={!!errors?.titleEn}
                errorMessage={errors?.titleEn?.message as string}
              />
            </div>
          </div>
          <div className="mt-3">
            <div className="d-flex justify-content-between">
              <h3 className="mt-3">{LABEL.ACTIVITIES}</h3>
              <div className="mt-2">
                <IconButton
                  iconName="add"
                  color="success"
                  rounded={false}
                  onClick={() => {
                    postFunctionalityListAppend({});
                  }}
                />
              </div>
            </div>
            {postFunctionalityListFields.map((field, index) => (
              <div
                className="d-flex align-items-top gap-3 w-100 border rounded px-3 my-1 bg-gray-100"
                key={field?.id}
              >
                <div className={index < 1 ? "mt-9" : "mt-2"}>
                  <Label> {numEnToBn(index + 1) + "।"} </Label>
                </div>
                <div className="row w-100">
                  <div className="col-md-6">
                    <Input
                      label={index < 1 ? "দায়িত্ব (বাংলা)" : ""}
                      noMargin
                      placeholder="দায়িত্ব বাংলায় লিখুন"
                      registerProperty={{
                        ...register(
                          `postFunctionalityList.${index}.functionalityBn`,
                          {
                            required: " ",
                            onChange: (e) => {
                              if (notNullOrUndefined(e.target.value)) {
                                setValue(
                                  `postFunctionalityList.${index}.displayOrder`,
                                  index + 1
                                );
                              }
                            },
                          }
                        ),
                      }}
                      isRequired
                      isError={
                        !!errors?.postFunctionalityList?.[index]
                          ?.functionalityBn
                      }
                      errorMessage={
                        errors?.postFunctionalityList?.[index]?.functionalityBn
                          ?.message as string
                      }
                    />
                  </div>
                  {/* )} */}

                  <div className={"col-md-6 mt-1 mt-xl-0"}>
                    <Input
                      label={index < 1 ? "দায়িত্ব (ইংরেজি)" : ""}
                      noMargin
                      placeholder="দায়িত্ব ইংরেজিতে লিখুন"
                      registerProperty={{
                        ...register(
                          `postFunctionalityList.${index}.functionalityEn`,
                          {
                            onChange: (e) => {
                              if (notNullOrUndefined(e.target.value)) {
                                setValue(
                                  `postFunctionalityList.${index}.displayOrder`,
                                  index + 1
                                );
                              }
                            },
                            validate: enCheck,
                          }
                        ),
                      }}
                      // isRequired
                      isError={
                        !!errors?.postFunctionalityList?.[index]
                          ?.functionalityEn
                      }
                      errorMessage={
                        errors?.postFunctionalityList?.[index]?.functionalityEn
                          ?.message as string
                      }
                    />
                  </div>
                </div>
                <div className={index < 1 ? "mt-6" : ""}>
                  <IconButton
                    iconName="delete"
                    color="danger"
                    iconSize={15}
                    rounded={false}
                    onClick={() => postFunctionalityListRemove(index)}
                  />
                </div>
              </div>
            ))}
            {/* </div> */}
          </div>
          <div className="mt-3">
            <div className="d-flex justify-content-between">
              <h3 className="mb-0 mt-3">{LABEL.MANPOWER}</h3>
              <div className="mt-2">
                <IconButton
                  iconName="add"
                  color="success"
                  rounded={false}
                  onClick={() => {
                    manpowerListAppend({
                      isNewManpower: true,
                      isAddition: true,
                      serviceTypeDto: cadreObj,
                      serviceTypeKey: cadreObj?.metaKey,
                      code: maxManpowerCode + 1,
                    });
                    setMaxManpowerCode(maxManpowerCode + 1);
                  }}
                />
              </div>
            </div>
            {manpowerListFields.map((field, index) => (
              <div
                className={`d-flex align-items-top border rounded px-3 my-1 bg-gray-100`}
                key={field?.id}
              >
                <div
                  className={`d-flex align-items-top gap-3 w-100 ${
                    checkFieldIsDeleted(field)
                      ? "disabledDiv border border-danger rounded p-1"
                      : ""
                  }`}
                >
                  <div className={index < 1 ? "mt-10" : "mt-3"}>
                    <Label> {numEnToBn(index + 1) + "।"} </Label>
                  </div>
                  <div className="row w-100">
                    <div className="col-xl-4 px-1">
                      <Autocomplete
                        label={index < 1 ? "পদবি" : ""}
                        placeholder="বাছাই করুন"
                        isRequired
                        isAsync
                        // isMulti
                        control={control}
                        noMargin
                        getOptionLabel={(op) =>
                          `${op?.nameBn} ${
                            op?.nameEn ? "(" + op?.nameEn + ")" : ""
                          }`
                        }
                        getOptionValue={(op) => op?.id}
                        name={`manpowerList.${index}.postDTO`}
                        onChange={(t) => onPostChange(index, t)}
                        loadOptions={getAsyncPostList}
                        isError={!!errors?.manpowerList?.[index]?.postDTO}
                        errorMessage={
                          errors?.manpowerList?.[index]?.postDTO
                            ?.message as string
                        }
                      />
                      <div className="my-1">
                        <Checkbox
                          noMargin
                          label={"বিকল্প পদবি"}
                          // label='প্রধান ?'
                          registerProperty={{
                            ...register(
                              `manpowerList.${index}.isAlternativePost`,
                              {
                                onChange: (e) => {
                                  setValue(
                                    `manpowerList.${index}.alternativePostListDTO`,
                                    null
                                  );
                                  // setValue(
                                  //   `manpowerList.${index}.alternativePostId`,
                                  //   null
                                  // );
                                },
                              }
                            ),
                          }}
                        />
                      </div>

                      {watch(`manpowerList.${index}.isAlternativePost`) && (
                        <Autocomplete
                          // label={index < 1 ? "বিকল্প পদবি" : ""}
                          placeholder="বিকল্প পদবি বাছাই করুন"
                          // isRequired
                          isAsync
                          isMulti
                          control={control}
                          noMargin
                          getOptionLabel={(op) =>
                            `${op?.nameBn} ${
                              op?.nameEn ? "(" + op?.nameEn + ")" : ""
                            }`
                          }
                          getOptionValue={(op) => op?.id}
                          name={`manpowerList.${index}.alternativePostListDTO`}
                          // onChange={(t) => onAlternatePostChange(index, t)}
                          loadOptions={getAsyncPostList}
                          isError={
                            !!errors?.manpowerList?.[index]
                              ?.alternativePostListDTO
                          }
                          errorMessage={
                            errors?.manpowerList?.[index]
                              ?.alternativePostListDTO?.message as string
                          }
                        />
                      )}
                    </div>

                    <div className="col-xl-3 ps-0 pe-1">
                      <div className="d-flex">
                        <div className="w-50 me-1">
                          <Autocomplete
                            label={index < 1 ? "গ্রেড" : ""}
                            placeholder="বাছাই করুন"
                            control={control}
                            isRequired
                            isClearable={false}
                            options={gradeList || []}
                            getOptionLabel={(op) => op?.nameBn}
                            getOptionValue={(op) => op?.id}
                            name={`manpowerList.${index}.gradeDTO`}
                            onChange={(t) => {
                              setValue(`manpowerList.${index}.gradeId`, t?.id);
                              setValue(
                                `manpowerList.${index}.gradeOrder`,
                                t?.displayOrder
                              );
                              setValue(
                                `manpowerList.${index}.classKeyDto`,
                                classList.find(
                                  (d) => d?.metaKey === t?.classMetaKey
                                )
                              );
                              setValue(
                                `manpowerList.${index}.classKey`,
                                classList.find(
                                  (d) => d?.metaKey === t?.classMetaKey
                                )?.metaKey
                              );
                            }}
                            noMargin
                            isError={!!errors?.manpowerList?.[index]?.gradeDTO}
                          />
                        </div>
                        <div className="w-50">
                          <Autocomplete
                            label={index < 1 ? "শ্রেণি" : ""}
                            placeholder="বাছাই করুন"
                            control={control}
                            // isRequired
                            isClearable={false}
                            options={classList || []}
                            getOptionLabel={(op) => op?.titleBn}
                            getOptionValue={(op) => op?.metaKey}
                            name={`manpowerList.${index}.classKeyDto`}
                            onChange={(t) => {
                              setValue(
                                `manpowerList.${index}.classKey`,
                                t?.metaKey
                              );
                            }}
                            noMargin
                            isError={
                              !!errors?.manpowerList?.[index]?.classKeyDto
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 col-xl-2 px-1">
                      <Autocomplete
                        label={index < 1 ? "সার্ভিসের ধরন" : ""}
                        placeholder="বাছাই করুন"
                        isRequired={true}
                        isClearable={false}
                        control={control}
                        options={serviceList || []}
                        getOptionLabel={(op) => op?.titleBn}
                        getOptionValue={(op) => op?.metaKey}
                        defaultValue={cadreObj}
                        name={`manpowerList.${index}.serviceTypeDto`}
                        onChange={(t) =>
                          setValue(
                            `manpowerList.${index}.serviceTypeKey`,
                            t?.metaKey
                          )
                        }
                        noMargin
                        isError={
                          !!errors?.manpowerList?.[index]?.serviceTypeDto
                        }
                      />
                    </div>

                    <div className="col-md-6 col-xl-1 px-1">
                      <Input
                        label={index < 1 ? "জনবল সংখ্যা" : ""}
                        placeholder="জনবল সংখ্যা লিখুন"
                        registerProperty={{
                          ...register(
                            `manpowerList.${index}.numberOfEmployee`,
                            {
                              required: "জনবল সংখ্যা লিখুন",
                              setValueAs: (v) => numBnToEn(v),
                              validate: manpowerNumberCheck,
                            }
                          ),
                        }}
                        defaultValue={1}
                        noMargin
                        isRequired
                        isError={
                          !!errors?.manpowerList?.[index]?.numberOfEmployee
                        }
                        errorMessage={
                          errors?.manpowerList?.[index]?.numberOfEmployee
                            ?.message as string
                        }
                      />
                    </div>
                    <div className="col-md-6 col-xl-1 px-1">
                      <Select
                        label={index < 1 ? "পদের ধরন" : ""}
                        options={postTypeList || []}
                        noMargin
                        placeholder={"বাছাই করুন"}
                        isRequired
                        textKey={"titleBn"}
                        defaultValue={"permanent"}
                        valueKey="key"
                        registerProperty={{
                          ...register(`manpowerList.${index}.postType`, {
                            required: " ",
                          }),
                        }}
                        isError={!!errors?.manpowerList?.[index]?.postType}
                      />
                    </div>

                    <div
                      className={
                        "col-md-6 col-xl-1 px-1 " +
                        (index < 1 ? "mt-8" : "mt-2")
                      }
                    >
                      {isHeadIndex === null || isHeadIndex === index ? (
                        <Checkbox
                          noMargin
                          label={isHeadIndex === index ? "প্রধান" : "প্রধান ?"}
                          isDisabled={
                            isHeadIndex ? isHeadIndex !== index : false
                          }
                          registerProperty={{
                            ...register(`manpowerList.${index}.isHead`, {
                              onChange: (e) => {
                                if (e.target.checked) {
                                  setIsHeadIndex(index);
                                } else {
                                  setIsHeadIndex(null);
                                }
                              },
                            }),
                          }}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
                {!checkFieldIsDeleted(field) && (
                  <div className={index < 1 ? "mt-6" : ""}>
                    <IconButton
                      iconName="delete"
                      color="danger"
                      rounded={false}
                      onClick={() => {
                        handleManpowerDelete(field, index);
                      }}
                    />
                  </div>
                )}
                {checkFieldIsDeleted(field) && (
                  <div className={index < 1 ? "mt-6 ms-3" : "mt-1 ms-3"}>
                    <IconButton
                      iconName="change_circle"
                      color="warning"
                      rounded={false}
                      onClick={() => {
                        manpowerListUpdate(index, {
                          ...field,
                          isDeleted: false,
                        });
                        // manpowerListRemove(index);
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
            <div className="d-flex justify-content-center mt-4 mb-12">
              <IconButton
                iconName="add"
                color="success"
                className="w-25 rounded-pill"
                rounded={false}
                onClick={() => {
                  manpowerListAppend({
                    isNewManpower: true,
                    isAddition: true,
                    serviceTypeDto: cadreObj,
                    serviceTypeKey: cadreObj?.metaKey,
                    code: maxManpowerCode + 1,
                  });
                  setMaxManpowerCode(maxManpowerCode + 1);
                }}
              />
            </div>
          </div>
          <div className="mt-6">
            <h3 className="mt-3">{LABELS.BN.NOTES}</h3>
            <Textarea
              placeholder={LABELS.BN.NOTES + " লিখুন"}
              noMargin
              registerProperty={{
                ...register(`commentNode`),
              }}
              // onChange={(e) => setValue("titleEn", longLineBreaker(e.target.value))}
              // maxLength={500}
              isError={!!errors?.commentNode}
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="d-flex gap-3 justify-content-end">
            <Button color="secondary" onClick={onFormClose}>
              {COMMON_LABELS.CANCEL}
            </Button>
            <Button color="primary" type="submit">
              {COMMON_LABELS.SAVE}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};
export default NodeForm;
