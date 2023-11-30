import {
  Button,
  Checkbox,
  DateInput,
  Input,
  Separator,
} from "@gems/components";
import {
  COMMON_LABELS,
  IObject,
  generateUUID,
  isObjectNull,
} from "@gems/utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import OrganizationTemplateTree from "./Tree";
// import { orgData } from "./Tree/data2";
import { OMSService } from "@services/api/OMS.service";
import { enCheck } from "../../../../utility/checkValidation";
import AbbreviationForm from "./components/AbbreviationForm";
import ActivitiesForm from "./components/ActivitesForm";
import AllocationOfBusinessForm from "./components/AllocationOfBusinessForm";
import EquipmentsForm from "./components/EquipmentsForm";
import Organizations from "./components/organization";
import AttachmentForm from "./components/AttachmentForm";

interface ITemplateComponent {
  updateData?: IObject;
  onSubmit: (data) => void;
  isSubmitLoading: boolean;
}

const TemplateComponent = ({
  updateData,
  onSubmit,
  isSubmitLoading,
}: ITemplateComponent) => {
  const [treeData, setTreeData] = useState<IObject>(
    !isObjectNull(updateData) &&
      !isObjectNull(updateData?.organizationStructureDto)
      ? updateData?.organizationStructureDto
      : {
          id: generateUUID(),
          titleBn: "অর্গানোগ্রাম তৈরি শুরু করুন",
          titleEn: "Start the Organogram here",
          children: [],
        }
  );
  const [duplicateTitleBnDitected, setDuplicateTitleBnDitected] =
    useState<boolean>(false);
  const [duplicateTitleEnDitected, setDuplicateTitleEnDitected] =
    useState<boolean>(false);
  const [isNotEnamCommittee, setIsNotEnamCommittee] = useState<boolean>(true);
  // const isNotEnamCommittee = true;
  const formProps = useForm<any>({
    defaultValues: {
      abbreviationDtoList: [],
      mainActivitiesDtoList: [],
      businessAllocationDtoList: [],
      attachmentDtoList: [],
      inventoryDtoList: [],
      miscellaneousPointDtoList: [],
    },
  });
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    setValue,
    getValues,
    watch,
    control,
    formState: { errors },
  } = formProps;

  useEffect(() => {
    if (!isObjectNull(updateData)) {
      setIsNotEnamCommittee(!updateData?.isEnamCommittee);
      let abbreviationist: any;
      if (updateData?.abbreviationDtoList?.length > 0) {
        abbreviationist = updateData?.abbreviationDtoList.sort(
          (item1, item2) => {
            if (item1.shortForm > item2.shortForm) return 1;
            if (item1.shortForm < item2.shortForm) return -1;
            return 0;
          }
        );
      } else abbreviationist = updateData?.abbreviationDtoList;
      reset({
        isEnamCommittee: updateData?.isEnamCommittee,
        titleBn: updateData?.titleBn,
        titleEn: updateData?.titleEn,
        versionDate: updateData?.versionDate,
        abbreviationDtoList: abbreviationist,
        mainActivitiesDtoList: updateData?.mainActivitiesDtoList,
        businessAllocationDtoList: updateData?.businessAllocationDtoList,
        attachmentDtoList: updateData?.attachmentDtoList,
        inventoryDtoList: updateData?.inventoryDtoList,
        templateOrganizationsDtoList: updateData?.templateOrganizationsDtoList,
        miscellaneousPointDtoList: updateData?.miscellaneousPointDtoList,
      });
    }
  }, [updateData]);

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
          if (isEn) {
            setDuplicateTitleEnDitected(false);
            setValue("titleEn", title);
          } else {
            setDuplicateTitleBnDitected(false);
            setValue("titleBn", title);
          }
        }
      })
      .catch((e) => console.log(e.message));
  };

  const uniqueCheck = (list, listName: string) => {
    let isUnique = true;
    switch (listName) {
      case "inventoryDtoList":
        for (let i = 0; 0 < list.length && i < list.length; i++) {
          for (let j = 0; j < list.length; j++) {
            if (i !== j && list[i]?.item?.id === list[j]?.item?.id) {
              isUnique = false;
              setError(`inventoryDtoList.[${j}].item`, {
                type: "manaul",
                message:
                  "'" + list[j]?.item?.itemTitleBn + "' আইটেমটি অনন্য নয় !",
              });
            }
          }
        }
        break;
      default:
    }
    return isUnique;
  };

  const onFinalSubmit = (data) => {
    if (!uniqueCheck(data.inventoryDtoList, "inventoryDtoList")) return;
    if (isObjectNull(updateData)) {
      if (duplicateTitleBnDitected || duplicateTitleEnDitected) return;
    }
    data.templateOrganizationsDtoList = data?.templateOrganizationsDtoList?.map(
      (d) => ({
        organizationId: d?.id,
        organizationNameEn: d?.nameEn || d?.organizationNameEn,
        organizationNameBn: d?.nameBn || d?.organizationNameBn,
      })
    );

    const reqPayload = {
      ...data,
      titleBn: getValues(isNotEnamCommittee ? "titleBn" : "titleEn"),
      titleEn: getValues("titleEn"),
      // versionBn: data?.versionEn,
      organizationStructureDto: treeData,
    };
    // let test = makeFormData(reqPayload);

    // for (const value of test.values()) {
    //   console.log(value);
    // }
    // console.log("Req Payload: ", reqPayload);

    onSubmit(reqPayload);
  };

  return (
    <div>
      <div className="card col-md-12 border p-3 mb-4">
        <div className="d-flex justify-content-start gap-6">
          <h2 className="m-0">টেমপ্লেট</h2>
          <span className="text-primary">|</span>
          <Checkbox
            label="এনাম কমিটি অনুমোদিত অর্গানোগ্রামের টেমপ্লেট"
            labelClass="fw-bold"
            noMargin
            registerProperty={{
              ...register("isEnamCommittee", {
                onChange: (e) => setIsNotEnamCommittee(!e.target.checked),
              }),
            }}
          />
        </div>

        <Separator className="mt-1 mb-4" />

        <div className="row">
          {isNotEnamCommittee && (
            <div className="col-md-6 col-12">
              <Input
                label="শিরোনাম বাংলা"
                placeholder="বাংলায় শিরোনাম লিখুন"
                isRequired
                defaultValue={
                  !isObjectNull(updateData) ? updateData?.titleBn : ""
                }
                registerProperty={{
                  ...register("titleBn", {
                    required: " ",
                    onChange: (e) => duplicateTitleCheck(e.target.value, false),
                  }),
                }}
                autoFocus={watch("isEnamCommittee") !== "true"}
                isError={!!errors?.titleBn}
                errorMessage={errors?.titleBn?.message as string}
              />
            </div>
          )}

          {/* <div className={isNotEnamCommittee ? "col-md-6 col-12" : "col-12"}> */}
          <div className="col-md-6 col-12">
            <Input
              label="শিরোনাম ইংরেজি"
              placeholder="ইংরেজিতে শিরোনাম লিখুন"
              isRequired={!isNotEnamCommittee}
              defaultValue={
                !isObjectNull(updateData) ? updateData?.titleEn : ""
              }
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
          {/* {isNotEnamCommittee && (
              <div className="col-md-6 col-12">
                <Input
                  label="ভার্শন (বাংলা)"
                  placeholder="বাংলায় ভার্শন লিখুন"
                  isRequired
                  registerProperty={{
                    ...register("versionBn", {
                      required: " ",
                    }),
                  }}
                  isError={!!errors?.versionBn}
                  errorMessage={errors?.versionBn?.message as string}
                />
              </div>
            )} */}
          {/* <div className="col-md-6 col-12">
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
            </div> */}
          <div className="col-md-6 col-12">
            <DateInput
              label="ভার্শন"
              isRequired="ভার্শন লিখুন"
              name="versionDate"
              control={control}
              blockFutureDate
              isError={!!errors?.versionDate}
              errorMessage={errors?.versionDate?.message as string}
            />
          </div>
        </div>
      </div>

      <div className="border border-secondary mb-3">
        <OrganizationTemplateTree
          treeData={treeData}
          setTreeData={setTreeData}
          isNotEnamCommittee={isNotEnamCommittee}
        />
      </div>
      <form onSubmit={handleSubmit(onFinalSubmit)} noValidate id="templateForm">
        <div className="row">
          <div className="col-md-6">
            <ActivitiesForm
              formProps={formProps}
              isNotEnamCommittee={isNotEnamCommittee}
            />
          </div>
          <div className="col-md-6 mt-md-0 mt-3">
            <AllocationOfBusinessForm
              formProps={formProps}
              isNotEnamCommittee={isNotEnamCommittee}
            />
          </div>
          <div className="col-12 mt-3">
            <EquipmentsForm
              formProps={formProps}
              isNotEnamCommittee={isNotEnamCommittee}
            />
          </div>
          <div className="col-md-6 mt-3">
            <Organizations formProps={formProps} />
            <div className="mt-3">
              <AttachmentForm
                formProps={formProps}
                isNotEnamCommittee={isNotEnamCommittee}
              />
            </div>
          </div>

          <div className="col-md-6 mt-3">
            <AbbreviationForm formProps={formProps} />
          </div>
        </div>
        <div className="d-flex gap-3 justify-content-center mt-5">
          <Button
            color="primary"
            type="submit"
            isLoading={isSubmitLoading}
            form="templateForm"
          >
            {!isObjectNull(updateData)
              ? COMMON_LABELS.UPDATE
              : COMMON_LABELS.SAVE}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TemplateComponent;
