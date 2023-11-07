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
}

const TemplateClone = ({ templateId, isOpen, onClose }: IForm) => {
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
  }, [isOpen]);

  const onSubmit = (cloneData) => {
    if (duplicateTitleBnDitected || duplicateTitleEnDitected) return;

    setIsSubmitLoading(true);
    const payload = {
      cloneTitleBn: cloneData.titleBn,
      cloneTitleEn: cloneData.titleEn,
      cloneVersion: cloneData.version,
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
                label="শিরোনাম বাংলা"
                placeholder="শিরোনাম বাংলা লিখুন"
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
                label="শিরোনাম ইংরেজি"
                placeholder="শিরোনাম ইংরেজি লিখুন"
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
                label="ভার্শন"
                placeholder="ভার্শন লিখুন"
                isRequired
                registerProperty={{
                  ...register("version", {
                    required: "ভার্শন লিখুন",
                  }),
                }}
                isError={!!errors?.version}
                errorMessage={errors?.version?.message as string}
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
