import {
  Autocomplete,
  Drawer,
  DrawerBody,
  DrawerHeader,
  FilterFooter,
  IconButton,
} from "@gems/components";
import { IObject } from "@gems/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import WorkSpaceComponent from "./WorkSpaceComponent";

const Filter = ({ onFilterDone, options }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { control, handleSubmit, setValue, reset } = useForm<any>();
  const formProps = useForm();
  const onClose = () => {
    reset({});
    setOpen(false);
  };

  const onFilter = (data: IObject) => {
    onFilterDone(data);
    setOpen(false);
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
            <div className="row">
              <div className="col-12">
                {/* <Autocomplete
                  label="প্রতিষ্ঠান"
                  name="organization"
                  placeholder="প্রতিষ্ঠান বাছাই করুন"
                  options={options?.orgList || []}
                  getOptionLabel={(t) => t.nameBn}
                  getOptionValue={(op) => op?.id}
                  onChange={(t) => setValue("organizationId", t?.id)}
                  control={control}
                /> */}
                <WorkSpaceComponent
                {...formProps}
              />
              </div>
              <div className="col-12">
                <Autocomplete
                  label="পদবি"
                  name="postDTO"
                  placeholder="পদবি বাছাই করুন"
                  options={options?.postList || []}
                  getOptionLabel={(t) => t.nameBn}
                  getOptionValue={(op) => op?.id}
                  onChange={(t) => setValue("postId", t?.id)}
                  control={control}
                />
              </div>
              <div className="col-12">
                <Autocomplete
                  label="সার্ভিস/ক্যাডারের ধরণ"
                  name="serviceTypeDto"
                  placeholder="সার্ভিস/ক্যাডারের ধরণ বাছাই করুন"
                  options={options?.serviceList || []}
                  getOptionLabel={(t) => t.titleBn}
                  getOptionValue={(op) => op?.metaKey}
                  onChange={(t) => setValue("serviceTypeKey", t?.metaKey)}
                  control={control}
                />
              </div>
              {/* {watch("serviceType")?.metaKey === "SERVICE_TYPE_CADRE" ? (
                <div className="col-12">
                  <Autocomplete
                    label="সার্ভিস/ক্যাডারের নাম"
                    name="cadre"
                    placeholder="সার্ভিস/ক্যাডারের নাম বাছাই করুন"
                    options={options?.cadreList || []}
                    getOptionLabel={(t) => t.titleBn}
                    getOptionValue={(op) => op?.metaKey}
                    onChange={(t) => setValue("cadreKey", t?.metaKey)}
                    control={control}
                  />
                </div>
              ) : null} */}
              <div className="col-12">
                <Autocomplete
                  label="গ্রেড"
                  name="gradeDTO"
                  placeholder="গ্রেড বাছাই করুন"
                  options={options?.gradeList || []}
                  getOptionLabel={(t) => t.nameBn}
                  getOptionValue={(op) => op?.id}
                  onChange={(t) => setValue("gradeId", t?.id)}
                  control={control}
                />
              </div>
              <div className="col-12">
                <Autocomplete
                  label="অর্গানোগ্রাম ভার্সন"
                  name="organogramVersionDto"
                  placeholder="অর্গানোগ্রাম ভার্সন বাছাই করুন"
                  options={options?.organogramVersionList || []}
                  getOptionLabel={(t) => t.titleBn}
                  getOptionValue={(op) => op?.metaKey}
                  onChange={(t) => setValue("organogramVersionKey", t?.metaKey)}
                  control={control}
                />
              </div>
            </div>
          </DrawerBody>

          <FilterFooter onClose={onClose} />
        </form>
      </Drawer>
    </>
  );
};

export default Filter;
