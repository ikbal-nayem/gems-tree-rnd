import {
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerFooter,
  Input,
} from "@gems/components";
import { isObjectNull } from "@gems/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface IPostForm {
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
}: IPostForm) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!isObjectNull(updateData)) {
      reset({
        ...updateData,
        isApproved: false,
      });
    } else {
      reset({ isActive: true, isEnum: false });
    }
  }, [updateData, reset]);

  return (
    <Drawer
      title={`পদবি ${!isObjectNull(updateData) ? "হালনাগাদ" : "সংরক্ষণ"} করুন`}
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
                  ...register("postNameEn", {
                    required: "নাম (ইংরেজি) লিখুন",
                  }),
                }}
                isRequired
                isError={!!errors?.postNameEn}
                errorMessage={errors?.postNameEn?.message as string}
              />
            </div>
            <div className="col-12">
              <Input
                label="নাম (বাংলা)"
                placeholder="নাম (বাংলা) লিখুন"
                registerProperty={{
                  ...register("postNameBn", {
                    required: "নাম (বাংলা) লিখুন",
                  }),
                }}
                isRequired
                isError={!!errors?.postNameBn}
                errorMessage={errors?.postNameBn?.message as string}
              />
            </div>

            <div className="col-12">
              <Checkbox
                label="এনাম কমিটি"
                registerProperty={{
                  ...register("isEnum"),
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
              {!isObjectNull(updateData) ? "হালনাগাদ" : "সংরক্ষণ"}
            </Button>
          </div>
        </DrawerFooter>
      </form>
    </Drawer>
  );
};
export default Form;
