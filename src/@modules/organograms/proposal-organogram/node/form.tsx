import { COMMON_LABELS, ERR_MSG, LABELS } from "@constants/common.constant";
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
import { useCallback, useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { isNotEmptyList } from "utility/utils";

interface INodeCreateUpdateForm {
  onSubmit: (data) => void;
  updateData?: IObject;
  organogramData?: IObject;
  isNotEnamCommittee: boolean;
  isLoading?: boolean;
  maxManpowerCode?: number;
  setMaxManpowerCode?: (d) => void;
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

const orgmOrgOrGroupList = [
  {
    titleEn: "Organizations",
    key: "ORGANIZATIONS",
    titleBn: "প্রতিষ্ঠানসমূহ",
  },
  {
    titleEn: "Organization Group",
    key: "ORG_GROUP",
    titleBn: "প্রতিষ্ঠানের গ্ৰুপ",
  },
];

const NodeCreateUpdateForm = ({
  onSubmit,
  updateData,
  organogramData,
  isNotEnamCommittee,
  isLoading,
  maxManpowerCode,
  setMaxManpowerCode,
}: INodeCreateUpdateForm) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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
  const [gradeList, setGradeList] = useState<IObject[]>([]);
  const [serviceList, setServiceList] = useState<IObject[]>([]);
  const [parentNodeList, setParentNodeList] = useState<IObject[]>([]);
  const [organizationGroupList, setOrganizationGroupList] = useState<IObject[]>(
    []
  );

  const postPayload = {
    meta: {
      page: 0,
      limit: 10000000,
      sort: [{ order: "asc", field: "nameBn" }],
    },
    body: {},
  };
  const payload = {
    meta: {
      page: 0,
      limit: 1000,
      sort: [{ order: "asc", field: "serialNo" }],
    },
    body: { searchKey: "", orgCategoryGroupId: null },
  };
  const orgPayload = useRef(payload);

  useEffect(() => {
    CoreService.getGrades().then((resp) => setGradeList(resp.body || []));
    CoreService.getByMetaTypeList(META_TYPE.SERVICE_TYPE).then((resp) =>
      setServiceList(resp.body || [])
    );
    getParentNodeList();
  }, []);

  const cadreObj = serviceList?.find(
    (op) => op?.metaKey === META_TYPE.SERVICE_TYPE_CADRE
  );

  const getParentNodeList = () => {
    OMSService.FETCH.nodeParentListByOrganogramId(
      organogramData?.proposedOrganogram?.id
    )
      .then((resp) => {
        setParentNodeList(resp?.body);
      })
      .catch((e) => console.log(e?.message));
  };

  useEffect(() => {
    getOrgGroupList();
  }, []);

  const getOrgGroupList = () => {
    OMSService.FETCH.organizationGroupList().then((resp) =>
      setOrganizationGroupList(resp?.body)
    );
  };

  const getAsyncOranizationList = useCallback((searchKey, callback) => {
    orgPayload.current.body = {
      ...orgPayload.current.body,
      searchKey: searchKey ? searchKey?.trim() : "",
    };
    OMSService.getEnamOrganizationList(orgPayload?.current).then((resp) =>
      callback(resp?.body)
    );
  }, []);

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
              code: maxManpowerCode,
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
            code: maxManpowerCode,
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

  const getAsyncPostList = useCallback((searchKey, callback) => {
    postPayload.body = { searchKey };
    CoreService.getPostList(postPayload).then((resp) => callback(resp?.body));
  }, []);

  const onFormSubmit = (data) => {
    setIsHeadIndex(null);
    onSubmit(isNotEnamCommittee ? data : setEnIntoBnFields(data));
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
      <PageTitle>
        {`পদ/স্তর ${isObjectNull(updateData) ? "যুক্ত" : "হালনাগাদ"} করুন`}
        <br />
        <span className="fs-6 mt-2 text-gray-600">
          প্রতিষ্ঠান :
          {" " + organogramData?.proposedOrganization?.nameBn + " | "}
          অর্গানোগ্রাম তারিখ :
          {" " +
            (organogramData?.proposedDate &&
              generateDateFormat(
                organogramData?.proposedDate,
                DATE_PATTERN.GOVT_STANDARD
              ))}
        </span>
      </PageTitle>
      <div className="d-flex flex-wrap border p-2">
        <div className="me-4">
          <Checkbox
            noMargin
            label={"সাব-অর্গানোগ্রাম"}
            // isDisabled={isHeadIndex ? isHeadIndex !== index : false}
            registerProperty={{
              ...register("isSubOrgm", {
                onChange: (e) => setValue("subOrgmOrgOrGroupName", null),
              }),
            }}
          />
          {watch("isSubOrgm") === true && (
            <div className="mt-3 min-w-200px">
              <Select
                options={orgmOrgOrGroupList || []}
                noMargin
                placeholder={"বাছাই করুন"}
                textKey={"titleBn"}
                valueKey="key"
                registerProperty={{
                  ...register(`subOrgmOrgOrGroupName`, {
                    onChange: () => {
                      setValue("subOrgmOrgOrGroup.orgGroup", null);
                      setValue("subOrgmOrgOrGroup.orgList", null);
                    },
                  }),
                }}
                isError={!!errors?.subOrgmOrgOrGroupName}
              />
            </div>
          )}
        </div>
        {watch("subOrgmOrgOrGroupName") && (
          <div className="min-w-300px">
            {watch("subOrgmOrgOrGroupName") === "ORG_GROUP" ? (
              <Autocomplete
                label="প্রতিষ্ঠানের গ্ৰুপ"
                placeholder="প্রতিষ্ঠানের গ্ৰুপ বাছাই করুন"
                name="subOrgmOrgOrGroup.orgGroup"
                options={organizationGroupList}
                noMargin
                // isRequired={
                //   isTemplate ? "প্রতিষ্ঠানের গ্ৰুপ বাছাই করুন" : false
                // }
                control={control}
                // autoFocus
                getOptionLabel={(op) => op?.nameBn}
                getOptionValue={(op) => op?.id}
                // onChange={(org) => onOrgGroupChange(org)}
                isError={(!!errors?.subOrgmOrgOrGroup as any)?.orgGroup}
                errorMessage={
                  (errors?.subOrgmOrgOrGroup as any)?.orgGroup
                    ?.message as string
                }
              />
            ) : (
              <Autocomplete
                label="প্রতিষ্ঠান"
                placeholder="প্রতিষ্ঠান বাছাই করুন"
                // isRequired="প্রতিষ্ঠান বাছাই করুন"
                isAsync
                isMulti
                control={control}
                noMargin
                getOptionLabel={(op) => op.nameBn}
                getOptionValue={(op) => op?.id}
                name={`subOrgmOrgOrGroup.orgList`}
                loadOptions={getAsyncOranizationList}
                isError={(!!errors?.subOrgmOrgOrGroup as any)?.orgList}
                errorMessage={
                  (errors?.subOrgmOrgOrGroup as any)?.orgList?.message as string
                }
                closeMenuOnSelect={false}
              />
            )}
          </div>
        )}
      </div>
      <div className="col-12 col-md-6 col-xl-4 p-2 bg-gray-100">
        <Autocomplete
          label={"পদ/স্তরের অভিভাবক"}
          placeholder="পদ/স্তরের অভিভাবক বাছাই করুন"
          control={control}
          options={parentNodeList || []}
          getOptionLabel={(op) =>
            isNotEnamCommittee ? op?.titleBn : op?.titleEn
          }
          getOptionValue={(op) => op?.id}
          name={`parentNodeDTO`}
          onChange={(t) => setValue("parentNodeId", t?.id)}
          noMargin
        />
      </div>

      <div className="row p-2 my-1 bg-gray-100">
        {isNotEnamCommittee && (
          <div className="col-md-5 col-12">
            <Input
              label="বাংলা নাম(শাখা/সেল/অধিশাখা/অনুবিভাগ)"
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
        <div className={isNotEnamCommittee ? "col-md-5 col-12" : "col-10"}>
          <Input
            label="ইংরেজি নাম (শাখা/সেল/অধিশাখা/অনুবিভাগ)"
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
        <div className="col-12 col-md-2">
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
              onClick={() => {
                manpowerListAppend({
                  isNewManpower: true,
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
            className={`d-flex align-items-top gap-3 w-100 my-1 mb-3 mb-xl-0 bg-gray-100`}
            key={field?.id}
          >
            <div className={index < 1 ? "mt-10" : "mt-3"}>
              <Label> {numEnToBn(index + 1) + "।"} </Label>
            </div>
            <div className="row w-100">
              <div className="col-md-6 col-xl-3 col-xxl-4 px-1">
                <Autocomplete
                  label={index < 1 ? "পদবি" : ""}
                  placeholder="বাছাই করুন"
                  isRequired
                  isAsync
                  // isMulti
                  control={control}
                  noMargin
                  getOptionLabel={(op) =>
                    isNotEnamCommittee ? op?.nameBn : op?.nameEn
                  }
                  getOptionValue={(op) => op?.id}
                  name={`manpowerList.${index}.postDTO`}
                  onChange={(t) => onPostChange(index, t)}
                  loadOptions={getAsyncPostList}
                  isError={!!errors?.manpowerList?.[index]?.postDTO}
                  errorMessage={
                    errors?.manpowerList?.[index]?.postDTO?.message as string
                  }
                />
              </div>

              <div className="col-md-6 col-xl-2 col-xxl-3  px-1">
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

              <div className="col-md-6 col-xl-2 col-xxl-1 px-1">
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

              <div className="col-md-6 col-xl-2 col-xxl-1 px-1">
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
          isError={!!errors?.commentNode}
        />
      </div>

      <div className="d-flex justify-content-center mt-4">
        <Button color="primary" type="submit" isLoading={isLoading}>
          {updateData && Object.keys(updateData)?.length > 0
            ? "হালনাগাদ করুন"
            : "সংরক্ষণ করুন"}
        </Button>
      </div>
    </form>
  );
};

export default NodeCreateUpdateForm;
