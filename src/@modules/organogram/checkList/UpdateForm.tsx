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

interface IChecklistUpdateForm {
  isOpen?: boolean;
  onSubmit: (data) => void;
  onClose: () => void;
  changeTypeList: IObject[];
  updateData?: any;
  submitLoading?: boolean;
}

const UpdateForm = ({
  isOpen,
  onClose,
  onSubmit,
  updateData,
  changeTypeList,
  submitLoading,
}: IChecklistUpdateForm) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      checklist: [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "checklist",
  });

  useEffect(() => {
    remove();
    if (Object.keys(updateData).length > 0) {
      reset({
        ...updateData,
        // type: updateData?.metaTypeEn,
      });
    } else {
      reset({});
    }
  }, [updateData, reset]);

  return (
    <Drawer
      title={`চেকলিস্ট ${
        Object.keys(updateData)?.length > 0 ? "হালনাগাদ" : "সংরক্ষণ"
      } করুন`}
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
                name="organogramChangeTypeDTO"
                getOptionLabel={(op) => op.titleBN}
                getOptionValue={(op) => op.id}
                onChange={(op) => setValue("organogramChangeTypeId", op?.id)}
                control={control}
                isError={!!errors?.organogramChangeTypeDTO}
                errorMessage={
                  errors?.organogramChangeTypeDTO?.message as string
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
                        ...register(`checklist.${idx}.titleBN`, {
                          required: "নাম (বাংলা) লিখুন",
                        }),
                      }}
                      isRequired
                      noMargin
                      isError={!!errors?.checklist?.[idx]?.titleBN}
                      errorMessage={
                        errors?.checklist?.[idx]?.titleBN?.message as string
                      }
                    />
                  </div>
                  <div className="col-md-6 col-xl-4 px-1 pb-1 pb-xl-0">
                    <Input
                      label={idx < 1 ? "নাম (ইংরেজি)" : ""}
                      placeholder="নাম (ইংরেজি) লিখুন"
                      noMargin
                      registerProperty={{
                        ...register(`checklist.${idx}.titleEN`, {
                          // required: "নাম (ইংরেজি) লিখুন",
                        }),
                      }}
                      // isRequired
                      isError={!!errors?.checklist?.[idx]?.titleEN}
                      errorMessage={
                        errors?.checklist?.[idx]?.titleEN?.message as string
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
                        ...register("orgTypeLevel", {
                          required: "ক্রমিক নম্বর লিখুন",
                          setValueAs: (v) => numBnToEn(v),
                          // maxLength: {
                          //   value: 1,
                          //   message: COMMON_INSTRUCTION.MAX_CHAR(1),
                          // },
                        }),
                      }}
                      isRequired
                      isError={!!errors?.orgTypeLevel}
                      errorMessage={errors?.orgTypeLevel?.message as string}
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
                        ...register("orgTypeLevel", {
                          required: "উপ ক্রমিক নম্বর লিখুন",
                          setValueAs: (v) => numBnToEn(v),
                          // maxLength: {
                          //   value: 1,
                          //   message: COMMON_INSTRUCTION.MAX_CHAR(1),
                          // },
                        }),
                      }}
                      isRequired
                      isError={!!errors?.orgTypeLevel}
                      errorMessage={errors?.orgTypeLevel?.message as string}
                    />
                  </div>
                  {/* <div className="col-12">
              <Input
                label="কোড"
                placeholder="কোড লিখুন"
                registerProperty={{
                  ...register("code"),
                }}
              />
            </div>
            <div className="col-12">
              <Checkbox
                label="সক্রিয়"
                registerProperty={{
                  ...register("isActive"),
                }}
              />
            </div> */}
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
              {Object.keys(updateData)?.length > 0 ? "হালনাগাদ" : "সংরক্ষণ"}
            </Button>
          </div>
        </DrawerFooter>
      </form>
    </Drawer>
  );
};
export default UpdateForm;
