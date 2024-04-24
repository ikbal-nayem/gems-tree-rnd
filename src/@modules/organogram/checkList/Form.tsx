import {
  Autocomplete,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  Input,
} from "@gems/components";
import { IObject, numBnToEn } from "@gems/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface IChangeTypeForm {
  isOpen?: boolean;
  onSubmit: (data) => void;
  onClose: () => void;
  changeTypeList: IObject[];
  updateData?: any;
  submitLoading?: boolean;
}

const Form = ({
  isOpen,
  onClose,
  onSubmit,
  updateData,
  changeTypeList,
  submitLoading,
}: IChangeTypeForm) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (Object.keys(updateData).length > 0) {
      reset({
        ...updateData,
        type: updateData?.metaTypeEn,
      });
    } else {
      reset({ isActive: true });
    }
  }, [updateData, reset]);

  return (
    <Drawer
      title={`চেকলিস্ট ${
        Object.keys(updateData)?.length > 0 ? "হালনাগাদ" : "সংরক্ষণ"
      } করুন`}
      isOpen={isOpen}
      handleClose={onClose}
      className="w-md-50 w-xl-25"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DrawerBody>
          <div className="row">
            {" "}
            <Autocomplete
              label="পরিবর্তনের ধরণ"
              placeholder="পরিবর্তনের ধরণ বাছাই করুন"
              isRequired="পরিবর্তনের ধরণ বাছাই করুন"
              options={changeTypeList || []}
              name="organogramChangeTypeDTO"
              getOptionLabel={(op) => op.nameBn}
              getOptionValue={(op) => op.id}
              onChange={(op) => setValue("organogramChangeTypeId", op?.id)}
              control={control}
              isError={!!errors?.organogramChangeTypeDTO}
              errorMessage={errors?.organogramChangeTypeDTO?.message as string}
            />
            <div className="col-12">
              <Input
                label="নাম (বাংলা)"
                placeholder="নাম (বাংলা) লিখুন"
                registerProperty={{
                  ...register("titleBN", {
                    required: "নাম (বাংলা) লিখুন",
                  }),
                }}
                isRequired
                isError={!!errors?.titleBN}
                errorMessage={errors?.titleBN?.message as string}
              />
            </div>
            <div className="col-12">
              <Input
                label="নাম (ইংরেজি)"
                placeholder="নাম (ইংরেজি) লিখুন"
                registerProperty={{
                  ...register("titleEN", {
                    // required: "নাম (ইংরেজি) লিখুন",
                  }),
                }}
                // isRequired
                isError={!!errors?.titleEN}
                errorMessage={errors?.titleEN?.message as string}
              />
            </div>
            <div className="col-12">
              <Input
                label="ক্রমিক নম্বর"
                type="number"
                placeholder="ক্রমিক নম্বর লিখুন"
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
            <div className="col-12">
              <Input
                label="উপ ক্রমিক নম্বর"
                type="number"
                placeholder="উপ ক্রমিক নম্বর লিখুন"
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
export default Form;
