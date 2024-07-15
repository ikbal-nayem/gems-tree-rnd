import { MENU } from "@constants/menu-titles.constant";
import {
  Autocomplete,
  Button,
  DateInput,
  Drawer,
  DrawerBody,
  DrawerFooter,
} from "@gems/components";
import { COMMON_LABELS, IMetaKeyResponse, isObjectNull } from "@gems/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import WorkSpaceComponent from "./WorkSpaceComponent";

type IOptions = {
  postList: IMetaKeyResponse[];
  serviceList: IMetaKeyResponse[];
  cadreList: IMetaKeyResponse[];
  gradeList: IMetaKeyResponse[];
};

interface IForm {
  isOpen?: boolean;
  onSubmit: (data) => void;
  onClose: () => void;
  updateData?: any;
  options?: IOptions;
  submitLoading?: boolean;
}

const UpdateForm = ({
  isOpen,
  onClose,
  onSubmit,
  updateData,
  options,
  submitLoading,
}: IForm) => {
  const formProps = useForm();
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
  } = formProps;

  useEffect(() => {
    if (!isObjectNull(updateData)) {
      reset({ ...updateData });
    } else {
      reset({});
    }
  }, [updateData, reset]);

  return (
    <Drawer
      title={MENU.BN.POST_CONFIG + " " + COMMON_LABELS.EDIT}
      isOpen={isOpen}
      handleClose={onClose}
      // className="w-md-50 w-xl-25"
      className="w-50"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DrawerBody>
          <div className="row">
            <div className="col-12">
              {/* <Autocomplete
label="প্রতিষ্ঠান"
name="organization"
placeholder="প্রতিষ্ঠান বাছাই করুন"
isRequired="প্রতিষ্ঠান বাছাই করুন"
options={options?.orgList || []}
getOptionLabel={(t) => t.nameBn}
getOptionValue={(op) => op?.id}
onChange={(t) => setValue("organizationId", t?.id)}
control={control}
isError={!!errors?.organization}
errorMessage={errors?.organization?.message as string}
/> */}
              <WorkSpaceComponent
                {...formProps}
                isRequired="প্রতিষ্ঠান বাছাই করুন"
              />
            </div>
            <div className="col-12">
              <DateInput
                label="অর্গানোগ্রাম তারিখ"
                isRequired="অর্গানোগ্রাম তারিখ বাছাই করুন"
                name="organogramDate"
                control={control}
                blockFutureDate
                isError={!!errors?.organogramDate}
                errorMessage={errors?.organogramDate?.message as string}
                // onChange={(e) => setValue("chosenDate", e.value)}
              />
              {/* <Autocomplete
label="অর্গানোগ্রাম ভার্সন"
name="organogramVersionDto"
placeholder="অর্গানোগ্রাম ভার্সন বাছাই করুন"
isRequired="অর্গানোগ্রাম ভার্সন বাছাই করুন"
options={options?.organogramVersionList || []}
getOptionLabel={(t) => t.titleBn}
getOptionValue={(op) => op?.metaKey}
onChange={(t) => setValue("organogramVersionKey", t?.metaKey)}
control={control}
isError={!!errors?.organogramVersionDto}
errorMessage={errors?.organogramVersionDto?.message as string}
/> */}
            </div>
            <div className="col-12">
              <Autocomplete
                label="সার্ভিস/ক্যাডারের ধরন"
                name="serviceTypeDto"
                placeholder="সার্ভিস/ক্যাডারের ধরন বাছাই করুন"
                isRequired="সার্ভিস/ক্যাডারের ধরন বাছাই করুন"
                options={options?.serviceList || []}
                getOptionLabel={(t) => t.titleBn}
                getOptionValue={(op) => op?.metaKey}
                onChange={(t) => setValue("serviceTypeKey", t?.metaKey)}
                control={control}
                isError={!!errors?.serviceTypeDto}
                errorMessage={errors?.serviceTypeDto?.message as string}
              />
            </div>
            <div className="col-12">
              <Autocomplete
                label="পদবি"
                name="postDTO"
                placeholder="পদবি বাছাই করুন"
                isRequired="পদবি বাছাই করুন"
                options={options?.postList || []}
                getOptionLabel={(t) => t.nameBn}
                getOptionValue={(op) => op?.id}
                onChange={(t) => setValue("postId", t?.id)}
                control={control}
                isError={!!errors?.postDTO}
                errorMessage={errors?.postDTO?.message as string}
              />
            </div>

            {/* {watch("serviceType")?.metaKey === "SERVICE_TYPE_CADRE" ? (
<div className="col-12">
<Autocomplete
label="সার্ভিস/ক্যাডারের নাম"
name="cadre"
placeholder="সার্ভিস/ক্যাডারের নাম বাছাই করুন"
isRequired="সার্ভিস/ক্যাডারের নাম বাছাই করুন"
options={options?.cadreList || []}
getOptionLabel={(t) => t.titleBn}
getOptionValue={(op) => op?.metaKey}
onChange={(t) => setValue("cadreKey", t?.metaKey)}
control={control}
isError={!!errors?.cadre}
errorMessage={errors?.cadre?.message as string}
/>
</div>
) : null} */}

            <div className="col-12">
              <Autocomplete
                label="গ্রেড"
                name="gradeDTO"
                placeholder="গ্রেড বাছাই করুন"
                isRequired="গ্রেড বাছাই করুন"
                options={options?.gradeList || []}
                getOptionLabel={(t) => t.nameBn}
                getOptionValue={(op) => op?.id}
                onChange={(t) => setValue("gradeId", t?.id)}
                control={control}
                isError={!!errors?.gradeDTO}
                errorMessage={errors?.gradeDTO?.message as string}
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
              {COMMON_LABELS.CLOSE}
            </Button>
            <Button color="primary" type="submit" isLoading={submitLoading}>
              {Object.keys(updateData)?.length > 0
                ? COMMON_LABELS.EDIT
                : COMMON_LABELS.SAVE}
            </Button>
          </div>
        </DrawerFooter>
      </form>
    </Drawer>
  );
};
export default UpdateForm;
