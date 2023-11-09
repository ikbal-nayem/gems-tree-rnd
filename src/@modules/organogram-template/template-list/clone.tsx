import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  toast,
} from "@gems/components";
import { COMMON_LABELS } from "@gems/utils";
import { OMSService } from "../../../@services/api/OMS.service";
import { useForm } from "react-hook-form";
import { bnCheck, enCheck } from "utility/checkValidation";

interface IForm {
  templateId: any;
  isOpen: boolean;
  onClose: () => void;
  getDataList: () => void;
}

const TemplateClone = ({ templateId, isOpen, onClose, getDataList }: IForm) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [duplicateTitleBnDitected, setDuplicateTitleBnDitected] =
    useState<boolean>(false);
  const [duplicateTitleEnDitected, setDuplicateTitleEnDitected] =
    useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
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
      cloneTitleBn: cloneData.titleBn,
      cloneTitleEn: cloneData.titleEn,
      cloneVersionBn: cloneData.versionBn,
      cloneVersionEn: cloneData.versionEn,
      refTemplateId: templateId,
    };
    OMSService.templateClone(payload)
      .then((res) => toast.success(res?.message))
      .catch((error) => toast.error(error?.message))
      .finally(() => {
        setIsSubmitLoading(false);
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

  return (
    <Modal
      title="ডুপ্লিকেট টেমপ্লেটের তথ্য প্রদান করুন"
      isOpen={isOpen}
      handleClose={onClose}
      holdOn
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <ModalBody>
          <div className="row">
            <div className="col-md-6 col-12">
              <Input
                label="শিরোনাম (বাংলা)"
                placeholder="বাংলায় শিরোনাম লিখুন"
                isRequired
                registerProperty={{
                  ...register("titleBn", {
                    required: "শিরোনাম বাংলা লিখুন",
                    onChange: (e) => duplicateTitleCheck(e.target.value, false),
                    validate: bnCheck,
                  }),
                }}
                isError={!!errors?.titleBn}
                errorMessage={errors?.titleBn?.message as string}
              />
            </div>
            <div className="col-md-6 col-12">
              <Input
                label="শিরোনাম (ইংরেজি)"
                placeholder="ইংরেজিতে শিরোনাম লিখুন"
                isRequired
                registerProperty={{
                  ...register("titleEn", {
                    required: "শিরোনাম ইংরেজি লিখুন",
                    onChange: (e) => duplicateTitleCheck(e.target.value, true),
                    validate: enCheck,
                  }),
                }}
                isError={!!errors?.titleEn}
                errorMessage={errors?.titleEn?.message as string}
              />
            </div>
            <div className="col-md-6 col-12">
              <Input
                label="ভার্শন (বাংলা)"
                placeholder="বাংলায় ভার্শন লিখুন"
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
                label="ভার্শন (ইংরেজি)"
                placeholder="ইংরেজিতে ভার্শন লিখুন"
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
            </div>
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
