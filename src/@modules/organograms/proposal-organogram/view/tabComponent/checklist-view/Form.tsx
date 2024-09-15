import {
  Button,
  Checkbox,
  Label,
  SingleFile,
  Textarea,
} from "@gems/components";
import { IObject, isListNull, numEnToBn } from "@gems/utils";
import clsx from "clsx";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface IForm {
  data: IObject[];
  onSubmit: (data) => void;
  isSubmitLoading?: boolean;
  pdfDownloadId?: string;
  selectedChangeType?: IObject;
}
const Form = ({
  data,
  onSubmit,
  isSubmitLoading,
  pdfDownloadId,
  selectedChangeType,
}: IForm) => {
  const {
    register,
    control,
    setValue,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { fields } = useFieldArray({
    control,
    name: "orgmChangeList",
  });

  useEffect(() => {
    if (!isListNull(data))
      reset({
        orgmChangeList: data,
      });
    else reset({});
  }, [data, reset]);

  const onFileChange = (e, idx, index) => {
    setValue(
      `orgmChangeList.${idx}.orgChecklistDtoList.${index}.fileName`,
      e?.name || null
    );
  };

  return (
    <div className="card border p-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div id={pdfDownloadId} className="pdfPadding">
          <div
            className="pdfHeader text-center"
            style={{ overflow: "hidden", height: 0 }}
          >
            <p className="fs-3 fw-bold">{`${selectedChangeType?.titleBn} এর চেকলিস্ট`}</p>
          </div>
          <p className="mb-1">প্রশাসনিক মন্ত্রণালয়/বিভাগ/দপ্তর/সংস্থাঃ</p>
          {fields?.length > 0 &&
            fields.map((f: IObject, idx) => {
              return (
                <div
                  className={`d-flex align-items-top w-100 mt-1 border rounded px-3 my-1`}
                  key={idx}
                >
                  <div className={f?.chromicNo === 1 ? "mt-8" : "mt-2"}>
                    <Label> {numEnToBn(f?.chromicNo) + "।"} </Label>
                  </div>
                  <div className="w-100">
                    {f?.orgChecklistDtoList?.length > 0 &&
                      f?.orgChecklistDtoList?.map((d, index) => {
                        return (
                          <div
                            className={clsx("ms-2 p-2 row", {
                              "border-bottom border-2":
                                f?.orgChecklistDtoList?.length - 1 !== index,
                            })}
                            key={index}
                          >
                            <div className="col-xl-4">
                              {idx === 0 && index === 0 && (
                                <Label className="mb-0 fw-bold">বিষয়</Label>
                              )}

                              {d?.titleBn}
                            </div>
                            <div className="col-xl-1">
                              {idx === 0 && index === 0 && (
                                <Label className="mb-0 fw-bold">হ্যাঁ/না</Label>
                              )}
                              <div className="mt-1 mb-2">
                                <Checkbox
                                  noMargin
                                  registerProperty={{
                                    ...register(
                                      `orgmChangeList.${idx}.orgChecklistDtoList.${index}.isSubject`
                                    ),
                                  }}
                                />
                              </div>
                            </div>
                            {watch(
                              `orgmChangeList.${idx}.orgChecklistDtoList.${index}.isSubject`
                            ) && (
                              <div className="col-xl-3">
                                {idx === 0 && index === 0 && (
                                  <Label className="mb-0 fw-bold" isRequired>
                                    সংযুক্তি
                                  </Label>
                                )}
                                <SingleFile
                                  isRequired="ফাইল আপলোড করুন"
                                  control={control}
                                  name={`orgmChangeList.${idx}.orgChecklistDtoList.${index}.attachmentFile`}
                                  onChange={(e) => onFileChange(e, idx, index)}
                                  isError={
                                    !!errors?.orgmChangeList?.[idx]
                                      ?.orgChecklistDtoList?.[index]
                                      ?.attachmentFile
                                  }
                                  errorMessage={
                                    errors?.orgmChangeList?.[idx]
                                      ?.orgChecklistDtoList?.[index]
                                      ?.attachmentFile?.message as string
                                  }
                                  // maxSize={3}
                                />
                              </div>
                            )}
                            <div
                              className={
                                watch(
                                  `orgmChangeList.${idx}.orgChecklistDtoList.${index}.isSubject`
                                )
                                  ? "col-xl-4"
                                  : "col-xl-7"
                              }
                            >
                              {idx === 0 && index === 0 && (
                                <Label className="mb-0 fw-bold">মন্তব্য</Label>
                              )}
                              <Textarea
                                placeholder={"মন্তব্য লিখুন"}
                                rows={3}
                                noMargin
                                registerProperty={{
                                  ...register(
                                    `orgmChangeList.${idx}.orgChecklistDtoList.${index}.comment`
                                  ),
                                }}
                                isError={
                                  !!errors?.orgmChangeList?.[idx]
                                    ?.orgChecklistDtoList?.[index]?.comment
                                }
                                errorMessage={
                                  errors?.orgmChangeList?.[idx]
                                    ?.orgChecklistDtoList?.[index]?.comment
                                    ?.message as string
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
        </div>

        <div className="d-flex gap-3 justify-content-center mt-3">
          <Button color="primary" type="submit" isLoading={isSubmitLoading}>
            {Object.keys(data)?.length > 0 ? "হালনাগাদ করুন" : "সংরক্ষণ করুন"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Form;
