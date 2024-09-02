import Drawer from "@components/Drawer";
import {
  Autocomplete,
  Button,
  DrawerBody,
  DrawerFooter,
  Input,
} from "@gems/components";
import { IObject, numBnToEn } from "@gems/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

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

  useEffect(() => {
    if (Object.keys(updateData).length > 0) {
      reset({
        ...updateData,
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
              name="organogramChangeTypeDto"
              getOptionLabel={(op) => op.titleBN}
              getOptionValue={(op) => op.id}
              onChange={(op) => setValue("organogramChangeTypeId", op?.id)}
              control={control}
              isError={!!errors?.organogramChangeTypeDTO}
              errorMessage={errors?.organogramChangeTypeDTO?.message as string}
            />
            <div className="row w-100">
              <Input
                label={"নাম (বাংলা)"}
                placeholder="নাম (বাংলা) লিখুন"
                registerProperty={{
                  ...register(`titleBn`, {
                    required: "নাম (বাংলা) লিখুন",
                  }),
                }}
                isRequired
                isError={!!errors?.titleBn}
                errorMessage={errors?.titleBn?.message as string}
              />
              <Input
                label={"নাম (ইংরেজি)"}
                placeholder="নাম (ইংরেজি) লিখুন"
                registerProperty={{
                  ...register(`titleEn`, {
                    // required: "নাম (ইংরেজি) লিখুন",
                  }),
                }}
                // isRequired
                isError={!!errors?.titleEn}
                errorMessage={errors?.titleEn?.message as string}
              />
              <Input
                label={"ক্রমিক নম্বর"}
                type="number"
                placeholder="ক্রমিক নম্বর লিখুন"
                min={1}
                registerProperty={{
                  ...register("slNo", {
                    required: "ক্রমিক নম্বর লিখুন",
                    setValueAs: (v) => numBnToEn(v),
                    // maxLength: {
                    //   value: 1,
                    //   message: COMMON_INSTRUCTION.MAX_CHAR(1),
                    // },
                  }),
                }}
                isRequired
                isError={!!errors?.slNo}
                errorMessage={errors?.slNo?.message as string}
              />
              <Input
                label={"প্রদর্শন ক্রম"}
                type="number"
                placeholder="প্রদর্শন ক্রম লিখুন"
                min={1}
                isRequired
                registerProperty={{
                  ...register("displayOrder", {
                    required: "প্রদর্শন ক্রম লিখুন",
                    setValueAs: (v) => numBnToEn(v),
                  }),
                }}
                isError={!!errors?.displayOrder}
                errorMessage={errors?.displayOrder?.message as string}
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
