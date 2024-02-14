import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  IconButton,
  Label,
  Separator,
  Textarea,
} from "@gems/components";
import {
  COMMON_LABELS,
  DATE_PATTERN,
  IObject,
  enCheck,
  generateDateFormat,
  numEnToBn,
} from "@gems/utils";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { LABELS } from "@constants/common.constant";

interface IForm {
  isOpen?: boolean;
  onSubmit: (data) => void;
  onClose: () => void;
  submitLoading?: boolean;
  organogram?: IObject;
}

const organizationTypeStaticList = [
  {
    titleEn: "Type",
    key: "ORG_CATEGORY_TYPE",
    titleBn: "ধরণ",
  },
  {
    titleEn: "Group",
    key: "ORG_CATEGORY_GROUP",
    titleBn: "গ্রুপ",
  },
];

const FormCreate = ({
  isOpen,
  onClose,
  onSubmit,
  submitLoading,
  organogram,
}: IForm) => {
  const formProps = useForm();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = formProps;

  const [orgParentTypeList, setOrgParentTypeList] = useState<IObject[]>([]);

  const isEnamCommittee = organogram?.isEnamCommittee;
  const orgName = isEnamCommittee
    ? organogram?.organizationNameEn
    : organogram?.organizationNameBn;
  const organogramDate = organogram?.organogramDate;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "businessAllocationList",
  });

  useEffect(() => {
    reset({});
    if (isOpen && fields?.length < 1) append("");
  }, [isOpen]);

  return (
    <Drawer
      title={LABELS.BN.ALLOCATION_OF_BUSINESS + " সংরক্ষণ করুন"}
      isOpen={isOpen}
      handleClose={onClose}
      className="w-md-50 w-xl-25"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DrawerBody>
          <div>
            <div className="card-head d-flex justify-content-between align-items-center">
              <h5 className="m-0">
                <div className="mb-3 text-gray-700">প্রতিষ্ঠান : {orgName}</div>
                <div className="mb-3 text-gray-700">
                  অর্গানোগ্রাম তারিখ :{" "}
                  {isEnamCommittee
                    ? "26/12/1982"
                    : organogramDate
                    ? generateDateFormat(
                        organogramDate,
                        DATE_PATTERN.GOVT_STANDARD
                      )
                    : COMMON_LABELS.NOT_ASSIGN}
                </div>
              </h5>
            </div>
            <Separator className="mt-1 mb-5" />
            {fields.map((f, idx) => {
              return (
                <div
                  key={idx}
                  className="d-flex align-items-top gap-3 mt-1 w-100 border rounded px-3 my-1 bg-gray-100"
                >
                  <div className={idx < 1 ? "mt-8" : "mt-2"}>
                    <Label> {numEnToBn(idx + 1) + "।"} </Label>
                  </div>
                  <div className="row w-100">
                    {!isEnamCommittee && (
                      <div className="col-xl-6 col-12">
                        <Textarea
                          label={idx < 1 ? "বরাদ্দ (বাংলা)" : ""}
                          placeholder="বরাদ্দ বাংলায় লিখুন"
                          isRequired
                          noMargin
                          registerProperty={{
                            ...register(
                              `businessAllocationList.${idx}.businessOfAllocationBn`,
                              {
                                required: true,
                                // onChange: (e) => {
                                //   if (notNullOrUndefined(e.target.value)) {
                                //     setValue(
                                //       `businessAllocationList.${idx}.displayOrder`,
                                //       idx + 1
                                //     );
                                //   }
                                // },
                              }
                            ),
                          }}
                          isError={
                            !!errors?.businessAllocationList?.[idx]
                              ?.businessOfAllocationBn
                          }
                        />
                      </div>
                    )}
                    <div
                      className={
                        isEnamCommittee
                          ? "col-12 mt-1 mt-xl-0"
                          : "col-xl-6 col-12 mt-1 mt-xl-0"
                      }
                    >
                      <Textarea
                        label={idx < 1 ? "বরাদ্দ (ইংরেজি)" : ""}
                        placeholder="বরাদ্দ ইংরেজিতে লিখুন"
                        isRequired={isEnamCommittee}
                        noMargin
                        registerProperty={{
                          ...register(
                            `businessAllocationList.${idx}.businessOfAllocationEn`,
                            {
                              // onChange: (e) => {
                              //   if (notNullOrUndefined(e.target.value)) {
                              //     setValue(
                              //       `businessAllocationList.${idx}.displayOrder`,
                              //       idx + 1
                              //     );
                              //   }
                              // },
                              required: isEnamCommittee,
                              validate: enCheck,
                            }
                          ),
                        }}
                        isError={
                          !!errors?.businessAllocationList?.[idx]
                            ?.businessOfAllocationEn
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
                        remove(idx);
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="d-flex justify-content-center mt-8 mb-12">
              <IconButton
                iconName="add"
                color="success"
                className="w-50 rounded-pill"
                rounded={false}
                onClick={() => append("")}
              />
            </div>
          </div>
        </DrawerBody>

        <DrawerFooter>
          <div className="d-flex gap-3 justify-content-end">
            <Button
              color="secondary"
              onClick={onClose}
              isDisabled={submitLoading}
            >
              বন্ধ করুন
            </Button>
            <Button color="primary" type="submit" isLoading={submitLoading}>
              সংরক্ষণ
            </Button>
          </div>
        </DrawerFooter>
      </form>
    </Drawer>
  );
};
export default FormCreate;
