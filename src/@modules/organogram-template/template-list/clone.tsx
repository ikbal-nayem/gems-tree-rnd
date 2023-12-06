import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  DateInput,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  Separator,
  toast,
} from "@gems/components";
import { COMMON_LABELS, notNullOrUndefined } from "@gems/utils";
import { OMSService } from "../../../@services/api/OMS.service";
import { useForm } from "react-hook-form";
import { bnCheck, enCheck } from "utility/checkValidation";

interface IForm {
  template: any;
  isOpen: boolean;
  onClose: () => void;
  getDataList: () => void;
}

const TemplateClone = ({ template, isOpen, onClose, getDataList }: IForm) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [duplicateTitleBnDitected, setDuplicateTitleBnDitected] =
    useState<boolean>(false);
  const [duplicateTitleEnDitected, setDuplicateTitleEnDitected] =
    useState<boolean>(false);
  const [isNotEnamCommittee, setIsNotEnamCommittee] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<any>();

  useEffect(() => {
    reset({});
    getDataList();
  }, [isOpen]);

  const onSubmit = (cloneData) => {
    if (duplicateTitleBnDitected || duplicateTitleEnDitected) return;

    setIsSubmitLoading(true);
    const payload = {
      cloneIsEnamCommittee: cloneData.isEnamCommittee,
      cloneTitleBn: cloneData.isEnamCommittee ? cloneData.titleEn : cloneData.titleBn,
      cloneTitleEn: cloneData.titleEn,
      cloneOrganogramDate: cloneData.organogramDate,
      refTemplateId: template?.id,
    };
    OMSService.templateClone(payload)
      .then((res) => toast.success(res?.message))
      .catch((error) => toast.error(error?.message))
      .finally(() => {
        setIsSubmitLoading(false);
        setIsNotEnamCommittee(true);
        onClose();
      });
  };

  const duplicateTitleCheck = (title, isEn: boolean) => {
    const field = isEn ? "titleEn" : "titleBn";
    OMSService.duplicateTemplateTitleCheck(title, isEn)
      .then((res) => {
        if (res?.body) {
          const msg = (isEn ? "ইংরেজি" : "বাংলা") + " শিরোনামটি অনন্য নয় !";

          setError(field, {
            type: "manaul",
            message: msg,
          });

          isEn
            ? setDuplicateTitleEnDitected(true)
            : setDuplicateTitleBnDitected(true);
        } else {
          clearErrors(field);
          isEn
            ? setDuplicateTitleEnDitected(false)
            : setDuplicateTitleBnDitected(false);
        }
      })
      .catch((e) => console.log(e.message));
  };

  const onIsEnamCommitteeChange = (checked: boolean) => {
    setIsNotEnamCommittee(!checked);
    const enamApprovalDate = new Date("1982-12-26");
    if (checked) setValue("organogramDate", enamApprovalDate);
    else if (notNullOrUndefined(getValues("chosenDate"))) {
      const chosenDate = getValues("chosenDate");
      setValue("organogramDate", new Date(chosenDate));
    }
  };

  const MODAL_TITLE =
    (template?.titleBn ? "'" + template?.titleBn + "' এর " : "") +
    "ডুপ্লিকেট টেমপ্লেটের তথ্য প্রদান করুন";

  return (
    <Modal
      title={MODAL_TITLE}
      // title="ডুপ্লিকেট টেমপ্লেটের তথ্য প্রদান করুন"
      isOpen={isOpen}
      handleClose={onClose}
      holdOn
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <ModalBody>
          <div className="row">
            <div className="col-6">
              <Checkbox
                label="এনাম কমিটি অনুমোদিত অর্গানোগ্রামের টেমপ্লেট"
                labelClass="fw-bold"
                noMargin
                registerProperty={{
                  ...register("isEnamCommittee", {
                    onChange: (e) => onIsEnamCommitteeChange(e.target.checked),
                  }),
                }}
              />
            </div>
            <div className="col-6"></div>
            <Separator />
            {isNotEnamCommittee && (
              <div className="col-md-6 col-12">
                <Input
                  label="শিরোনাম (বাংলা)"
                  placeholder="বাংলায় শিরোনাম লিখুন"
                  isRequired
                  registerProperty={{
                    ...register("titleBn", {
                      required: " ",
                      onChange: (e) =>
                        duplicateTitleCheck(e.target.value, false),
                      validate: bnCheck,
                    }),
                  }}
                  isError={!!errors?.titleBn}
                  errorMessage={errors?.titleBn?.message as string}
                />
              </div>
            )}
            <div className="col-md-6 col-12">
              <Input
                label="শিরোনাম (ইংরেজি)"
                placeholder="ইংরেজিতে শিরোনাম লিখুন"
                isRequired={!isNotEnamCommittee}
                registerProperty={{
                  ...register("titleEn", {
                    required: !isNotEnamCommittee,
                    onChange: (e) => duplicateTitleCheck(e.target.value, true),
                    validate: enCheck,
                  }),
                }}
                isError={!!errors?.titleEn}
                errorMessage={errors?.titleEn?.message as string}
              />
            </div>
            <div className="col-md-6 col-12">
              <DateInput
                label="অর্গানোগ্রাম তারিখ"
                isRequired=" "
                name="organogramDate"
                control={control}
                onChange={(e) => setValue("chosenDate", e.value)}
                blockFutureDate
                isError={!!errors?.organogramDate}
                errorMessage={errors?.organogramDate?.message as string}
              />
            </div>
            {/* <div className="col-md-6 col-12">
              <Input
                label="অর্গানোগ্রাম তারিখ (বাংলা)"
                placeholder="বাংলায় অর্গানোগ্রাম তারিখ লিখুন"
                isRequired
                registerProperty={{
                  ...register("versionBn", {
                    required: " ",
                    validate: bnCheck,
                  }),
                }}
                isError={!!errors?.versionBn}
                errorMessage={errors?.versionBn?.message as string}
              />
            </div>
            <div className="col-md-6 col-12">
              <Input
                label="অর্গানোগ্রাম তারিখ (ইংরেজি)"
                placeholder="ইংরেজিতে অর্গানোগ্রাম তারিখ লিখুন"
                isRequired
                registerProperty={{
                  ...register("versionEn", {
                    required: " ",
                    validate: enCheck,
                  }),
                }}
                isError={!!errors?.versionEn}
                errorMessage={errors?.versionEn?.message as string}
              />
            </div> */}
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="d-flex gap-3 justify-content-end">
            <Button color="secondary" onClick={onClose}>
              {COMMON_LABELS.CANCEL}
            </Button>
            <Button color="primary" type="submit" isLoading={isSubmitLoading}>
              {COMMON_LABELS.SAVE}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default TemplateClone;
