import {
    Button,
    Checkbox,
    Drawer,
    DrawerBody,
    DrawerFooter,
    Input,
  } from "@gems/components";
import { IOptions } from "@modules/post/lib";
  import { useEffect } from "react";
  import { useForm } from "react-hook-form";
  
  interface IPostForm {
    isOpen?: boolean;
    options: IOptions;
    onSubmit: (data) => void;
    onClose: () => void;
    updateData?: any;
    submitLoading?: boolean;
  }
  
  const Form = ({
    isOpen,
    onClose,
    onSubmit,
    options,
    updateData,
    submitLoading,
  }: IPostForm) => {
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
      watch,
    } = useForm();
  
    useEffect(() => {
      if (Object.keys(updateData).length > 0) {
        reset({
          ...updateData,
          type: updateData?.metaTypeEn,
        });
      } else {
        reset({ isActive: true, isEnamCommittee: false });
      }
    }, [updateData, reset]);
  
    return (
      <Drawer
        title={`পদবি ${
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
                    ...register("nameEn", {
                      required: "নাম (ইংরেজি) লিখুন",
                    }),
                  }}
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
                      required: watch("isEnamCommittee")
                        ? false
                        : "নাম (বাংলা) লিখুন",
                    }),
                  }}
                  isError={!!errors?.nameBn}
                  errorMessage={errors?.nameBn?.message as string}
                />
              </div>
              
              <div className="col-12">
                <Checkbox
                  label="এনাম কমিটি"
                  registerProperty={{
                    ...register("isEnamCommittee"),
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
