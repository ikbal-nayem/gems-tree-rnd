import {
  Autocomplete,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerFooter,
  Input,
  Select,
  toast,
} from "@gems/components";
import { COMMON_INSTRUCTION, IObject, numBnToEn } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IGradeForm {
  isOpen?: boolean;
  onSubmit: (data) => void;
  onClose: () => void;
  updateData?: any;
  submitLoading?: boolean;
}

const organizationTypeStaticList = [
  {
    titleEn: "Type",
    key: "ORG_CATEGORY_TYPE",
    titleBn: "ধরণ",
  },
  {
    titleEn: "Group",
    key: "ORG_CATEGORY_GROUP",
    titleBn: "গ্রুপ",
  },
];

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
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const [orgParentTypeList, setOrgParentTypeList] = useState<IObject[]>([]);
  const [orgGroupParentList, setOrgGroupParentList] = useState<IObject[]>([]);

  useEffect(() => {
    OMSService.FETCH.organizationTypeList()
      .then((res) => {
        setOrgParentTypeList(res?.body || []);
      })
      .catch((err) => toast.error(err?.message));

    getAllGroupParentList();
  }, []);

  const getAllGroupParentList = () => {
    OMSService.FETCH.organizationGroupList()
      .then((res) => {
        setOrgGroupParentList(res?.body || []);
      })
      .catch((err) => toast.error(err?.message));
  };

  useEffect(() => {
    if (Object.keys(updateData).length > 0) {
      reset({
        ...updateData,
        type: updateData?.metaTypeEn,
      });
    } else {
      reset({ isActive: true, orgCategoryType: "ORG_CATEGORY_GROUP" });
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
            <Select
              label={"ধরণ/গ্রুপ ?"}
              options={organizationTypeStaticList || []}
              placeholder={"বাছাই করুন"}
              isRequired
              textKey={"titleBn"}
              // defaultValue={"ORG_CATEGORY_GROUP"}
              valueKey="key"
              registerProperty={{
                ...register(`orgCategoryType`, {
                  required: true,
                }),
              }}
              isDisabled={updateData?.orgCategoryType}
              isError={!!errors?.orgCategoryType}
              errorMessage={errors?.orgCategoryType?.message as string}
            />
            {watch("orgCategoryType") === "ORG_CATEGORY_GROUP" && (
              <div className="col-12">
                <Autocomplete
                  label="প্রতিষ্ঠানের ধরণ"
                  placeholder="বাছাই করুন"
                  isRequired="প্রতিষ্ঠানের ধরণ বাছাই করুন"
                  options={orgParentTypeList || []}
                  name="parent"
                  getOptionLabel={(op) => op.nameBn}
                  getOptionValue={(op) => op.id}
                  onChange={(op) => setValue("parentId", op?.id)}
                  isDisabled={updateData?.parentDTO}
                  control={control}
                  isError={!!errors?.parentDTO}
                  errorMessage={errors?.parentDTO?.message as string}
                />
                <Autocomplete
                  label="প্রতিষ্ঠানের গ্রুপ অভিভাবক"
                  placeholder="বাছাই করুন"
                  options={orgGroupParentList || []}
                  name="parentGroup"
                  getOptionLabel={(op) => op.nameBn}
                  getOptionValue={(op) => op.id}
                  onChange={(op) => setValue("parentGroupId", op?.id)}
                  control={control}
                />
              </div>
            )}
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
            {/* <div className="col-12">
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
            </div> */}

            {watch("orgCategoryType") === "ORG_CATEGORY_TYPE" && (
              <div className="col-12">
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
              </div>
            )}
            <div className="col-12">
              <Input
                label="প্রদর্শন ক্রম"
                type="number"
                placeholder="প্রদর্শন ক্রম লিখুন"
                min={1}
                registerProperty={{
                  ...register("serialNo"),
                }}
              />
            </div>
            {/* <div className="col-12">
              <Input
                label="কোড"
                placeholder="কোড লিখুন"
                registerProperty={{
                  ...register("orgCode"),
                }}
              />
            </div> */}
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
