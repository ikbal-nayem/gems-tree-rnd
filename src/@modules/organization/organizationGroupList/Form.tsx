import { MENU } from "@constants/menu-titles.constant";
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

interface IForm {
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

const Form = ({
  isOpen,
  onClose,
  onSubmit,
  updateData,
  submitLoading,
}: IForm) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const [orgTypeList, setOrgTypeList] = useState<IObject[]>([]);
  const [orgGroupParentList, setOrgGroupParentList] = useState<IObject[]>([]);

  useEffect(() => {
    OMSService.FETCH.organizationTypeList()
      .then((res) => {
        setOrgTypeList(res?.body || []);
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
      reset({ isActive: true });
    }
  }, [updateData, reset]);

  return (
    <Drawer
      title={
        MENU.BN.ORGANIZATION_GROUP +
        (Object.keys(updateData)?.length > 0 ? " হালনাগাদ" : " সংরক্ষণ") +
        " করুন"
      }
      isOpen={isOpen}
      handleClose={onClose}
      className="w-md-50 w-xl-25"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DrawerBody>
          <div className="row">
            <div className="col-12">
              <Autocomplete
                label="প্রতিষ্ঠানের ধরণ"
                placeholder="বাছাই করুন"
                isRequired="প্রতিষ্ঠানের ধরণ বাছাই করুন"
                options={orgTypeList || []}
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
export default Form;
