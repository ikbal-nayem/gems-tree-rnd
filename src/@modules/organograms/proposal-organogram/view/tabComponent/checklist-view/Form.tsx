import {
  Button,
  Checkbox,
  Label,
  SingleFile,
  Textarea,
} from "@gems/components";
import { IObject, numEnToBn } from "@gems/utils";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface IForm {
  updateData?: IObject[];
}
const Form = ({ updateData }: IForm) => {
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
    reset({
      orgmChangeList: updateData,
    });
  }, [updateData]);

  const onFormSubmit = (data) => {
    console.log("man", data);
  };

  console.log("orgmList", errors);
  console.log("orgmL", updateData);

  return (
    <div className="card border p-3 overflow-scroll">
      <form onSubmit={handleSubmit(onFormSubmit)}>
        {fields?.length > 0 &&
          fields.map((f: IObject, idx) => {
            return (
              <div
                className={`d-flex align-items-top w-100 mt-1 border rounded px-3 my-1`}
                key={idx}
              >
                <div className={f?.serialNo === 1 ? "mt-8" : "mt-2"}>
                  <Label> {numEnToBn(f?.serialNo) + "।"} </Label>
                </div>
                <div className="w-100">
                  {f?.list?.length > 0 &&
                    f?.list?.map((d, lIndex) => {
                      return (
                        <div className="ms-2 pt-2 row" key={lIndex}>
                          <div className="col-xl-4">
                            {idx === 0 && lIndex === 0 && (
                              <Label className="mb-0 fw-bold">বিষয়</Label>
                            )}

                            {d?.titleBn}
                          </div>
                          <div className="col-xl-1">
                            {idx === 0 && lIndex === 0 && (
                              <Label className="mb-0 fw-bold">হ্যাঁ/না</Label>
                            )}
                            <Checkbox
                              noMargin
                              registerProperty={{
                                ...register(
                                  `orgmChangeList.${idx}.list.${lIndex}.isAttachment`
                                ),
                              }}
                            />
                          </div>
                          {watch(
                            `orgmChangeList.${idx}.list.${lIndex}.isAttachment`
                          ) && (
                            <div className="col-xl-3">
                              {idx === 0 && lIndex === 0 && (
                                <Label className="mb-0 fw-bold">সংযুক্তি</Label>
                              )}
                              <SingleFile
                                isRequired="ফাইল আপলোড করুন"
                                control={control}
                                name={`orgmChangeList.${idx}.list.${lIndex}.attachmentFile`}
                                isError={
                                  !!errors?.orgmChangeList?.[idx]?.list?.[
                                    lIndex
                                  ]?.attachmentFile
                                }
                                errorMessage={
                                  errors?.orgmChangeList?.[idx]?.list?.[lIndex]
                                    ?.attachmentFile?.message as string
                                }
                                // maxSize={3}
                              />
                            </div>
                          )}
                          <div className="col-xl-4">
                            {idx === 0 && lIndex === 0 && (
                              <Label className="mb-0 fw-bold">মন্তব্য</Label>
                            )}
                            <Textarea
                              placeholder={"মন্তব্য লিখুন"}
                              rows={3}
                              noMargin
                              registerProperty={{
                                ...register(
                                  `orgmChangeList.${idx}.list.${lIndex}.note`
                                ),
                              }}
                              isError={
                                !!errors?.orgmChangeList?.[idx]?.list?.[lIndex]
                                  ?.note
                              }
                              errorMessage={
                                errors?.orgmChangeList?.[idx]?.list?.[lIndex]
                                  ?.note?.message as string
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
        <div className="d-flex gap-3 justify-content-center mt-3">
          <Button color="primary" type="submit">
            {Object.keys(updateData)?.length > 0
              ? "হালনাগাদ করুন"
              : "সংরক্ষণ করুন"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Form;
