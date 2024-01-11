import { Input } from "@components/Input";
import { ERR_MSG, LABELS } from "@constants/common.constant";
import {
  Autocomplete,
  Button,
  Checkbox,
  IconButton,
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
  META_TYPE,
  isObjectNull,
  notNullOrUndefined,
  numBnToEn,
  numEnToBn,
  numericCheck,
} from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { enCheck } from "utility/checkValidation";
import { isNotEmptyList } from "utility/utils";

interface INodeForm {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data) => void;
  updateData?: IObject;
  defaultDisplayOrder?: number;
  postList: IObject[];
  gradeList: IObject[];
  serviceList: IObject[];
  cadreObj: IObject;
  isNotEnamCommittee: boolean;
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
  serviceList,
  cadreObj,
  onClose,
  onSubmit,
  updateData,
  defaultDisplayOrder,
  isNotEnamCommittee,
}: INodeForm) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      postFunctionalityList: [],
      manpowerList: [
        {
          isNewManpower: true,
        },
      ],
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

  const [titleList, setTitleList] = useState<IObject[]>([]);

  const onTitleChange = (val, fieldLang: "en" | "bn") => {
    if (!notNullOrUndefined(val)) return;
    let suggestedValue;
    if (fieldLang === "en") {
      suggestedValue = titleList?.find((obj) => obj?.titleEn === val);
      if (notNullOrUndefined(suggestedValue))
        setValue("titleBn", suggestedValue?.titleBn);
    } else {
      suggestedValue = titleList?.find((obj) => obj?.titleBn === val);
      if (notNullOrUndefined(suggestedValue))
        setValue("titleEn", suggestedValue?.titleEn);
    }
  };

  useEffect(() => {
    OMSService.FETCH.nodeTitle().then((resp) => {
      setTitleList(resp?.body);
    });
  }, []);

  useEffect(() => {
    // alert(cadreObj?.metaKey);
    if (isOpen && !isObjectNull(updateData)) {
      // UPDATE MODE
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
      }
      reset({
        ...resetData,
      });
    } else {
      // CREATE MODE
      reset({
        manpowerList: [
          {
            isNewManpower: true,
            serviceTypeDto: cadreObj,
            serviceTypeKey: cadreObj?.metaKey,
          },
        ],
        postFunctionalityList: [],
      });
    }
  }, [isOpen, updateData, reset, cadreObj]);

  const manpowerNumberCheck = (val) => {
    return numericCheck(val) === true
      ? val < 1
        ? ERR.MIN_NUM_1
        : true
      : COMMON_LABELS.NUMERIC_ONLY;
  };

  const setEnIntoBnFields = (data) => {
    let postFunctionalityListNew = [];
    if (isNotEmptyList(data?.postFunctionalityList)) {
      data?.postFunctionalityList.forEach((pf) => {
        postFunctionalityListNew.push({
          functionalityBn: pf?.functionalityEn,
          functionalityEn: pf?.functionalityEn,
        });
      });
    }

    return {
      ...data,
      postFunctionalityList: postFunctionalityListNew,
      manpowerList: isNotEmptyList(data?.manpowerList)
        ? data?.manpowerList?.map((item) => {
            return { ...item };
          })
        : null,
    };
  };

  const onFormSubmit = (data) => {
    setIsHeadIndex(null);

    onSubmit(isNotEnamCommittee ? data : setEnIntoBnFields(data));
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
            {isNotEnamCommittee && (
              <div className="col-md-6 col-12">
                <Input
                  label="বাংলা নাম"
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
            )}
            <div className={isNotEnamCommittee ? "col-md-6 col-12" : "col-12"}>
              <Input
                label="ইংরেজি নাম"
                placeholder="নাম ইংরেজিতে লিখুন"
                isRequired={!isNotEnamCommittee}
                noMargin
                registerProperty={{
                  ...register("titleEn", {
                    required: !isNotEnamCommittee,
                    onChange: (e) => {
                      if (isNotEnamCommittee)
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
            {/* <div className="bg-gray-100 p-3 rounded my-1"> */}
            {postFunctionalityListFields.map((field, index) => (
              <div
                className="d-flex align-items-top gap-3 w-100 border rounded px-3 my-1 bg-gray-100"
                // className="d-flex align-items-top gap-3 w-100 py-1"
                key={field?.id}
              >
                <div className={index < 1 ? "mt-9" : "mt-2"}>
                  <Label> {numEnToBn(index + 1) + "।"} </Label>
                </div>
                <div className="row w-100">
                  {isNotEnamCommittee && (
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
                          errors?.postFunctionalityList?.[index]
                            ?.functionalityBn?.message as string
                        }
                      />
                    </div>
                  )}

                  <div
                    className={
                      isNotEnamCommittee
                        ? "col-md-6 mt-1 mt-xl-0"
                        : "col-md-12 mt-1 mt-xl-0"
                    }
                  >
                    <Input
                      label={index < 1 ? "দায়িত্ব (ইংরেজি)" : ""}
                      noMargin
                      placeholder="দায়িত্ব ইংরেজিতে লিখুন"
                      registerProperty={{
                        ...register(
                          `postFunctionalityList.${index}.functionalityEn`,
                          {
                            onChange: (e) => {
                              if (!isNotEnamCommittee) {
                                setValue(
                                  `postFunctionalityList.${index}.functionalityBn`,
                                  e.target.value
                                );
                              }

                              if (notNullOrUndefined(e.target.value)) {
                                setValue(
                                  `postFunctionalityList.${index}.displayOrder`,
                                  index + 1
                                );
                              }
                            },
                            required: !isNotEnamCommittee,
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
                  onClick={() =>
                    manpowerListAppend({
                      isNewManpower: true,
                      serviceTypeDto: cadreObj,
                      serviceTypeKey: cadreObj?.metaKey,
                    })
                  }
                />
              </div>
            </div>
            {manpowerListFields.map((field, index) => (
              <div
                className={`d-flex align-items-top gap-3 w-100 border rounded px-3 my-1 bg-gray-100`}
                key={field?.id}
              >
                <div className={index < 1 ? "mt-10" : "mt-3"}>
                  <Label> {numEnToBn(index + 1) + "।"} </Label>
                </div>
                <div className="row w-100">
                  <div className="col-md-6 col-xl-2">
                    <Autocomplete
                      label={index < 1 ? "পদবি" : ""}
                      placeholder="পদবি বাছাই করুন"
                      isRequired={true}
                      control={control}
                      options={postList || []}
                      getOptionLabel={(op) =>
                        isNotEnamCommittee ? op?.nameBn : op?.nameEn
                      }
                      getOptionValue={(op) => op?.id}
                      name={`manpowerList.${index}.postDTO`}
                      onChange={(t) =>
                        setValue(`manpowerList.${index}.postId`, t?.id)
                      }
                      noMargin
                      isError={!!errors?.manpowerList?.[index]?.postDTO}
                      errorMessage={
                        errors?.manpowerList?.[index]?.postDTO
                          ?.message as string
                      }
                    />
                  </div>

                  <div className="col-md-6 col-xl-2">
                    <Autocomplete
                      label={index < 1 ? "গ্রেড" : ""}
                      placeholder="গ্রেড বাছাই করুন"
                      control={control}
                      options={gradeList || []}
                      getOptionLabel={(op) =>
                        isNotEnamCommittee ? op?.nameBn : op?.nameEn
                      }
                      getOptionValue={(op) => op?.id}
                      name={`manpowerList.${index}.gradeDTO`}
                      onChange={(t) =>
                        setValue(`manpowerList.${index}.gradeId`, t?.id)
                      }
                      noMargin
                      isError={!!errors?.manpowerList?.[index]?.gradeDTO}
                    />
                  </div>

                  <div className="col-md-6 col-xl-2">
                    <Autocomplete
                      label={index < 1 ? "সার্ভিসের ধরণ" : ""}
                      placeholder="সার্ভিসের ধরণ বাছাই করুন"
                      isRequired={true}
                      control={control}
                      options={serviceList || []}
                      getOptionLabel={(op) =>
                        isNotEnamCommittee ? op?.titleBn : op?.titleEn
                      }
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
                      isError={!!errors?.manpowerList?.[index]?.serviceTypeDto}
                    />
                  </div>

                  <div className="col-md-6 col-xl-2">
                    <Input
                      label={index < 1 ? "জনবল সংখ্যা" : ""}
                      placeholder="জনবল সংখ্যা লিখুন"
                      registerProperty={{
                        ...register(`manpowerList.${index}.numberOfEmployee`, {
                          required: "জনবল সংখ্যা লিখুন",
                          setValueAs: (v) => numBnToEn(v),
                          validate: manpowerNumberCheck,
                        }),
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

                  <div className="col-md-6 col-xl-2">
                    <Select
                      label={index < 1 ? "পদের ধরণ" : ""}
                      options={postTypeList || []}
                      noMargin
                      placeholder={isNotEnamCommittee ? "বাছাই করুন" : "Select"}
                      isRequired
                      textKey={isNotEnamCommittee ? "titleBn" : "titleEn"}
                      defaultValue={"permanent"}
                      valueKey="key"
                      registerProperty={{
                        ...register(`manpowerList.${index}.postType`, {
                          required: true,
                        }),
                      }}
                      isError={!!errors?.manpowerList?.[index]?.postType}
                    />
                  </div>

                  <div
                    className={
                      "col-md-6 col-xl-2 d-flex align-items-center " +
                      (index < 1 ? "mt-5" : "my-0")
                    }
                  >
                    {isHeadIndex === null || isHeadIndex === index ? (
                      <Checkbox
                        noMargin
                        label={isHeadIndex === index ? "প্রধান" : "প্রধান ?"}
                        // label='প্রধান ?'
                        isDisabled={isHeadIndex ? isHeadIndex !== index : false}
                        registerProperty={{
                          ...register(`manpowerList.${index}.isHead`, {
                            onChange: (e) => {
                              e.target.checked
                                ? setIsHeadIndex(index)
                                : setIsHeadIndex(null);
                            },
                          }),
                        }}
                      />
                    ) : null}
                  </div>
                </div>

                <div className={index < 1 ? "mt-6" : ""}>
                  <IconButton
                    iconName="delete"
                    color="danger"
                    rounded={false}
                    onClick={() => {
                      manpowerListRemove(index);
                    }}
                  />
                </div>
              </div>
            ))}
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
