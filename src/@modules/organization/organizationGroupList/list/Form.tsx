import { MENU } from "@constants/menu-titles.constant";
import {
  Autocomplete,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerFooter,
  Input,
  RadioButton,
  toast,
} from "@gems/components";
import { IObject, notNullOrUndefined } from "@gems/utils";
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
  const [orgGroupParentList, setOrgGroupParentList] = useState<IObject[]>([]);
  const [parentOrgList, setParentOrgList] = useState<IObject[]>([]);

  useEffect(() => {
    OMSService.FETCH.organizationTypeList()
      .then((res) => {
        setOrgTypeList(res?.body || []);
      })
      .catch((err) => toast.error(err?.message));

    getParentOrgList();
    getAllGroupParentList();
  }, []);

  const getAllGroupParentList = () => {
    OMSService.FETCH.organizationGroupList()
      .then((res) => setOrgGroupParentList(res?.body || []))
      .catch((err) => toast.error(err?.message));
  };

  const getParentOrgList = () => {
    OMSService.FETCH.ministryDivisionDepartmentList()
      .then((resp) => setParentOrgList(resp?.body))
      .catch((err) => toast.error(err?.message));
  };

  useEffect(() => {
    if (Object.keys(updateData).length > 0) {
      reset({
        ...updateData,
        parentType: notNullOrUndefined(updateData?.parentGroupId)
          ? "parent_group"
          : "parent_organization",
      });
    } else {
      reset({ isActive: true, parentType: "parent_group" });
    }
  }, [updateData, reset]);

  let parentType = watch("parentType");
  let parent = watch("parent");

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
                label="প্রতিষ্ঠানের ধরন"
                placeholder="বাছাই করুন"
                isRequired="প্রতিষ্ঠানের ধরন বাছাই করুন"
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
            </div>
            {!(parent?.orgTypeLevel === 1 || parent?.orgTypeLevel === 2) && (
              <>
                <div className="col-12 d-flex justify-content gap-8 mb-2">
                  <RadioButton
                    label="গ্রুপ অভিভাবক"
                    value="parent_group"
                    noMargin
                    registerProperty={{
                      ...register("parentType"),
                    }}
                  />
                  <RadioButton
                    label="অভিভাবক প্রতিষ্ঠান"
                    value="parent_organization"
                    noMargin
                    registerProperty={{
                      ...register("parentType"),
                    }}
                  />
                </div>
                <div className="col-12">
                  {parentType === "parent_group" && (
                    <Autocomplete
                      placeholder="গ্রুপ অভিভাবক বাছাই করুন"
                      options={orgGroupParentList || []}
                      name="parentGroup"
                      getOptionLabel={(op) => op.nameBn}
                      getOptionValue={(op) => op.id}
                      onChange={(op) => {
                        setValue("parentGroupId", op?.id ? op?.id : null);
                        setValue("parentOrganizationId", null);
                        setValue("parentOrganization", null);
                      }}
                      control={control}
                    />
                  )}
                  {parentType === "parent_organization" && (
                    <Autocomplete
                      placeholder="অভিভাবক প্রতিষ্ঠান বাছাই করুন"
                      options={parentOrgList || []}
                      name="parentOrganization"
                      getOptionLabel={(op) => op.nameBn}
                      getOptionValue={(op) => op.id}
                      onChange={(op) => {
                        setValue(
                          "parentOrganizationId",
                          op?.id ? op?.id : null
                        );
                        setValue("parentGroup", null);
                        setValue("parentGroupId", null);
                      }}
                      control={control}
                    />
                  )}
                </div>
              </>
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
