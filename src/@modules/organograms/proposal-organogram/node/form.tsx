import { Input } from "@components/Input";
import { COMMON_LABELS, ERR_MSG, LABELS } from "@constants/common.constant";
import { PageTitle } from "@context/PageData";
import {
  Autocomplete,
  Button,
  Checkbox,
  IconButton,
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
import { arraysAreEqual } from "utility/checkValidation";
import { isNotEmptyList } from "utility/utils";
import "./form.scss";

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
    update: manpowerListUpdate,
  } = useFieldArray({
    control,
    name: "manpowerList",
  });

  const [titleList, setTitleList] = useState<IObject[]>([]);
  const [isNodeModified, setIsNodeModified] = useState<boolean>(false);
  const [gradeList, setGradeList] = useState<IObject[]>([]);
  const [classList, setClassList] = useState([]);
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
    CoreService.getByMetaTypeList("CLASS").then((resp) =>
      setClassList(resp.body || [])
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
    setIsNodeModified(true);
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
              isAlternativePost:
                item?.alternativePostListDTO?.length > 0 ? true : false,
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
    } else {
      // CREATE MODE
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

  const checkFieldIsDeleted = (field) => {
    return field?.isDeleted ? true : false;
  };

  const handleManpowerDelete = (field, index) => {
    console.log(field);

    if (index >= 0) {
      if (!isObjectNull(field) && (field?.isNewManpower || field?.isAddition)) {
        manpowerListRemove(index);
      } else {
        manpowerListUpdate(index, {
          ...field,
          isDeleted: true,
          isModified: false,
        });
      }
    }
  };

  const onManpowerModified = (field, index, item, fieldName) => {
    if (!isObjectNull(updateData)) {
      let itemUpdateObject = updateData?.manpowerList?.[index];
      let man = watch("manpowerList");

      if (itemUpdateObject?.isAddition || field?.isAddition) return;

      if (
        fieldName === "postDTO" ||
        fieldName === "gradeDTO" ||
        fieldName === "serviceTypeDto" ||
        fieldName === "classKeyDto"
      ) {
        if (itemUpdateObject?.[fieldName]?.id !== item?.id) {
          man[index] = { ...man[index], isModified: true };
          setValue("manpowerList", man);
        } else {
          man[index] = { ...man[index], isModified: false };
          setValue("manpowerList", man);
        }
      } else if (fieldName === "alternativePostListDTO") {
        if (!arraysAreEqual(itemUpdateObject[fieldName], item)) {
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
          manpowerListUpdate(index, {
            ...field,
            [fieldName]: item,
            isModified: true,
          });
        } else {
          manpowerListUpdate(index, {
            ...field,
            [fieldName]: item,
            isModified: false,
          });
        }
      } else if (
        fieldName === "postType" ||
        fieldName === "isHead" ||
        fieldName === "isAlternativePost"
      ) {
        if (itemUpdateObject?.[fieldName] !== item) {
          manpowerListUpdate(index, {
            ...field,
            [fieldName]: item,
            isModified: true,
          });
        } else {
          manpowerListUpdate(index, {
            ...field,
            [fieldName]: item,
            isModified: false,
          });
        }
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

  const getAsyncPostList = useCallback((searchKey, callback) => {
    postPayload.body = { searchKey };
    CoreService.getPostList(postPayload).then((resp) => callback(resp?.body));
  }, []);

  const onFormSubmit = (data) => {
    setIsHeadIndex(null);
    if (data?.isAddition === false) {
      data = { ...data, isModified: data?.isModified || isNodeModified };
    }
    if (isObjectNull(updateData)) {
      data = {
        ...data,
        isAddition: true,
      };
    }
    onSubmit(data);
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
                  ? "disabledDiv border border-danger rounded p-1 pe-3"
                  : ""
              }`}
            >
              <div className={index < 1 ? "mt-10" : "mt-3"}>
                <Label> {numEnToBn(index + 1) + "।"} </Label>
              </div>
              <div className="row w-100">
                <div className="col-md-6 col-xl-4 px-1">
                  <Autocomplete
                    label={index < 1 ? "পদবি" : ""}
                    placeholder="বাছাই করুন"
                    isRequired
                    isAsync
                    // isMulti
                    control={control}
                    noMargin
                    getOptionLabel={(op) =>
                      isNotEnamCommittee
                        ? `${op?.nameBn} ${
                            op?.nameEn ? "(" + op?.nameEn + ")" : ""
                          }`
                        : `${op?.nameEn} ${
                            op?.nameBn ? "(" + op?.nameBn + ")" : ""
                          }`
                    }
                    getOptionValue={(op) => op?.id}
                    name={`manpowerList.${index}.postDTO`}
                    onChange={(t) => {
                      onPostChange(index, t);
                      onManpowerModified(field, index, t, "postDTO");
                    }}
                    loadOptions={getAsyncPostList}
                    isError={!!errors?.manpowerList?.[index]?.postDTO}
                    errorMessage={
                      errors?.manpowerList?.[index]?.postDTO?.message as string
                    }
                  />
                  <div className="my-1">
                    <Checkbox
                      noMargin
                      label={"বিকল্প পদবি"}
                      registerProperty={{
                        ...register(`manpowerList.${index}.isAlternativePost`, {
                          onChange: (e) => {
                            setValue(
                              `manpowerList.${index}.alternativePostListDTO`,
                              null
                            );
                            onManpowerModified(
                              field,
                              index,
                              e.target.checked,
                              "isAlternativePost"
                            );
                          },
                        }),
                      }}
                    />
                  </div>
                  {watch(`manpowerList.${index}.isAlternativePost`) && (
                    <Autocomplete
                      placeholder="বিকল্প পদবি বাছাই করুন"
                      isAsync
                      isMulti
                      control={control}
                      noMargin
                      getOptionLabel={(op) =>
                        isNotEnamCommittee
                          ? `${op?.nameBn} ${
                              op?.nameEn ? "(" + op?.nameEn + ")" : ""
                            }`
                          : `${op?.nameEn} ${
                              op?.nameBn ? "(" + op?.nameBn + ")" : ""
                            }`
                      }
                      getOptionValue={(op) => op?.id}
                      name={`manpowerList.${index}.alternativePostListDTO`}
                      onChange={(t) =>
                        onManpowerModified(
                          field,
                          index,
                          t,
                          "alternativePostListDTO"
                        )
                      }
                      loadOptions={getAsyncPostList}
                      isError={
                        !!errors?.manpowerList?.[index]?.alternativePostListDTO
                      }
                      errorMessage={
                        errors?.manpowerList?.[index]?.alternativePostListDTO
                          ?.message as string
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
                          onManpowerModified(field, index, t, "gradeDTO");
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
                        getOptionLabel={(op) =>
                          isNotEnamCommittee ? op?.titleBn : op?.titleEn
                        }
                        getOptionValue={(op) => op?.metaKey}
                        name={`manpowerList.${index}.classKeyDto`}
                        onChange={(t) => {
                          setValue(
                            `manpowerList.${index}.classKey`,
                            t?.metaKey
                          );
                          onManpowerModified(field, index, t, "classKeyDto");
                        }}
                        noMargin
                        isError={!!errors?.manpowerList?.[index]?.classKeyDto}
                      />
                    </div>
                  </div>
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

                <div className="col-md-6 col-xl-1 px-1">
                  <Input
                    label={index < 1 ? "জনবল সংখ্যা" : ""}
                    placeholder="জনবল সংখ্যা লিখুন"
                    registerProperty={{
                      ...register(`manpowerList.${index}.numberOfEmployee`, {
                        required: "জনবল সংখ্যা লিখুন",
                        setValueAs: (v) => numBnToEn(v),
                        validate: manpowerNumberCheck,
                        onBlur: (t) =>
                          onManpowerModified(
                            field,
                            index,
                            t?.target?.value,
                            "numberOfEmployee"
                          ),
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
                        required: " ",
                        onBlur: (t) =>
                          onManpowerModified(
                            field,
                            index,
                            t?.target?.value,
                            "postType"
                          ),
                      }),
                    }}
                    isError={!!errors?.manpowerList?.[index]?.postType}
                  />
                </div>

                <div
                  className={
                    "col-md-6 col-xl-1 px-1 " + (index < 1 ? "mt-8" : "mt-2")
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
                            onManpowerModified(
                              field,
                              index,
                              e.target.checked,
                              "isHead"
                            );
                          },
                        }),
                      }}
                    />
                  ) : null}
                </div>
              </div>
            </div>
            {!checkFieldIsDeleted(field) && (
              <div
                className={
                  index < 1 ? "mt-6 ms-3 ms-lg-0" : "mt-1 ms-3 ms-lg-0"
                }
              >
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
