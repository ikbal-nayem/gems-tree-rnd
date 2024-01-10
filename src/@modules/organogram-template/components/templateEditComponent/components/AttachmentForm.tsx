import { Input } from "@components/Input";
import { LABELS, META_TYPE } from "@constants/common.constant";
import {
  DateInput,
  IconButton,
  Label,
  Separator,
  SingleFile,
} from "@gems/components";
import { IObject, notNullOrUndefined, numEnToBn } from "@gems/utils";
import { CoreService } from "@services/api/Core.service";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { enCheck } from "utility/checkValidation";

interface IAttachmentForm {
  formProps: any;
}

const AttachmentForm = ({ formProps }: IAttachmentForm) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = formProps;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attachmentDtoList",
  });

  const [checklist, setCheckList] = useState<IObject[]>([]);

  useEffect(() => {
    CoreService.getByMetaTypeList(META_TYPE.CHECKLIST).then((resp) => {
      setCheckList(resp?.body);
    });
  }, []);

  const onTitleChange = (val, idx, fieldLang: "en" | "bn") => {
    if (!notNullOrUndefined(val)) return;
    let suggestedValue;
    if (fieldLang === "en") {
      suggestedValue = checklist?.find((obj) => obj?.titleEn === val);
      if (notNullOrUndefined(suggestedValue))
        setValue(`attachmentDtoList.${idx}.titleBn`, suggestedValue?.titleBn);
    } else {
      suggestedValue = checklist?.find((obj) => obj?.titleBn === val);
      if (notNullOrUndefined(suggestedValue))
        setValue(`attachmentDtoList.${idx}.titleEn`, suggestedValue?.titleEn);
    }
  };

  const onFileChange = (e, idx) => {
    setValue(`attachmentDtoList.${idx}.fileName`, e?.name || null);
  };

  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.ATTACHMENT}</h4>
        <IconButton iconName="add" color="primary" onClick={() => append("")} />
      </div>
      <Separator className="mt-1 mb-2" />
      <div>
        {fields.map((f, idx) => {
          const label = "নাম";
          const labelGONo = "জিও নম্বর";
          const labelBn = label + " (বাংলা)";
          const labelEn = label + " (ইংরেজি)";
          const labelGONoBn = labelGONo + " (বাংলা)";
          const labelGONoEn = labelGONo + " (ইংরেজি)";
          const labelGODate = "জিও তারিখ";
          const labelAttachment = "ফাইল";

          return (
            <div
              key={idx}
              className="d-flex align-items-top gap-3 mt-3 w-100 border rounded pt-3 px-3 my-2 bg-gray-100 pb-3 pb-xl-0"
            >
              <div className={idx < 1 ? "mt-8" : "mt-2"}>
                <Label> {numEnToBn(idx + 1) + "।"} </Label>
              </div>
              <div className="row w-100">
                <div className="col-xl-3 col-12">
                  <Input
                    label={idx < 1 ? labelEn : ""}
                    placeholder={labelEn + " লিখুন"}
                    registerProperty={{
                      ...register(`attachmentDtoList.${idx}.titleEn`, {
                        onChange: (e) => {
                          onTitleChange(e.target.value, idx, "en");
                        },
                        validate: enCheck,
                      }),
                    }}
                    isError={!!errors?.attachmentDtoList?.[idx]?.titleEn}
                    errorMessage={
                      errors?.attachmentDtoList?.[idx]?.titleEn
                        ?.message as string
                    }
                    autoSuggestionKey="titleEn"
                    suggestionOptions={checklist || []}
                    suggestionTextKey="titleEn"
                  />
                  <>
                    <Input
                      label={idx < 1 ? labelBn : ""}
                      placeholder={labelBn + " লিখুন"}
                      isRequired
                      registerProperty={{
                        ...register(`attachmentDtoList.${idx}.titleBn`, {
                          onChange: (e) =>
                            onTitleChange(e.target.value, idx, "bn"),
                          required: " ",
                        }),
                      }}
                      isError={!!errors?.attachmentDtoList?.[idx]?.titleBn}
                      errorMessage={
                        errors?.attachmentDtoList?.[idx]?.titleBn
                          ?.message as string
                      }
                      autoSuggestionKey="titleBn"
                      suggestionOptions={checklist || []}
                      suggestionTextKey="titleBn"
                    />
                  </>
                </div>
                <div className="col-xl-3 col-12">
                  <>
                    <Input
                      label={idx < 1 ? labelGONoEn : ""}
                      placeholder={labelGONoEn + " লিখুন"}
                      registerProperty={{
                        ...register(`attachmentDtoList.${idx}.goNoEn`, {
                          validate: enCheck,
                        }),
                      }}
                      isError={!!errors?.attachmentDtoList?.[idx]?.goNoEn}
                      errorMessage={
                        errors?.attachmentDtoList?.[idx]?.goNoEn
                          ?.message as string
                      }
                    />
                    <Input
                      label={idx < 1 ? labelGONoBn : ""}
                      placeholder={labelGONoBn + " লিখুন"}
                      isRequired
                      registerProperty={{
                        ...register(`attachmentDtoList.${idx}.goNoBn`, {
                          required: " ",
                          setValueAs: (v) => numEnToBn(v),
                        }),
                      }}
                      isError={!!errors?.attachmentDtoList?.[idx]?.goNoBn}
                      errorMessage={
                        errors?.attachmentDtoList?.[idx]?.goNoBn
                          ?.message as string
                      }
                    />
                  </>
                </div>
                <div className="col-xl-3 col-12">
                  <DateInput
                    label={idx < 1 ? labelGODate : ""}
                    isRequired={" "}
                    name={`attachmentDtoList.${idx}.goDate`}
                    control={control}
                    isError={!!errors?.attachmentDtoList?.[idx]?.goDate}
                    errorMessage={
                      errors?.attachmentDtoList?.[idx]?.goDate
                        ?.message as string
                    }
                  />
                </div>
                {/* <div
                  className={
                    idx < 1 ? "col-xl-3 mt-xl-9 mt-0" : "col-xl-3 mt-3"
                  }
                >
                  <Checkbox
                    label="বাধ্যতামূলক ?"
                    noMargin
                    labelClass="mb-0"
                    registerProperty={{
                      ...register(`attachmentDtoList.${idx}.isMandatory`),
                    }}
                  />
                </div> */}
                <div className="col-xl-3 col-12">
                  <SingleFile
                    isRequired="ফাইল আপলোড করুন"
                    control={control}
                    label={idx < 1 ? labelAttachment : ""}
                    name={`attachmentDtoList.${idx}.checkAttachmentFile`}
                    onChange={(e) => onFileChange(e, idx)}
                    isError={
                      !!errors?.attachmentDtoList?.[idx]?.checkAttachmentFile
                    }
                    errorMessage={
                      errors?.attachmentDtoList?.[idx]?.checkAttachmentFile
                        ?.message as string
                    }
                    maxSize={1}
                    // helpText="পিডিএফ ফাইল নির্বাচন করুন,ফাইলের সর্বোচ্চ সাইজ ১৫ এমবি"
                  />
                </div>
              </div>

              <div className={idx < 1 ? "mt-6" : ""}>
                <IconButton
                  iconName="delete"
                  color="danger"
                  // isDisabled={fields.length === 1}
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

export default AttachmentForm;
