import { MENU } from "@constants/menu-titles.constant";
import {
  Autocomplete,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerFooter,
} from "@gems/components";
import { COMMON_LABELS, IMetaKeyResponse, isObjectNull } from "@gems/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type IOptions = {
  orgList: IMetaKeyResponse[];
  postList: IMetaKeyResponse[];
  serviceList: IMetaKeyResponse[];
  cadreList: IMetaKeyResponse[];
  gradeList: IMetaKeyResponse[];
};

interface ITrainingOrgForm {
  isOpen?: boolean;
  onSubmit: (data) => void;
  onClose: () => void;
  updateData?: any;
  options?: IOptions;
  submitLoading?: boolean;
}

const RankMinistryForm = ({
  isOpen,
  onClose,
  onSubmit,
  updateData,
  options,
  submitLoading,
}: ITrainingOrgForm) => {
  const formProps = useForm();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    control,
    setValue,
  } = formProps;

  useEffect(() => {
    if (!isObjectNull(updateData)) {
      reset({ ...updateData });
    } else {
      reset({
        isActive: true,
        isEntryRank: false,
      });
    }
  }, [updateData, reset]);

  return (
    <Drawer
      title={
        MENU.BN.POST_CONFIG +
        " " +
        (isObjectNull(updateData) ? COMMON_LABELS.SAVE : COMMON_LABELS.EDIT)
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
                name="organigation"
                placeholder="মন্ত্রণালয় বাছাই করুন"
                isRequired="মন্ত্রণালয় বাছাই করুন"
                options={options?.orgList || []}
                getOptionLabel={(t) => t.nameBn}
                getOptionValue={(op) => op?.id}
                onChange={(t) => setValue("organigationId", t?.id)}
                control={control}
                isError={!!errors?.ministry}
                errorMessage={errors?.ministry?.message as string}
              />
            </div>
            <div className="col-12">
              <Autocomplete
                label="পদ"
                name="rank"
                placeholder="পদ বাছাই করুন"
                isRequired="পদ বাছাই করুন"
                options={options?.postList || []}
                getOptionLabel={(t) => t.titleBn}
                getOptionValue={(op) => op?.id}
                onChange={(t) => setValue("rankId", t?.id)}
                control={control}
                isError={!!errors?.rank}
                errorMessage={errors?.rank?.message as string}
              />
            </div>
            <div className="col-12">
              <Autocomplete
                label="সার্ভিস/ক্যাডারের ধরণ"
                name="serviceType"
                placeholder="সার্ভিস/ক্যাডারের ধরণ বাছাই করুন"
                isRequired="সার্ভিস/ক্যাডারের ধরণ বাছাই করুন"
                options={options?.serviceList || []}
                getOptionLabel={(t) => t.titleBn}
                getOptionValue={(op) => op?.metaKey}
                onChange={(t) => setValue("serviceTypeKey", t?.metaKey)}
                control={control}
                isError={!!errors?.serviceType}
                errorMessage={errors?.serviceType?.message as string}
              />
            </div>

            {watch("serviceType")?.metaKey === "SERVICE_TYPE_CADRE" ? (
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
            ) : null}

            <div className="col-12">
              <Autocomplete
                label="গ্রেড"
                name="grade"
                placeholder="গ্রেড বাছাই করুন"
                isRequired="গ্রেড বাছাই করুন"
                options={options?.gradeList || []}
                getOptionLabel={(t) => t.nameBn}
                getOptionValue={(op) => op?.id}
                onChange={(t) => setValue("gradeId", t?.id)}
                control={control}
                isError={!!errors?.grade}
                errorMessage={errors?.grade?.message as string}
              />
            </div>

            <div className="col-12 col-md-6">
              <Checkbox
                label="প্রারম্ভিক পদ"
                registerProperty={{
                  ...register("isEntryRank"),
                }}
              />
            </div>
            <div className="col-12 col-md-6">
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
export default RankMinistryForm;
