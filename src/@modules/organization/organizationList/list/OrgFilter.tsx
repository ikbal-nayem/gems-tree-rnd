import {
  Autocomplete,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerHeader,
  FilterFooter,
  IconButton,
  toast,
} from "@gems/components";
import { IObject, isObjectNull, makeFormData } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useState } from "react";
import { useForm } from "react-hook-form";
import LocationWorkSpaceComponent from "./LocationWorkSpaceComponent";

const OrgFilter = ({ onFilterDone, options }) => {
  const formProps = useForm();
  const [open, setOpen] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    register,
    formState: { errors },
  } = formProps;
  const [orgGroupList, setOrgGroupList] = useState<IObject[]>([]);
  const [orgParentList, setOrgParentList] = useState<IObject[]>([]);

  const onOrganizationTypeChange = (typeItem: IObject) => {
    if (!isObjectNull(typeItem)) {
      OMSService.FETCH.organizationGroupbyOrgType(typeItem?.id)
        .then((res) => {
          setOrgGroupList(res?.body || []);
        })
        .catch((err) => toast.error(err?.message));

      OMSService.FETCH.organizationParentListByOrgType(makeFormData(typeItem))
        .then((res) => {
          setOrgParentList(res?.body || []);
        })
        .catch((err) => toast.error(err?.message));
    }
  };

  const onOrganizationGroupChange = (groupItem: IObject) => {
    if (!isObjectNull(groupItem)) {
      setValue("organizationCategoryId", groupItem?.id);
      if (groupItem?.nameEn === "Ministry" || groupItem?.nameEn === "Division")
        OMSService.FETCH.organizationParentListByOrgGroup(groupItem?.nameEn)
          .then((res) => {
            setOrgParentList(res?.body || []);
          })
          .catch((err) => toast.error(err?.message));
    }
  };

  const onClose = () => setOpen(false);

  const onFilter = (data: IObject) => {
    onFilterDone(data);
    reset();
    onClose();
  };

  return (
    <>
      <IconButton
        iconName="filter_alt"
        rounded={false}
        iconSize={15}
        color="primary"
        onClick={() => setOpen(true)}
      />
      <Drawer isOpen={open} closeOnBackdropClick handleClose={onClose}>
        <DrawerHeader title="ফিল্টার" closeIconAction={onClose} />
        <form onSubmit={handleSubmit(onFilter)}>
          <DrawerBody>
            <Autocomplete
              label="প্রতিষ্ঠানের ধরণ"
              placeholder="প্রতিষ্ঠানের ধরণ বাছাই করুন"
              options={options?.institutionTypes || []}
              name="office"
              getOptionLabel={(op) => op.titleBn}
              getOptionValue={(op) => op.metaKey}
              onChange={(op) => setValue("officeType", op?.metaKey)}
              control={control}
            />
            <Autocomplete
              label="সংস্থার ধরণ"
              placeholder="সংস্থার ধরণ বাছাই করুন"
              options={options?.organizationTypes || []}
              name="organizationTypeDTO"
              getOptionLabel={(op) => op.nameBn}
              getOptionValue={(op) => op.id}
              onChange={(op) => onOrganizationTypeChange(op)}
              control={control}
            />
            {!isObjectNull(watch("organizationTypeDTO")) && (
              <>
                <Autocomplete
                  label="সংস্থার গ্রুপ"
                  placeholder="সংস্থার গ্রুপ বাছাই করুন"
                  isRequired="সংস্থার ধরণ বাছাই করুন"
                  options={orgGroupList || []}
                  name="organizationGroupDTO"
                  getOptionLabel={(op) => op.nameBn}
                  getOptionValue={(op) => op.id}
                  onChange={(op) => onOrganizationGroupChange(op)}
                  control={control}
                  isError={!!errors?.organizationGroupDTO}
                  errorMessage={errors?.organizationGroupDTO?.message as string}
                />
                <Autocomplete
                  label="অভিভাবক প্রতিষ্ঠানের নাম"
                  placeholder="অভিভাবক প্রতিষ্ঠানের নাম বাছাই করুন"
                  options={orgParentList || []}
                  name="parent"
                  getOptionLabel={(op) => op.nameBn}
                  getOptionValue={(op) => op.id}
                  onChange={(op) => setValue("parentId", op?.id)}
                  control={control}
                />
              </>
            )}
            {/* <div className="col-12">
              <WorkSpaceComponent {...formProps} />
            </div> */}
            <div className="col-12">
              <Autocomplete
                label="মন্ত্রণালয়"
                placeholder="মন্ত্রণালয় বাছাই করুন"
                options={options?.ministryList || []}
                name="rootParent"
                getOptionLabel={(op) => op.nameBn}
                getOptionValue={(op) => op.id}
                onChange={(op) => setValue("rootParentId", op?.id)}
                control={control}
              />
            </div>
            <div className="col-12">
              <LocationWorkSpaceComponent {...formProps} />
            </div>
            <div className="col-12 col-md-6">
              <Checkbox
                label="প্রশিক্ষণ প্রতিষ্ঠান"
                registerProperty={{
                  ...register("isTrainingOffice", {
                    onChange: (e) =>
                      setValue(
                        "trainingOfficeTag",
                        e.target.checked ? "TRAINING" : null
                      ),
                  }),
                }}
              />
            </div>
          </DrawerBody>
          <FilterFooter onClose={onClose} />
        </form>
      </Drawer>
    </>
  );
};

export default OrgFilter;
