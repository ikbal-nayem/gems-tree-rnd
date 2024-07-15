import {
  Autocomplete,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerFooter,
  Input,
  Select,
} from "@gems/components";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IOptions } from "./lib";

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
    control,
    setValue,
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
                    required: watch("isEnamCommittee")
                      ? false
                      : "নাম (বাংলা) লিখুন",
                  }),
                }}
                isRequired={!watch("isEnamCommittee")}
                isError={!!errors?.nameBn}
                errorMessage={errors?.nameBn?.message as string}
              />
            </div>
            <div className="col-12">
              <Select
                label="গ্রেড"
                placeholder="গ্রেড বাছাই করুন"
                options={options?.gradeList || []}
                textKey="nameBn"
                valueKey="id"
                registerProperty={{
                  ...register("gradeId"),
                }}
                isError={!!errors?.gradeId}
                errorMessage={errors?.gradeId?.message as string}
              />
            </div>

            <div className="col-12">
              <Autocomplete
                label="সার্ভিস/ক্যাডারের ধরণ"
                placeholder="সার্ভিস/ক্যাডারের ধরণ বাছাই করুন"
                name="serviceType"
                options={options?.serviceList || []}
                getOptionLabel={(t) => t.titleBn}
                getOptionValue={(op) => op?.metaKey}
                control={control}
                onChange={(t) => setValue("serviceTypeKey", t?.metaKey)}
              />
            </div>

            {watch("serviceType")?.metaKey === "SERVICE_TYPE_CADRE" ? (
              <div className="col-12">
                <Autocomplete
                  label="সার্ভিস/ক্যাডারের নাম"
                  name="cadre"
                  placeholder="সার্ভিস/ক্যাডারের নাম বাছাই করুন"
                  isRequired="সার্ভিস/ক্যাডারের নাম বাছাই করুন"
                  options={options?.cadreList || []}
                  getOptionLabel={(t) => t.titleBn}
                  getOptionValue={(op) => op?.metaKey}
                  onChange={(t) => setValue("cadreKey", t?.metaKey)}
                  control={control}
                  isError={!!errors?.cadre}
                  errorMessage={errors?.cadre?.message as string}
                />
              </div>
            ) : null}

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
              <Input
                type="number"
                label="প্রদর্শন ক্রম"
                placeholder="প্রদর্শন ক্রম লিখুন"
                registerProperty={{
                  ...register("serial"),
                }}
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
