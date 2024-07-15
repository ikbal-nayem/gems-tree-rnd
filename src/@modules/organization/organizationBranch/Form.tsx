import { META_TYPE } from "@constants/common.constant";
import { MENU } from "@constants/menu-titles.constant";
import {
  Autocomplete,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerFooter,
  toast,
} from "@gems/components";
import { IObject } from "@gems/utils";
import { CoreService } from "@services/api/Core.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { searchOrgList } from "./_helper";

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
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = formProps;

  const [orgTypeList, setOrgTypeList] = useState<IObject[]>([]);
  const [optionList, setOptionList] = useState<IObject[]>([]);
  useEffect(() => {
    getOptionList();
  }, []);

  const getOptionList = () => {
    CoreService.getByMetaTypeList(`${META_TYPE.ORG_BRANCH}`)
      .then((resp) => setOptionList(resp?.body))
      .catch((err) => toast.error(err?.message));
  };

  useEffect(() => {
    if (Object.keys(updateData).length > 0) {
      reset({
        ...updateData,
        organization: {
          id: updateData?.organizationId,
          nameBn: updateData?.organizationNameBn,
          nameEn: updateData?.organizationNameEn,
        },
        orgBranchKeyName: optionList?.find(
          (op) => op.metaKey === updateData?.orgBranchKey
        ),
        isActive: updateData?.isActive,
      });
    } else {
      reset({ isActive: true });
    }
  }, [updateData, reset]);

  return (
    <Drawer
      title={
        MENU.BN.ORGANIZATION_BRANCH +
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
                label="প্রতিষ্ঠান"
                placeholder="বাছাই করুন"
                loadOptions={searchOrgList}
                getOptionLabel={(op) => op.nameBn}
                getOptionValue={(op) => op?.id}
                onChange={(op) => setValue("organizationId", op?.id)}
                name="organization"
                control={control}
                isAsync
                isSearchable
                isRequired="প্রতিষ্ঠান বাছাই করুন"
              />
            </div>

            <div className="col-12">
              <Autocomplete
                label="প্রতিষ্ঠানের ধরন"
                placeholder="বাছাই করুন"
                isRequired="প্রতিষ্ঠানের ধরন বাছাই করুন"
                options={optionList || []}
                name="orgBranchKeyName"
                getOptionLabel={(op) => op.titleBn}
                getOptionValue={(op) => op.id}
                onChange={(op) => setValue("orgBranchKey", op?.metaKey)}
                control={control}
                isError={!!errors?.orgBranchKey}
                errorMessage={errors?.orgBranchKey?.message as string}
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
