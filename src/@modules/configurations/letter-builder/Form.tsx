import { MENU } from "@constants/menu-titles.constant";
import {
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerFooter,
  Input,
} from "@gems/components";
import { TextEditor } from "@gems/editor";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface IForm {
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
}: IForm) => {
  const formProps = useForm();
  const {
    handleSubmit,
    reset,
    control,
    register,
    formState: { errors },
  } = formProps;

  useEffect(() => {
    if (Object.keys(updateData).length > 0) {
      reset({
        ...updateData,
      });
    } else {
      reset({ isActive: true });
    }
  }, [updateData, reset]);

  return (
    <Drawer
      title={
        MENU.BN.LETTER_BUILDER +
        (Object.keys(updateData)?.length > 0 ? " হালনাগাদ" : " সংরক্ষণ") +
        " করুন"
      }
      isOpen={isOpen}
      handleClose={onClose}
      className="w-md-75 w-xl-75"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DrawerBody>
          <div className="row">
            <div className="col-md-6 col-xl-4">
              <Input
                label="শিরোনাম"
                placeholder="শিরোনাম লিখুন"
                registerProperty={{
                  ...register("title", {
                    required: "শিরোনাম লিখুন",
                  }),
                }}
                isRequired
                isError={!!errors?.title}
                errorMessage={errors?.title?.message as string}
              />
            </div>
            <TextEditor
              name="letterDoc"
              label="টেমপ্লেট"
              // minHeight={400}
              placeholder={`টেমপ্লেট লিখুন...`}
              isRequired="টেমপ্লেট লিখুন"
              control={control}
              isError={!!errors?.letterDoc}
              errorMessage={errors?.letterDoc?.message as string}
            />
            <Checkbox
              label="সক্রিয়"
              registerProperty={{
                ...register("isActive"),
              }}
            />
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
