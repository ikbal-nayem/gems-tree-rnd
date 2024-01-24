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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { bnCheck, enCheck } from "utility/checkValidation";
import { deFocusById, focusById } from "utility/utils";
import { OMSService } from "../../../../@services/api/OMS.service";
import Organizations from "./organization";
import { ROUTE_L2 } from "@constants/internal-route.constant";
import { useNavigate } from "react-router-dom";

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
  const [notOrganizationData, setNotOrganizationData] =
    useState<boolean>(false);
  // const [organogramChangeActionList, setOrganogramChangeActionList] = useState<IObject[]>([]);
  const navigate = useNavigate();
  const formProps = useForm<any>();

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
  } = formProps;

  // useEffect(() => {
  //   CoreService.getByMetaTypeList(META_TYPE.ORGANOGRAM_CHANGE_ACTION).then(
  //     (resp) => {
  //       setOrganogramChangeActionList(resp?.body);
  //     }
  //   );
  // }, []);

  useEffect(() => {
    reset({});
    getDataList();
  }, [isOpen]);

  const onSubmit = (cloneData) => {
    // if (duplicateTitleBnDitected || duplicateTitleEnDitected) return;

    const reqPayload = {
      cloneIsEnamCommittee: true,
      // cloneTitleBn: cloneData.isEnamCommittee
      //   ? "" // cloneData.titleEn
      //   : cloneData.titleBn,
      // cloneTitleEn: cloneData.titleEn,
      // cloneOrganogramDate: cloneData.organogramDate,
      cloneOrganogramDate: new Date("1982-12-26"),
      refTemplateId: template?.id,
      // organogramChangeActionDtoList:
      //   !cloneData.isEnamCommittee &&
      //   cloneData?.organogramChangeActionDtoList?.length > 0
      //     ? cloneData?.organogramChangeActionDtoList?.map((d) => ({
      //         titleEn: d?.titleEn,
      //         titleBn: d?.titleBn,
      //       }))
      //     : null,
      templateOrganizationsDtoList:
        cloneData?.templateOrganizationsDtoList?.length > 0
          ? cloneData?.templateOrganizationsDtoList?.map((d) => ({
              organizationId: d?.id,
              organizationNameEn: d?.nameEn || d?.organizationNameEn,
              organizationNameBn: d?.nameBn || d?.organizationNameBn,
            }))
          : null,
    };

    // Organization Empty Check
    if (
      cloneData?.templateOrganizationsDtoList === undefined ||
      cloneData?.templateOrganizationsDtoList?.length <= 0
    ) {
      setNotOrganizationData(true);
      focusById("organizationBlock", true);
      return;
    } else {
      setNotOrganizationData(false);
      deFocusById("organizationBlock");
    }

    setIsSubmitLoading(true);

    OMSService.templateClone(reqPayload)
      .then((res) => toast.success(res?.message))
      .catch((error) => toast.error(error?.message))
      .finally(() => {
        setIsSubmitLoading(false);
        // setIsNotEnamCommittee(true);
        // onClose();
        navigate(ROUTE_L2.OMS_ORGANOGRAM_DRAFT_LIST);
      });
  };

  // const duplicateTitleCheck = (title, isEn: boolean) => {
  //   const field = isEn ? "titleEn" : "titleBn";
  //   OMSService.duplicateTemplateTitleCheck(title, isEn)
  //     .then((res) => {
  //       if (res?.body) {
  //         const msg = (isEn ? "ইংরেজি" : "বাংলা") + " শিরোনামটি অনন্য নয় !";

  //         setError(field, {
  //           type: "manaul",
  //           message: msg,
  //         });

  //         isEn
  //           ? setDuplicateTitleEnDitected(true)
  //           : setDuplicateTitleBnDitected(true);
  //       } else {
  //         clearErrors(field);
  //         isEn
  //           ? setDuplicateTitleEnDitected(false)
  //           : setDuplicateTitleBnDitected(false);
  //       }
  //     })
  //     .catch((e) => console.log(e.message));
  // };

  // const onIsEnamCommitteeChange = (checked: boolean) => {
  //   setIsNotEnamCommittee(!checked);
  //   const enamApprovalDate = new Date("1982-12-26");
  //   if (checked) setValue("organogramDate", enamApprovalDate);
  //   else if (notNullOrUndefined(getValues("chosenDate"))) {
  //     const chosenDate = getValues("chosenDate");
  //     setValue("organogramDate", new Date(chosenDate));
  //   }
  // };

  const MODAL_TITLE =
    (template?.titleBn ? "'" + template?.titleBn + "' এর " : "") +
    "ক্লোন-অর্গানোগ্রামের তথ্য প্রদান করুন";
  return (
    <Modal
      title={MODAL_TITLE}
      // title="অর্গানোগ্রামের তথ্য প্রদান করুন"
      isOpen={isOpen}
      handleClose={onClose}
      holdOn
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <ModalBody>
          <div className="row">
            {/* <div className="col-6">
              <Checkbox
                label="এনাম কমিটি অনুমোদিত অর্গানোগ্রামের টেমপ্লেট"
                labelClass="fw-bold"
                defaultChecked={!isNotEnamCommittee}
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
            </div> */}
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
            {/* {isNotEnamCommittee && (
              <div className="col-md-6 col-12">
                <Autocomplete
                  label="অর্গানোগ্রাম পরিবর্তনের কারণ সমূহ"
                  placeholder="অর্গানোগ্রাম পরিবর্তনের কারণ সমূহ দিন"
                  options={organogramChangeActionList || []}
                  getOptionLabel={(op) =>
                    isNotEnamCommittee ? op?.titleBn : op?.titleEn
                  }
                  getOptionValue={(op) => op?.titleEn}
                  isMulti
                  closeMenuOnSelect={false}
                  // isRequired="অর্গানোগ্রাম পরিবর্তনের কারণ সমূহ দিন"
                  name="organogramChangeActionDtoList"
                  control={control}
                />
              </div>
            )} */}
            <Organizations
              formProps={formProps}
              notOrganizationData={notOrganizationData}
              setNotOrganizationData={setNotOrganizationData}
            />
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
