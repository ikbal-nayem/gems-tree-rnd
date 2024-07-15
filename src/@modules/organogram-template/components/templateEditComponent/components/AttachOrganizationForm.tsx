import { LABELS } from "@constants/common.constant";
import { IconButton, Input, Label, Separator } from "@gems/components";
import { enCheck, notNullOrUndefined, numEnToBn } from "@gems/utils";
import { useFieldArray } from "react-hook-form";

interface IAttachOrganizationForm {
  formProps: any;
  isNotEnamCommittee?: boolean;
}
const AttachOrganizationForm = ({
  formProps,
  isNotEnamCommittee,
}: IAttachOrganizationForm) => {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = formProps;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attachedOrganizationDtoList",
  });

  const attachedOrganizationData = watch("attachedOrganizationDtoList");
  const attachedOrganizationLastData =
    attachedOrganizationData?.length > 0
      ? attachedOrganizationData[attachedOrganizationData?.length - 1]
      : {};

  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.ATTACHED_OFFICE}</h4>
        <IconButton
          iconName="add"
          color="primary"
          onClick={() =>
            append({
              organizationGroupBn:
                attachedOrganizationLastData?.organizationGroupBn || null,
              organizationGroupEn:
                attachedOrganizationLastData?.organizationGroupEn || null,
            })
          }
        />
      </div>
      <Separator className="mt-1 mb-2" />
      <div>
        {fields.map((f, idx) => {
          const labelGroup = "গ্ৰুপ";
          const labelOrganization = "প্রতিষ্ঠান";
          const labelGroupBn = labelGroup + " (বাংলা)";
          const labelGroupEn = labelGroup + " (ইংরেজি)";
          const labelOrganizationBn = labelOrganization + " (বাংলা)";
          const labelOrganizationEn = labelOrganization + " (ইংরেজি)";
          return (
            <div
              key={idx}
              className="d-flex align-items-top gap-3 mt-1 w-100 border rounded px-3 my-1 bg-gray-100"
            >
              <div className={idx < 1 ? "mt-8" : "mt-2"}>
                <Label> {numEnToBn(idx + 1) + "।"} </Label>
              </div>
              <div className="row w-100">
                {isNotEnamCommittee && (
                  <div className="col-xl-3 col-12">
                    <Input
                      label={idx < 1 ? labelGroupBn : ""}
                      placeholder={labelGroupBn + " লিখুন"}
                      isRequired
                      noMargin
                      registerProperty={{
                        ...register(
                          `attachedOrganizationDtoList.${idx}.organizationGroupBn`,
                          {
                            required: " ",
                            onChange: (e) => {
                              if (notNullOrUndefined(e.target.value)) {
                                setValue(
                                  `attachedOrganizationDtoList.${idx}.serialNo`,
                                  idx + 1
                                );
                              }
                            },
                          }
                        ),
                      }}
                      isError={
                        !!errors?.attachedOrganizationDtoList?.[idx]
                          ?.organizationGroupBn
                      }
                    />
                  </div>
                )}
                <div
                  className={
                    isNotEnamCommittee
                      ? "col-xl-3 col-12 mt-1 mt-xl-0"
                      : "col-6 mt-1 mt-xl-0"
                  }
                >
                  <Input
                    label={idx < 1 ? labelGroupEn : ""}
                    placeholder={labelGroupEn + " লিখুন"}
                    isRequired={!isNotEnamCommittee}
                    noMargin
                    registerProperty={{
                      ...register(
                        `attachedOrganizationDtoList.${idx}.organizationGroupEn`,
                        {
                          onChange: (e) => {
                            if (notNullOrUndefined(e.target.value)) {
                              setValue(
                                `attachedOrganizationDtoList.${idx}.serialNo`,
                                idx + 1
                              );
                            }
                          },
                          required: !isNotEnamCommittee,
                          validate: enCheck,
                        }
                      ),
                    }}
                    isError={
                      !!errors?.attachedOrganizationDtoList?.[idx]
                        ?.organizationGroupEn
                    }
                  />
                </div>
                {isNotEnamCommittee && (
                  <div className="col-xl-3 col-12">
                    <Input
                      label={idx < 1 ? labelOrganizationBn : ""}
                      placeholder={labelOrganizationBn + " লিখুন"}
                      isRequired
                      noMargin
                      registerProperty={{
                        ...register(
                          `attachedOrganizationDtoList.${idx}.organizationNameBn`,
                          {
                            required: " ",
                            onChange: (e) => {
                              if (notNullOrUndefined(e.target.value)) {
                                setValue(
                                  `attachedOrganizationDtoList.${idx}.serialNo`,
                                  idx + 1
                                );
                              }
                            },
                          }
                        ),
                      }}
                      isError={
                        !!errors?.attachedOrganizationDtoList?.[idx]
                          ?.organizationNameBn
                      }
                    />
                  </div>
                )}
                <div
                  className={
                    isNotEnamCommittee
                      ? "col-xl-3 col-12 mt-1 mt-xl-0"
                      : "col-6 mt-1 mt-xl-0"
                  }
                >
                  <Input
                    label={idx < 1 ? labelOrganizationEn : ""}
                    placeholder={labelOrganizationEn + " লিখুন"}
                    isRequired={!isNotEnamCommittee}
                    noMargin
                    registerProperty={{
                      ...register(
                        `attachedOrganizationDtoList.${idx}.organizationNameEn`,
                        {
                          onChange: (e) => {
                            if (notNullOrUndefined(e.target.value)) {
                              setValue(
                                `attachedOrganizationDtoList.${idx}.serialNo`,
                                idx + 1
                              );
                            }
                          },
                          required: !isNotEnamCommittee,
                          validate: enCheck,
                        }
                      ),
                    }}
                    isError={
                      !!errors?.attachedOrganizationDtoList?.[idx]
                        ?.organizationNameEn
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
      </div>
    </div>
  );
};

export default AttachOrganizationForm;
