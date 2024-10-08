import { MENU } from "@constants/menu-titles.constant";
import {
  Autocomplete,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
} from "@gems/components";
import { IObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
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
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = formProps;

  const [useList, setUserList] = useState<IObject[]>([]);
  useEffect(() => {
    getUserList();
  }, []);

  const getUserList = () => {
    OMSService.FETCH.approveUserList()
      .then((res) => {
        setUserList(res?.body || []);
      })
      .catch((e) => console.log(e?.message));
  };

  useEffect(() => {
    if (Object.keys(updateData).length > 0) {
      reset({
        ...updateData,
      });
    } else {
      reset({});
    }
  }, [updateData, reset]);

  return (
    <Drawer
      title={
        MENU.BN.ORGANOGRAM_APPROVER +
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
                label="ব্যবহারকারী"
                placeholder="ব্যবহারকারী বাছাই করুন"
                isRequired="ব্যবহারকারী বাছাই করুন"
                // isMulti
                options={useList || []}
                getOptionLabel={(op) => op.nameBn}
                getOptionValue={(op) => op?.id}
                onChange={(op) => setValue("userId", op?.id)}
                name="userDTO"
                control={control}
                isError={!!errors?.userDTO}
                errorMessage={errors?.userDTO?.message as string}
              />
              <Autocomplete
                label="প্রতিষ্ঠানসমূহ"
                placeholder="প্রতিষ্ঠানসমূহ বাছাই করুন"
                loadOptions={searchOrgList}
                getOptionLabel={(op) => op.nameBn}
                getOptionValue={(op) => op?.id}
                name="organizationDtoList"
                control={control}
                isMulti
                isAsync
                isSearchable
                isRequired="প্রতিষ্ঠান বাছাই করুন"
                isError={!!errors?.organizationDtoList}
                errorMessage={errors?.organizationDtoList?.message as string}
              />
            </div>

            {/* <div className="col-12">
              <Checkbox
                label="সক্রিয়"
                registerProperty={{
                  ...register("isActive"),
                }}
              />
            </div> */}
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
