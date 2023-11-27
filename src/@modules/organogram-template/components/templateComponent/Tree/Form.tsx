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
} from "@gems/components";
import {
  COMMON_LABELS,
  IObject,
  isObjectNull,
  numBnToEn,
  numEnToBn,
  numericCheck,
} from "@gems/utils";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { enCheck } from "utility/checkValidation";
import { isNotEmptyList } from "utility/utils";

interface INodeForm {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data) => void;
  updateData?: IObject;
  postList: IObject[];
}

const NodeForm = ({
  isOpen,
  postList,
  onClose,
  onSubmit,
  updateData,
}: INodeForm) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      postFunctionalityList: [{}],
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
              organizationPost:
                (postList?.length > 0 &&
                  postList?.find((d) => d?.id === item.organizationPost.id)) ||
                null,
            };
          }),
        };
      }
      reset({
        ...resetData,
      });
    } else reset({});
  }, [isOpen, updateData, reset]);

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
      titleBn: data?.titleEn,
      postFunctionalityList: postFunctionalityListNew,
    };
  };

  const onFormSubmit = (data) => {
    setIsHeadIndex(null);
    onSubmit(setEnIntoBnFields(data));
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
      size="lg"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <ModalBody>
          <div className="row border rounded p-2 my-1 bg-gray-100">
            {/* <div className="col-md-6 col-12">
              <Input
                label="বাংলা নাম"
                placeholder="বাংলা নাম লিখুন"
                isRequired
                noMargin
                registerProperty={{
                  ...register("titleBn", {
                    required: " ",
                  }),
                }}
                isError={!!errors?.titleBn}
                errorMessage={errors?.titleBn?.message as string}
              />
            </div> */}
            <div className="col-md-12 col-12">
              <Input
                label="ইংরেজি নাম"
                placeholder="নাম ইংরেজিতে লিখুন"
                isRequired
                noMargin
                registerProperty={{
                  ...register("titleEn", {
                    required: " ",
                    validate: enCheck,
                  }),
                }}
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
                  {/* <div className="col-md-6">
                    <Input
                      label={index < 1 ? "দায়িত্ব (বাংলা)" : ""}
                      noMargin
                      placeholder="দায়িত্ব বাংলায় লিখুন"
                      registerProperty={{
                        ...register(
                          `postFunctionalityList.${index}.functionalityBn`,
                          {
                            required: " ",
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
                  </div> */}

                  <div className="col-md-12 mt-1 mt-xl-0">
                    <Input
                      label={index < 1 ? "দায়িত্ব (ইংরেজি)" : ""}
                      noMargin
                      placeholder="দায়িত্ব ইংরেজিতে লিখুন"
                      registerProperty={{
                        ...register(
                          `postFunctionalityList.${index}.functionalityEn`,
                          {
                            required: " ",
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
                    manpowerListAppend({});
                  }}
                />
              </div>
            </div>
            {manpowerListFields.map((field, index) => (
              <div
                className="d-flex align-items-top gap-3 w-100 border rounded px-3 my-1 bg-gray-100"
                key={field?.id}
              >
                <div className={index < 1 ? "mt-10" : "mt-3"}>
                  <Label> {numEnToBn(index + 1) + "।"} </Label>
                </div>
                <div className="row w-100">
                  <div className="col-md-6 col-xl-5">
                    <Autocomplete
                      label={index < 1 ? "পদবি" : ""}
                      placeholder="পদবি বাছাই করুন"
                      isRequired=" "
                      control={control}
                      options={postList || []}
                      getOptionLabel={(op) => op?.nameBn}
                      getOptionValue={(op) => op?.id}
                      name={`manpowerList.${index}.organizationPost`}
                      // onChange={onDataChange}
                      // isDisabled={!watch("type")}
                      //   isRequired
                      noMargin
                      isError={
                        !!errors?.manpowerList?.[index]?.organizationPost
                      }
                      errorMessage={
                        errors?.manpowerList?.[index]?.organizationPost
                          ?.message as string
                      }
                    />
                  </div>

                  <div className="col-md-6 col-xl-5">
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

                  <div
                    className={
                      "col-md-6 col-xl-2 d-flex align-items-center  " +
                      (index < 1 ? "mt-8" : "my-1")
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
                    onClick={() => manpowerListRemove(index)}
                  />
                </div>
              </div>
            ))}
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
