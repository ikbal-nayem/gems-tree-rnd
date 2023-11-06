import { LABELS } from "@constants/common.constant";
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
import { bnCheck, enCheck } from "utility/checkValidation";

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
          manpowerList: updateData?.manpowerList?.map((item) => {
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

  console.log("isHead Index: ");
  console.log(isHeadIndex);

  return (
    <Modal
      title={`পদ/স্তর ${!isObjectNull(updateData) ? "সম্পাদনা" : "তৈরি"} করুন`}
      isOpen={isOpen}
      handleClose={onClose}
      holdOn
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <ModalBody>
          <div className="row border rounded p-3 my-2 bg-gray-100">
            <div className="col-md-6 col-12">
              <Input
                label="বাংলা নাম"
                placeholder="বাংলা নাম লিখুন"
                isRequired
                registerProperty={{
                  ...register("titleBn", {
                    required: "বাংলা নাম লিখুন",
                    validate: bnCheck,
                  }),
                }}
                isError={!!errors?.titleBn}
                errorMessage={errors?.titleBn?.message as string}
              />
            </div>
            <div className="col-md-6 col-12">
              <Input
                label="ইংরেজি নাম"
                placeholder="ইংরেজি নাম লিখুন"
                isRequired
                registerProperty={{
                  ...register("titleEn", {
                    required: "ইংরেজি নাম লিখুন",
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
            <div className="bg-gray-100 p-3 rounded my-1">
              {postFunctionalityListFields.map((field, index) => (
                <div
                  // className="d-flex align-items-top gap-3 w-100 border rounded px-3 py-1 my-1 bg-gray-100"
                  className="d-flex align-items-top gap-3 w-100 py-1"
                  key={field?.id}
                >
                  <div className="w-100">
                    {/* <div> */}
                    <Input
                      // label="দায়িত্ব"
                      noMargin
                      placeholder="দায়িত্ব লিখুন"
                      registerProperty={{
                        ...register(
                          `postFunctionalityList.${index}.functionality`
                          // {
                          //   required: "দায়িত্ব লিখুন",
                          // }
                        ),
                      }}
                      // isRequired
                      isError={
                        !!errors?.postFunctionalityList?.[index]?.functionality
                      }
                      errorMessage={
                        errors?.postFunctionalityList?.[index]?.functionality
                          ?.message as string
                      }
                    />
                    {/* </div> */}
                  </div>
                  <div className="my-0">
                    <IconButton
                      iconName="delete"
                      color="danger"
                      rounded={false}
                      onClick={() => postFunctionalityListRemove(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <div className="d-flex justify-content-between">
              <h3 className="mb-0 mt-3">কর্মকর্তা</h3>
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
                className="d-flex align-items-top gap-3 w-100 border rounded px-3 py-2 my-2 bg-gray-100"
                key={field?.id}
              >
                <div className={index < 1 ? "mt-10" : "mt-3"}>
                  <Label> {numEnToBn(index + 1) + "।"} </Label>
                </div>
                <div className="row w-100">
                  <div className="col-md-6 col-xl-5 my-1">
                    <Autocomplete
                      label={index < 1 ? "পদবি" : ""}
                      placeholder="পদবি বাছাই করুন"
                      isRequired="পদবি বাছাই করুন"
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

                  <div className="col-md-6 col-xl-5 my-1">
                    <Input
                      label={index < 1 ? "জনবল সংখ্যা" : ""}
                      placeholder="জনবল সংখ্যা লিখুন"
                      registerProperty={{
                        ...register(`manpowerList.${index}.numberOfEmployee`, {
                          required: "জনবল সংখ্যা লিখুন",
                          setValueAs: (v) => numBnToEn(v),
                          validate: numericCheck,
                          min: 1,
                        }),
                      }}
                      min={1}
                      type="number"
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
            <Button color="secondary" onClick={onClose}>
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
