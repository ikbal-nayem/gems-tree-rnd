import {
  Autocomplete,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerHeader,
  FilterFooter,
  IconButton,
} from "@gems/components";
import { IObject } from "@gems/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import LocationWorkSpaceComponent from "./LocationWorkSpaceComponent";
import WorkSpaceComponent from "./WorkSpaceComponent";

const OrgFilter = ({ onFilterDone, options }) => {
  const formProps = useForm();
  const [open, setOpen] = useState<boolean>(false);
  const { control, handleSubmit, setValue, register } = formProps;

  const onClose = () => setOpen(false);

  const onFilter = (data: IObject) => {
    onFilterDone(data);
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
              name="org"
              getOptionLabel={(op) => op.titleBn}
              getOptionValue={(op) => op.metaKey}
              onChange={(op) => setValue("orgType", op?.metaKey)}
              control={control}
            />
            <div className="col-12">
              <WorkSpaceComponent {...formProps} />
            </div>
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
