import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  Separator,
  Textarea,
} from "@gems/components";
import {
  COMMON_LABELS,
  DATE_PATTERN,
  IObject,
  generateDateFormat,
} from "@gems/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { LABELS } from "@constants/common.constant";

interface IForm {
  isOpen?: boolean;
  onSubmit: (data) => void;
  onClose: () => void;
  updateData?: any;
  submitLoading?: boolean;
  organogram?: IObject;
}

const FormUpdate = ({
  isOpen,
  onClose,
  onSubmit,
  updateData,
  submitLoading,
  organogram,
}: IForm) => {
  const formProps = useForm();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = formProps;

  const isEnamCommittee = organogram?.isEnamCommittee;
  const orgName = isEnamCommittee
    ? organogram?.organizationNameEn
    : organogram?.organizationNameBn;
  const organogramDate = organogram?.organogramDate;
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
      title={LABELS.BN.ALLOCATION_OF_BUSINESS + " হালনাগাদ করুন"}
      isOpen={isOpen}
      handleClose={onClose}
      className="w-md-50 w-xl-25"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DrawerBody>
          <div className="row">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <h5 className="m-0">
                <div className="mb-3 text-gray-700">প্রতিষ্ঠান : {orgName}</div>
                <div className="mb-3 text-gray-700">
                  অর্গানোগ্রাম তারিখ :{" "}
                  {isEnamCommittee
                    ? "26/12/1982"
                    : organogramDate
                    ? generateDateFormat(
                        organogramDate,
                        DATE_PATTERN.GOVT_STANDARD
                      )
                    : COMMON_LABELS.NOT_ASSIGN}
                </div>
              </h5>
            </div>
            <Separator className="mt-1 mb-5" />
            {!isEnamCommittee && (
              <div className="col-12 mb-4">
                <Textarea
                  label="কার্যক্রম (বাংলা)"
                  placeholder="কার্যক্রম (বাংলা) লিখুন"
                  isRequired
                  noMargin
                  registerProperty={{
                    ...register(`businessOfAllocationBn`, {
                      required: " ",
                    }),
                  }}
                  isError={!!errors?.businessOfAllocationBn}
                />
              </div>
            )}
            <div className="col-12">
              <Textarea
                label="কার্যক্রম (ইংরেজি)"
                placeholder="কার্যক্রম (ইংরেজি) লিখুন"
                isRequired={isEnamCommittee}
                noMargin
                registerProperty={{
                  ...register(`businessOfAllocationEn`, {
                    required: isEnamCommittee,
                  }),
                }}
                isError={!!errors?.businessOfAllocationEn}
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
              হালনাগাদ
            </Button>
          </div>
        </DrawerFooter>
      </form>
    </Drawer>
  );
};
export default FormUpdate;
