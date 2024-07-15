import {
  Autocomplete,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerFooter,
  Input,
  Textarea,
  toast,
} from "@gems/components";
import { COMMON_LABELS, IObject, isObjectNull } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import LocationWorkSpaceComponent from "./LocationWorkSpaceComponent";

interface IOrgForm {
  isOpen?: boolean;
  onSubmit: (data) => void;
  onClose: () => void;
  updateData?: any;
  submitLoading?: boolean;
  options?: IObject;
}

const OrgForm = ({
  isOpen,
  onClose,
  onSubmit,
  updateData,
  submitLoading,
  options,
}: IOrgForm) => {
  const formProps = useForm();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    control,
    setValue,
  } = formProps;

  const [orgGroupList, setOrgGroupList] = useState<IObject[]>([]);
  const [orgParentList, setOrgParentList] = useState<IObject[]>([]);
  const orgTypeGovtObject = options?.institutionTypes?.find(
    (d) => d?.metaKey === "INSTITUTION_TYPE_GOVERNMENT"
  );
  const payload = {
    meta: {
      page: 0,
      limit: 1000,
      sort: [{ order: "asc", field: "serialNo" }],
    },
    body: { searchKey: "" },
  };
  const orgPayload = useRef(payload);

  useEffect(() => {
    if (!isObjectNull(updateData)) {
      if (!isObjectNull(updateData?.organizationTypeDTO)) {
        onOrganizationTypeChange(updateData?.organizationTypeDTO, true);
      }
      reset({
        ...updateData,
        isTrainingOffice: updateData?.trainingOfficeTag === "TRAINING",
      });
    } else {
      reset({
        isActive: true,
        isTrainingOffice: false,
        isEnamCommittee: false,
        officeTypeDTO: orgTypeGovtObject,
        officeType: orgTypeGovtObject?.metaKey,
      });
    }
  }, [updateData, orgTypeGovtObject]);

  const onOrganizationTypeChange = (typeItem: IObject, updateValue = false) => {
    setValue("organizationGroupDTO", null);
    setValue("organizationCategoryId", null);
    setOrgGroupList([]);
    setValue("parent", null);
    setValue("parentId", null);
    setOrgParentList([]);

    if (!isObjectNull(typeItem)) {
      OMSService.FETCH.organizationGroupbyOrgType(typeItem?.id)
        .then((res) => {
          setOrgGroupList(res?.body || []);
        })
        .catch((err) => toast.error(err?.message));

      if (updateValue && !isObjectNull(updateData?.organizationGroupDTO)) {
        onOrganizationGroupChange(updateData?.organizationGroupDTO);
      }
      // Org Parent list api called only for group change by apv
      //  else {
      //   OMSService.FETCH.organizationParentListByOrgType(makeFormData(typeItem))
      //     .then((res) => {
      //       setOrgParentList(res?.body || []);
      //     })
      //     .catch((err) => toast.error(err?.message));
      // }
    }
  };

  const onOrganizationGroupChange = (groupItem: IObject) => {
    if (!isObjectNull(groupItem)) {
      setValue("organizationCategoryId", groupItem?.id);
      // if (
      //   groupItem?.nameEn === "Ministry" ||
      //   groupItem?.nameEn === "Division"
      // ) {
      setValue("parent", null);
      setValue("parentId", null);
      setOrgParentList([]);
      OMSService.FETCH.organizationParentListByOrgGroup(groupItem?.nameEn)
        .then((res) => {
          setOrgParentList(res?.body || []);
        })
        .catch((err) => toast.error(err?.message));
      // }
    } else {
      onOrganizationTypeChange(watch("organizationTypeDTO"));
    }
  };

  const getAsyncPreviousOranizationList = useCallback((searchKey, callback) => {
    orgPayload.current.body = {
      ...orgPayload.current.body,
      searchKey: searchKey ? searchKey?.trim() : "",
    };
    OMSService.getPreviousOrganizationList(orgPayload?.current).then((resp) =>
      callback(resp?.body || [])
    );
  }, []);

  return (
    <Drawer
      title={`প্রতিষ্ঠানের নাম ${
        !isObjectNull(updateData) ? "হালনাগাদ" : "সংরক্ষণ"
      } করুন`}
      isOpen={isOpen}
      handleClose={onClose}
      className="w-md-50 w-xl-25"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DrawerBody>
          <div className="row">
            <div className="col-12">
              <Autocomplete
                label="প্রতিষ্ঠানের পর্যায়"
                placeholder="প্রতিষ্ঠানের পর্যায় বাছাই করুন"
                isRequired="প্রতিষ্ঠানের পর্যায় বাছাই করুন"
                options={options?.institutionTypes || []}
                name="officeTypeDTO"
                getOptionLabel={(op) => op.titleBn}
                getOptionValue={(op) => op.metaKey}
                onChange={(op) => setValue("officeType", op?.metaKey)}
                control={control}
                isError={!!errors?.officeTypeDTO}
                errorMessage={errors?.officeTypeDTO?.message as string}
              />
            </div>
            <div className="col-12">
              <Autocomplete
                label="প্রতিষ্ঠানের ধরন"
                placeholder="প্রতিষ্ঠানের ধরন বাছাই করুন"
                isRequired="প্রতিষ্ঠানের ধরন বাছাই করুন"
                options={options?.organizationTypes || []}
                name="organizationTypeDTO"
                getOptionLabel={(op) => op.nameBn}
                getOptionValue={(op) => op.id}
                onChange={(op) => onOrganizationTypeChange(op)}
                control={control}
                isError={!!errors?.organizationTypeDTO}
                errorMessage={errors?.organizationTypeDTO?.message as string}
              />
            </div>
            {!isObjectNull(watch("organizationTypeDTO")) && (
              <>
                <div className="col-12">
                  <Autocomplete
                    label="প্রতিষ্ঠানের গ্রুপ"
                    placeholder="প্রতিষ্ঠানের গ্রুপ বাছাই করুন"
                    isRequired="প্রতিষ্ঠানের গ্রুপ বাছাই করুন"
                    options={orgGroupList || []}
                    name="organizationGroupDTO"
                    getOptionLabel={(op) => op.nameBn}
                    getOptionValue={(op) => op.id}
                    onChange={(op) => onOrganizationGroupChange(op)}
                    control={control}
                    isError={!!errors?.organizationGroupDTO}
                    errorMessage={
                      errors?.organizationGroupDTO?.message as string
                    }
                  />
                </div>
                <div className="col-12">
                  <Autocomplete
                    label="প্রতিষ্ঠানের অভিভাবক"
                    placeholder="প্রতিষ্ঠানের অভিভাবক বাছাই করুন"
                    // isRequired="প্রতিষ্ঠানের অভিভাবক বাছাই করুন"
                    options={orgParentList || []}
                    name="parent"
                    getOptionLabel={(op) => op.nameBn}
                    getOptionValue={(op) => op.id}
                    onChange={(op) =>
                      setValue("parentId", op?.id ? op?.id : null)
                    }
                    control={control}
                    helpText={
                      !watch("organizationGroupDTO") &&
                      "* প্রতিষ্ঠানের অভিভাবক দেওয়ার জন্য প্রতিষ্ঠানের গ্রুপ বাছাই করুন"
                    }
                    // isError={!!errors?.parent}
                    // errorMessage={errors?.parent?.message as string}
                  />
                </div>
              </>
            )}
            {/* <div className="col-12">
              <WorkSpaceComponent {...formProps} />
            </div> */}

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
              <Autocomplete
                label="মন্ত্রণালয়/বিভাগ"
                placeholder="মন্ত্রণালয়/বিভাগ বাছাই করুন"
                options={options?.ministryList || []}
                name="rootParent"
                getOptionLabel={(op) => op.nameBn}
                getOptionValue={(op) => op.id}
                onChange={(op) => setValue("rootParentId", op?.id)}
                control={control}
                isError={!!errors?.rootParent}
                errorMessage={errors?.rootParent?.message as string}
              />
            </div> */}

            <div className="col-12">
              <LocationWorkSpaceComponent
                isRequired="স্থান বাছাই করুন"
                {...formProps}
              />
            </div>

            <Autocomplete
              label="পূর্ববর্তী প্রতিষ্ঠান"
              placeholder="পূর্ববর্তী প্রতিষ্ঠান বাছাই করুন"
              isAsync
              isMulti
              control={control}
              // noMargin
              getOptionLabel={(op) => op.nameBn}
              getOptionValue={(op) => op?.id}
              name="prevOrganizationList"
              // onChange={(e) => setValue("prevOrganizationId", e?.id)}
              loadOptions={getAsyncPreviousOranizationList}
              isError={!!errors?.templateOrganizationsDto}
              errorMessage={errors?.templateOrganizationsDto?.message as string}
            />

            <Input
              label="কোড"
              placeholder="কোড লিখুন"
              registerProperty={{
                ...register("code"),
              }}
            />

            <Textarea
              label="মন্তব্য"
              placeholder="মন্তব্য লিখুন"
              maxLength={500}
              registerProperty={{
                ...register("remarks"),
              }}
              isError={!!errors?.remarks}
              errorMessage={errors?.remarks?.message as string}
            />

            {/* <DateInput
              label="অর্গানোগ্রাম তারিখ"
              control={control}
              name="organogramDate"
            /> */}

            <div className="col-12 col-md-6">
              <Checkbox
                label="সক্রিয়"
                registerProperty={{
                  ...register("isActive"),
                }}
              />
            </div>
            <div className="col-12 col-md-6">
              <Checkbox
                label="প্রশিক্ষণ প্রতিষ্ঠান"
                registerProperty={{
                  ...register("isTrainingOffice", {
                    onChange: (e) =>
                      setValue(
                        "trainingOfficeTag",
                        e.target.checked ? "TRAINING" : ""
                      ),
                  }),
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
              {!isObjectNull(updateData)
                ? COMMON_LABELS.EDIT
                : COMMON_LABELS.SAVE}
            </Button>
          </div>
        </DrawerFooter>
      </form>
    </Drawer>
  );
};
export default OrgForm;
