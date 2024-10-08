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
import { IObject, isObjectNull } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useState } from "react";
import { useForm } from "react-hook-form";
import LocationWorkSpaceComponent from "./LocationWorkSpaceComponent";
import WorkSpaceComponent from "./WorkSpaceComponent";

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

  const onOrganizationTypeChange = (typeItem: IObject) => {
    setValue("organizationTypeId", typeItem?.id);
    setValue("organizationGroupDTO", null);
    setValue("orgCategoryGroupId", null);
    setOrgGroupList([]);
    if (!isObjectNull(typeItem)) {
      OMSService.FETCH.organizationGroupbyOrgType(typeItem?.id)
        .then((res) => {
          setOrgGroupList(res?.body || []);
        })
        .catch((err) => toast.error(err?.message));
    }
  };
  const onClose = () => setOpen(false);

  const onFilter = (data: IObject) => {
    delete data.organizationTypeDTO;
    delete data.organizationGroupDTO;
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
              label="প্রতিষ্ঠানের পর্যায়"
              placeholder="প্রতিষ্ঠানের পর্যায় বাছাই করুন"
              options={options?.institutionTypes || []}
              name="office"
              getOptionLabel={(op) => op.titleBn}
              getOptionValue={(op) => op.metaKey}
              onChange={(op) => setValue("officeType", op?.metaKey)}
              control={control}
            />
            <Autocomplete
              label="প্রতিষ্ঠানের ধরন"
              placeholder="প্রতিষ্ঠানের ধরন বাছাই করুন"
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
                  label="প্রতিষ্ঠানের গ্রুপ"
                  placeholder="প্রতিষ্ঠানের গ্রুপ বাছাই করুন"
                  // isRequired="প্রতিষ্ঠানের ধরন বাছাই করুন"
                  options={orgGroupList || []}
                  name="organizationGroupDTO"
                  getOptionLabel={(op) => op.nameBn}
                  getOptionValue={(op) => op.id}
                  onChange={(op) => setValue("orgCategoryGroupId", op?.id)}
                  control={control}
                  isError={!!errors?.organizationGroupDTO}
                  errorMessage={errors?.organizationGroupDTO?.message as string}
                />
              </>
            )}
            <div className="col-12">
              <WorkSpaceComponent {...formProps} />
            </div>

            {/* <div className="col-12">
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
            </div> */}
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
