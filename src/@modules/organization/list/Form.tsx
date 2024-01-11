import {
  Checkbox,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  Input,
  Autocomplete,
  DateInput,
} from "@gems/components";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { COMMON_LABELS, IObject, isObjectNull } from "@gems/utils";
import WorkSpaceComponent from "./WorkSpaceComponent";
import LocationWorkSpaceComponent from "./LocationWorkSpaceComponent";

interface IOrgForm {
  isOpen?: boolean;
  onSubmit: (data) => void;
  onClose: () => void;
  updateData?: any;
  submitLoading?: boolean;
  options?: IObject;
}

const OrgForm = ({
  isOpen,
  onClose,
  onSubmit,
  updateData,
  submitLoading,
  options,
}: IOrgForm) => {
  const formProps = useForm();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
  } = formProps;

  useEffect(() => {
    if (!isObjectNull(updateData)) {
      reset({
        ...updateData,
        isTrainingOffice: updateData?.trainingOfficeTag === "TRAINING",
      });
    } else {
      reset({
        isActive: true,
        isTrainingOffice: false,
      });
    }
  }, [updateData]);

  return (
    <Drawer
      title={`প্রতিষ্ঠানের নাম ${
        !isObjectNull(updateData) ? "হালনাগাদ" : "সংরক্ষণ"
      } করুন`}
      isOpen={isOpen}
      handleClose={onClose}
      className="w-md-50 w-xl-25"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DrawerBody>
          <div className="row">
            <div className="col-12">
              <Input
                label="নাম (ইংরেজি)"
                placeholder="নাম (ইংরেজি) লিখুন"
                registerProperty={{
                  ...register("nameEn", {
                    required: "নাম (ইংরেজি) লিখুন",
                  }),
                }}
                isRequired
                isError={!!errors?.nameEn}
                errorMessage={errors?.nameEn?.message as string}
              />
            </div>
            <div className="col-12">
              <Input
                label="নাম (বাংলা)"
                placeholder="নাম (বাংলা) লিখুন"
                registerProperty={{
                  ...register("nameBn", {
                    required: "নাম (বাংলা) লিখুন",
                  }),
                }}
                isRequired
                isError={!!errors?.nameBn}
                errorMessage={errors?.nameBn?.message as string}
              />
            </div>
            <div className="col-12">
              <Autocomplete
                label="প্রতিষ্ঠানের ধরণ"
                placeholder="প্রতিষ্ঠানের ধরণ বাছাই করুন"
                isRequired="প্রতিষ্ঠানের ধরণ বাছাই করুন"
                options={options?.institutionTypes || []}
                name="officeTypeDTO"
                getOptionLabel={(op) => op.titleBn}
                getOptionValue={(op) => op.metaKey}
                onChange={(op) => setValue("officeType", op?.metaKey)}
                control={control}
                isError={!!errors?.officeTypeDTO}
                errorMessage={errors?.officeTypeDTO?.message as string}
              />
            </div>
            <div className="col-12">
              <Autocomplete
                label="সংস্থার ধরণ"
                placeholder="সংস্থার ধরণ বাছাই করুন"
                isRequired="সংস্থার ধরণ বাছাই করুন"
                options={options?.organizationTypes || []}
                name="orgTypeDTO"
                getOptionLabel={(op) => op.titleBn}
                getOptionValue={(op) => op.metaKey}
                onChange={(op) => setValue("orgType", op?.metaKey)}
                control={control}
                isError={!!errors?.orgTypeDTO}
                errorMessage={errors?.orgTypeDTO?.message as string}
              />
            </div>
            <div className="col-12">
              <WorkSpaceComponent
                isRequired="অভিভাবক প্রতিষ্ঠানের নাম বাছাই করুন"
                {...formProps}
              />
            </div>
            <div className="col-12">
              <Autocomplete
                label="মন্ত্রণালয়/বিভাগ"
                placeholder="মন্ত্রণালয়/বিভাগ বাছাই করুন"
                options={options?.ministryList || []}
                name="rootParent"
                getOptionLabel={(op) => op.nameBn}
                getOptionValue={(op) => op.id}
                onChange={(op) => setValue("rootParentId", op?.id)}
                control={control}
                isError={!!errors?.rootParent}
                errorMessage={errors?.rootParent?.message as string}
              />
            </div>

            <div className="col-12">
              <LocationWorkSpaceComponent
                isRequired="স্থান বাছাই করুন"
                {...formProps}
              />
            </div>

            <DateInput
              label="অর্গানোগ্রাম তারিখ"
              control={control}
              name="organogramDate"
            />

            <div className="col-12 col-md-6">
              <Checkbox
                label="সক্রিয়"
                registerProperty={{
                  ...register("isActive"),
                }}
              />
            </div>
            <div className="col-12 col-md-6">
              <Checkbox
                label="প্রশিক্ষণ প্রতিষ্ঠান"
                registerProperty={{
                  ...register("isTrainingOffice", {
                    onChange: (e) =>
                      setValue(
                        "trainingOfficeTag",
                        e.target.checked ? "TRAINING" : ""
                      ),
                  }),
                }}
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
              {!isObjectNull(updateData)
                ? COMMON_LABELS.EDIT
                : COMMON_LABELS.SAVE}
            </Button>
          </div>
        </DrawerFooter>
      </form>
    </Drawer>
  );
};
export default OrgForm;
