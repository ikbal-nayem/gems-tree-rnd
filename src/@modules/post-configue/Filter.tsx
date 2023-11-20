import {
  Autocomplete,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerHeader,
  FilterFooter,
  IconButton,
  Label,
  RadioButton,
} from "@gems/components";
import { IObject, makeBoolean } from "@gems/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";

const RankMinistryFilter = ({ onFilterDone, options }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { register, control, handleSubmit, setValue, watch } = useForm<any>({
    defaultValues: {
      isEntryRank: "null",
      isActive: true,
    },
  });

  const onClose = () => setOpen(false);

  const onFilter = (data: IObject) => {
    onFilterDone(makeBoolean(data));
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
            <div className="row">
              <div className="col-12">
                <Autocomplete
                  label="মন্ত্রণালয়"
                  name="ministry"
                  placeholder="মন্ত্রণালয় বাছাই করুন"
                  options={options?.ministryList || []}
                  getOptionLabel={(t) => t.nameBn}
                  getOptionValue={(op) => op?.id}
                  onChange={(t) => setValue("ministryId", t?.id)}
                  control={control}
                />
              </div>
              <div className="col-12">
                <Autocomplete
                  label="পদ"
                  name="rank"
                  placeholder="পদ বাছাই করুন"
                  options={options?.rankList || []}
                  getOptionLabel={(t) => t.titleBn}
                  getOptionValue={(op) => op?.id}
                  onChange={(t) => setValue("rankId", t?.id)}
                  control={control}
                />
              </div>
              <div className="col-12">
                <Autocomplete
                  label="সার্ভিস/ক্যাডারের ধরণ"
                  name="serviceType"
                  placeholder="সার্ভিস/ক্যাডারের ধরণ বাছাই করুন"
                  options={options?.serviceList || []}
                  getOptionLabel={(t) => t.titleBn}
                  getOptionValue={(op) => op?.metaKey}
                  onChange={(t) => setValue("serviceTypeKey", t?.metaKey)}
                  control={control}
                />
              </div>
              {watch("serviceType")?.metaKey === "SERVICE_TYPE_CADRE" ? (
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
              ) : null}
              <div className="col-12">
                <Autocomplete
                  label="গ্রেড"
                  name="grade"
                  placeholder="গ্রেড বাছাই করুন"
                  options={options?.gradeList || []}
                  getOptionLabel={(t) => t.nameBn}
                  getOptionValue={(op) => op?.id}
                  onChange={(t) => setValue("gradeId", t?.id)}
                  control={control}
                />
              </div>

              <div className="col-12">
                <Label>প্রারম্ভিক পদ</Label>
                <div className="col-sm-12 d-flex gap-5">
                  <RadioButton
                    label="সকল"
                    value="null"
                    registerProperty={{ ...register("isEntryRank") }}
                  />
                  <RadioButton
                    label="প্রারম্ভিক"
                    value="true"
                    registerProperty={{ ...register("isEntryRank") }}
                  />
                  <RadioButton
                    label="প্রারম্ভিক নয়"
                    value="false"
                    registerProperty={{ ...register("isEntryRank") }}
                  />
                </div>
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

          <FilterFooter onClose={onClose} />
        </form>
      </Drawer>
    </>
  );
};

export default RankMinistryFilter;
