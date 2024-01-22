import {
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerFooter,
  Input,
} from "@gems/components";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface IGradeForm {
  isOpen?: boolean;
  onSubmit: (data) => void;
  onClose: () => void;
  updateData?: any;
  submitLoading?: boolean;
}

const GradeForm = ({
  isOpen,
  onClose,
  onSubmit,
  updateData,
  submitLoading,
}: IGradeForm) => {
  const {
    register,
    handleSubmit,
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
      title={`প্রতিষ্ঠানের ধরণ ${
        Object.keys(updateData)?.length > 0 ? "হালনাগাদ" : "সংরক্ষণ"
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
                label="প্রতিষ্ঠানের ধরণ (ইংরেজি)"
                placeholder="প্রতিষ্ঠানের ধরণ (ইংরেজি) লিখুন"
                registerProperty={{
                  ...register("orgTypeEn", {
                    required: "প্রতিষ্ঠানের ধরণ (ইংরেজি) লিখুন",
                  }),
                }}
                isRequired
                isError={!!errors?.orgTypeEn}
                errorMessage={errors?.orgTypeEn?.message as string}
              />
            </div>
            <div className="col-12">
              <Input
                label="প্রতিষ্ঠানের ধরণ (বাংলা)"
                placeholder="প্রতিষ্ঠানের ধরণ (বাংলা) লিখুন"
                registerProperty={{
                  ...register("orgTypeBn", {
                    required: "প্রতিষ্ঠানের ধরণ (বাংলা) লিখুন",
                  }),
                }}
                isRequired
                isError={!!errors?.orgTypeBn}
                errorMessage={errors?.orgTypeBn?.message as string}
              />
            </div>
            <div className="col-12">
              <Input
                label="প্রতিষ্ঠানের গ্রুপ (ইংরেজি)"
                placeholder="প্রতিষ্ঠানের গ্রুপ (ইংরেজি) লিখুন"
                registerProperty={{
                  ...register("orgGroupEn", {
                    required: "প্রতিষ্ঠানের গ্রুপ (ইংরেজি) লিখুন",
                  }),
                }}
                isRequired
                isError={!!errors?.orgGroupEn}
                errorMessage={errors?.orgGroupEn?.message as string}
              />
            </div>
            <div className="col-12">
              <Input
                label="প্রতিষ্ঠানের গ্রুপ (বাংলা)"
                placeholder="প্রতিষ্ঠানের গ্রুপ (বাংলা) লিখুন"
                registerProperty={{
                  ...register("orgGroupBn", {
                    required: "প্রতিষ্ঠানের গ্রুপ (বাংলা) লিখুন",
                  }),
                }}
                isRequired
                isError={!!errors?.orgGroupBn}
                errorMessage={errors?.orgGroupBn?.message as string}
              />
            </div>
            <div className="col-12">
              <Input
                label="প্রতিষ্ঠানের লেভেল"
                type="number"
                placeholder="প্রতিষ্ঠানের লেভেল লিখুন"
                min={1}
                registerProperty={{
                  ...register("orgLevel", {
                    required: "প্রতিষ্ঠানের লেভেল লিখুন",
                  }),
                }}
                isRequired
                isError={!!errors?.orgLevel}
                errorMessage={errors?.orgLevel?.message as string}
              />
            </div>
            <div className="col-12">
              <Input
                label="কোড"
                placeholder="কোড লিখুন"
                registerProperty={{
                  ...register("orgCode"),
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
export default GradeForm;
