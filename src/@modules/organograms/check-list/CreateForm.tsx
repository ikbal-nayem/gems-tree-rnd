import Drawer from "@components/Drawer";
import {
  Autocomplete,
  Button,
  DrawerBody,
  DrawerFooter,
  IconButton,
  Input,
  Label,
} from "@gems/components";
import { IObject, numBnToEn, numEnToBn } from "@gems/utils";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface IChecklistCreateForm {
  isOpen?: boolean;
  onSubmit: (data) => void;
  onClose: () => void;
  changeTypeList: IObject[];
  submitLoading?: boolean;
}

const CreateForm = ({
  isOpen,
  onClose,
  onSubmit,
  changeTypeList,
  submitLoading,
}: IChecklistCreateForm) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "checklist",
  });

  useEffect(() => {
    if (isOpen) {
      remove();
      reset({});
      append({});
    }
  }, [isOpen]);

  return (
    <Drawer
      title={`চেকলিস্ট সংরক্ষণ করুন`}
      isOpen={isOpen}
      handleClose={onClose}
      className="w-100"
      widthMd="75"
      widthXl="50"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DrawerBody>
          <div className="row">
            {" "}
            <div className="col-md-6">
              <Autocomplete
                label="পরিবর্তনের ধরণ"
                placeholder="পরিবর্তনের ধরণ বাছাই করুন"
                isRequired="পরিবর্তনের ধরণ বাছাই করুন"
                options={changeTypeList || []}
                name="organogramChangeTypeDto"
                getOptionLabel={(op) => op.titleBN}
                getOptionValue={(op) => op.id}
                onChange={(op) => setValue("organogramChangeTypeId", op?.id)}
                control={control}
                isError={!!errors?.organogramChangeTypeDto}
                errorMessage={
                  errors?.organogramChangeTypeDto?.message as string
                }
              />
            </div>
            {fields.map((f, idx) => (
              <div
                className={`d-flex align-items-top gap-3 w-100 border rounded mx-2 my-1 py-1 bg-gray-100`}
                key={f?.id}
              >
                <div className={idx < 1 ? "mt-9" : "mt-2"}>
                  <Label className="mb-0"> {numEnToBn(idx + 1) + "।"} </Label>
                </div>
                <div className="row w-100">
                  <div className="col-md-6 col-xl-4 px-1 pb-1 pb-xl-0">
                    <Input
                      label={idx < 1 ? "নাম (বাংলা)" : ""}
                      placeholder="নাম (বাংলা) লিখুন"
                      registerProperty={{
                        ...register(`checklist.${idx}.titleBn`, {
                          required: "নাম (বাংলা) লিখুন",
                        }),
                      }}
                      isRequired
                      noMargin
                      isError={!!errors?.checklist?.[idx]?.titleBn}
                      errorMessage={
                        errors?.checklist?.[idx]?.titleBn?.message as string
                      }
                    />
                  </div>
                  <div className="col-md-6 col-xl-4 px-1 pb-1 pb-xl-0">
                    <Input
                      label={idx < 1 ? "নাম (ইংরেজি)" : ""}
                      placeholder="নাম (ইংরেজি) লিখুন"
                      noMargin
                      registerProperty={{
                        ...register(`checklist.${idx}.titleEn`, {
                          // required: "নাম (ইংরেজি) লিখুন",
                        }),
                      }}
                      // isRequired
                      isError={!!errors?.checklist?.[idx]?.titleEn}
                      errorMessage={
                        errors?.checklist?.[idx]?.titleEn?.message as string
                      }
                    />
                  </div>
                  <div className="col-md-6 col-xl-2 px-1 pb-1 pb-md-0">
                    <Input
                      label={idx < 1 ? "ক্রমিক নম্বর" : ""}
                      type="number"
                      placeholder="ক্রমিক নম্বর লিখুন"
                      noMargin
                      min={1}
                      registerProperty={{
                        ...register(`checklist.${idx}.slNo`, {
                          required: "ক্রমিক নম্বর লিখুন",
                          setValueAs: (v) => numBnToEn(v),
                          // maxLength: {
                          //   value: 1,
                          //   message: COMMON_INSTRUCTION.MAX_CHAR(1),
                          // },
                        }),
                      }}
                      isRequired
                      isError={!!errors?.checklist?.[idx]?.slNo}
                      errorMessage={
                        errors?.checklist?.[idx]?.slNo?.message as string
                      }
                    />
                  </div>
                  <div className="col-md-6 col-xl-2 px-1 pb-1 pb-md-0">
                    <Input
                      label={idx < 1 ? "উপ ক্রমিক নম্বর" : ""}
                      type="number"
                      placeholder="উপ ক্রমিক নম্বর লিখুন"
                      noMargin
                      min={1}
                      registerProperty={{
                        ...register(`checklist.${idx}.subSl`, {
                          required: "উপ ক্রমিক নম্বর লিখুন",
                          setValueAs: (v) => numBnToEn(v),
                          // maxLength: {
                          //   value: 1,
                          //   message: COMMON_INSTRUCTION.MAX_CHAR(1),
                          // },
                        }),
                      }}
                      isRequired
                      isError={!!errors?.checklist?.[idx]?.subSl}
                      errorMessage={
                        errors?.checklist?.[idx]?.subSl?.message as string
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
            ))}
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
              সংরক্ষণ করুন
            </Button>
          </div>
        </DrawerFooter>
      </form>
    </Drawer>
  );
};
export default CreateForm;
