import { COMMON_LABELS, ERR_MSG, LABELS } from "@constants/common.constant";
import { MENU } from "@constants/menu-titles.constant";
import { PageTitle } from "@context/PageData";
import {
  Autocomplete,
  Button,
  Checkbox,
  IconButton,
  Input,
  Label,
  Select,
  Textarea,
  toast,
} from "@gems/components";
import {
  DATE_PATTERN,
  IObject,
  META_TYPE,
  enCheck,
  generateDateFormat,
  isObjectNull,
  notNullOrUndefined,
  numBnToEn,
  numEnToBn,
  numericCheck,
} from "@gems/utils";
import { CoreService } from "@services/api/Core.service";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { isNotEmptyList } from "utility/utils";

interface INodeCreateUpdateForm {
  onSubmit: (data) => void;
  updateData?: IObject;
  organogramData?: IObject;
  isNotEnamCommittee: boolean;
  isLoading?: boolean;
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

const NodeCreateUpdateForm = ({
  onSubmit,
  updateData,
  organogramData,
  isNotEnamCommittee,
  isLoading,
}: INodeCreateUpdateForm) => {
  const {
    register,
    handleSubmit,
    reset,
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
  } = useFieldArray({
    control,
    name: "manpowerList",
  });

  const [titleList, setTitleList] = useState<IObject[]>([]);
  const [postList, setPostList] = useState<IObject[]>([]);
  const [gradeList, setGradeList] = useState<IObject[]>([]);
  const [serviceList, setServiceList] = useState<IObject[]>([]);
  const [parentNodeList, setParentNodeList] = useState<IObject[]>([]);

  const postPayload = {
    meta: {
      page: 0,
      limit: 10000000,
      sort: [{ order: "asc", field: isNotEnamCommittee ? "nameBn" : "nameEn" }],
    },
    body: {},
  };

  useEffect(() => {
    CoreService.getPostList(postPayload).then((resp) =>
      setPostList(resp.body || [])
    );
    CoreService.getGrades().then((resp) => setGradeList(resp.body || []));
    CoreService.getByMetaTypeList(META_TYPE.SERVICE_TYPE).then((resp) =>
      setServiceList(resp.body || [])
    );
    getParentNodeList();
  }, []);

  const getParentNodeList = () => {
    OMSService.FETCH.nodeParentListByOrganogramId(organogramData?.id)
      .then((resp) => {
        setParentNodeList(resp?.body);
      })
      .catch((e) => console.log(e?.message));
  };

  const cadreObj = serviceList?.find(
    (op) => op?.metaKey === META_TYPE.SERVICE_TYPE_CADRE
  );

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
    if (!isObjectNull(updateData)) {
      // UPDATE MODE
      let resetData = updateData;

      if (isNotEmptyList(updateData?.manpowerList)) {
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
      } else {
        resetData = {
          ...updateData,
          manpowerList: [
            {
              isNewManpower: true,
              serviceTypeDto: cadreObj,
              serviceTypeKey: cadreObj?.metaKey,
            },
          ],
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
  }, [updateData, reset, cadreObj]);

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

  const onPostChange = (index, opt) => {
    // Post Uniquness Check
    if (notNullOrUndefined(opt)) {
      let noDuplicate = true;
      const mpList = getValues("manpowerList") || [];
      if (mpList.length > 1) {
        for (let i = 0; i < mpList.length; i++) {
          if (i !== index && mpList[i]?.postDTO?.id === opt?.id) {
            noDuplicate = false;
            toast.error(
              "'" + mpList[i]?.postDTO?.nameBn + "' পদবিটি অনন্য নয়"
            );
            setValue(`manpowerList.${index}.postDTO`, null);
            break;
          }
        }
      }
      if (noDuplicate) setValue(`manpowerList.${index}.postId`, opt?.id);
    }
  };

  const onFormSubmit = (data) => {
    setIsHeadIndex(null);
    onSubmit(isNotEnamCommittee ? data : setEnIntoBnFields(data));
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
      <PageTitle>{`পদ/স্তর ${
        isObjectNull(updateData) ? "যুক্ত" : "হালনাগাদ"
      } করুন`}</PageTitle>
      <div className="row mb-4 d-flex justify-content-center">
        <div className="col-12 col-md-4 col-lg-3 col-xl-2 p-2 bg-gray-100">
          <Autocomplete
            label={"পদ/স্তরের অভিভাবক"}
            placeholder="পদ/স্তরের অভিভাবক বাছাই করুন"
            isRequired={true}
            control={control}
            options={parentNodeList || []}
            getOptionLabel={(op) =>
              isNotEnamCommittee ? op?.titleBn : op?.titleEn
            }
            getOptionValue={(op) => op?.id}
            name={`parentNodeDTO`}
            onChange={(t) => setValue("parentNodeId", t?.id)}
            noMargin
            isError={!!errors?.parentNodeDTO}
            errorMessage={errors?.parentNodeDTO?.message as string}
          />
        </div>
        <div className="col-12 col-md-4 col-lg-3 col-xl-2 p-2 bg-gray-100">
          <Input
            label="প্রদর্শন ক্রম"
            placeholder="প্রদর্শন ক্রম লিখুন"
            isRequired
            noMargin
            numaricOnly
            min={1}
            type="number"
            registerProperty={{
              ...register("displayOrder", {
                required: true,
              }),
            }}
            isError={!!errors?.displayOrder}
          />
        </div>
      </div>
      <div className="row p-2 my-1 bg-gray-100">
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
                  required: true,
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
                  if (isNotEnamCommittee) onTitleChange(e.target.value, "en");
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
            className="d-flex align-items-top gap-3 w-100 px-1 my-1 bg-gray-100"
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
                      !!errors?.postFunctionalityList?.[index]?.functionalityBn
                    }
                    errorMessage={
                      errors?.postFunctionalityList?.[index]?.functionalityBn
                        ?.message as string
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
                    !!errors?.postFunctionalityList?.[index]?.functionalityEn
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
            className={`d-flex align-items-top gap-3 w-100 px-1 my-1 bg-gray-100`}
            key={field?.id}
          >
            <div className={index < 1 ? "mt-10" : "mt-3"}>
              <Label> {numEnToBn(index + 1) + "।"} </Label>
            </div>
            <div className="row w-100">
              <div className="col-md-6 col-xl-4 px-1">
                <Autocomplete
                  label={index < 1 ? "পদবি" : ""}
                  placeholder="বাছাই করুন"
                  isRequired={true}
                  control={control}
                  options={postList || []}
                  getOptionLabel={(op) =>
                    isNotEnamCommittee ? op?.nameBn : op?.nameEn
                  }
                  getOptionValue={(op) => op?.id}
                  name={`manpowerList.${index}.postDTO`}
                  onChange={(t) => onPostChange(index, t)}
                  noMargin
                  isError={!!errors?.manpowerList?.[index]?.postDTO}
                  errorMessage={
                    errors?.manpowerList?.[index]?.postDTO?.message as string
                  }
                />
              </div>

              <div className="col-md-6 col-xl-3 px-1">
                <Autocomplete
                  label={index < 1 ? "গ্রেড" : ""}
                  placeholder="বাছাই করুন"
                  control={control}
                  options={gradeList || []}
                  getOptionLabel={(op) =>
                    isNotEnamCommittee ? op?.nameBn : op?.nameEn
                  }
                  getOptionValue={(op) => op?.id}
                  name={`manpowerList.${index}.gradeDTO`}
                  onChange={(t) => {
                    setValue(`manpowerList.${index}.gradeId`, t?.id);
                    setValue(
                      `manpowerList.${index}.gradeOrder`,
                      t?.displayOrder
                    );
                  }}
                  noMargin
                  isError={!!errors?.manpowerList?.[index]?.gradeDTO}
                />
              </div>

              <div className="col-md-6 col-xl-2 px-1">
                <Autocomplete
                  label={index < 1 ? "সার্ভিসের ধরণ" : ""}
                  placeholder="বাছাই করুন"
                  isRequired={true}
                  control={control}
                  options={serviceList || []}
                  getOptionLabel={(op) =>
                    isNotEnamCommittee ? op?.titleBn : op?.titleEn
                  }
                  getOptionValue={(op) => op?.metaKey}
                  name={`manpowerList.${index}.serviceTypeDto`}
                  onChange={(t) =>
                    setValue(`manpowerList.${index}.serviceTypeKey`, t?.metaKey)
                  }
                  noMargin
                  isError={!!errors?.manpowerList?.[index]?.serviceTypeDto}
                />
              </div>

              <div className="col-md-6 col-xl-1 px-1">
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
                  isError={!!errors?.manpowerList?.[index]?.numberOfEmployee}
                  errorMessage={
                    errors?.manpowerList?.[index]?.numberOfEmployee
                      ?.message as string
                  }
                />
              </div>

              <div className="col-md-6 col-xl-1 px-1">
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
                  "col-md-6 col-xl-1 px-1 d-flex align-items-center " +
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

      <div className="d-flex justify-content-center mt-4">
        <Button color="primary" type="submit" isLoading={isLoading}>
          {COMMON_LABELS.SAVE}
        </Button>
      </div>
    </form>
  );
};

export default NodeCreateUpdateForm;
