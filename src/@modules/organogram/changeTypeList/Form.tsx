import {
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerFooter,
  Input,
} from "@gems/components";
import { COMMON_INSTRUCTION, numBnToEn } from "@gems/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface IChangeTypeForm {
  isOpen?: boolean;
  onSubmit: (data) => void;
  onClose: () => void;
  updateData?: any;
  submitLoading?: boolean;
}

const Form = ({
  isOpen,
  onClose,
  onSubmit,
  updateData,
  submitLoading,
}: IChangeTypeForm) => {
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
      title={`পরিবর্তনের ধরণ ${
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
                label="নাম (ইংরেজি)"
                placeholder="নাম (ইংরেজি) লিখুন"
                registerProperty={{
                  ...register("titleEN", {
                    required: "নাম (ইংরেজি) লিখুন",
                  }),
                }}
                isRequired
                isError={!!errors?.titleEN}
                errorMessage={errors?.titleEN?.message as string}
              />
            </div>
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

            {/* <div className="col-12">
              <Input
                label="প্রতিষ্ঠানের লেভেল"
                type="number"
                placeholder="প্রতিষ্ঠানের লেভেল লিখুন"
                min={1}
                registerProperty={{
                  ...register("orgTypeLevel", {
                    required: "প্রতিষ্ঠানের লেভেল লিখুন",
                    setValueAs: (v) => numBnToEn(v),
                    maxLength: {
                      value: 1,
                      message: COMMON_INSTRUCTION.MAX_CHAR(1),
                    },
                  }),
                }}
                isRequired
                isError={!!errors?.orgTypeLevel}
                errorMessage={errors?.orgTypeLevel?.message as string}
              />
            </div> */}
            <div className="col-12">
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
export default Form;
