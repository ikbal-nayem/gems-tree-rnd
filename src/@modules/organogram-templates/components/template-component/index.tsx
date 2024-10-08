import {
  Autocomplete,
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
  notNullOrUndefined,
} from "@gems/utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import OrganizationTemplateTree from "./tree";
// import { orgData } from "./Tree/data2";
import { META_TYPE } from "@constants/common.constant";
import { CoreService } from "@services/api/Core.service";
import { OMSService } from "@services/api/OMS.service";
import { useLocation } from "react-router-dom";
import { focusById, isNotEmptyList } from "utility/utils";
import { enCheck } from "../../../../utility/checkValidation";
import AbbreviationForm from "./components/AbbreviationForm";
import ActivitiesForm from "./components/ActivitesForm";
import AllocationOfBusinessForm from "./components/AllocationOfBusinessForm";
import AttachOrganizationForm from "./components/AttachOrganizationForm";
import AttachmentForm from "./components/AttachmentForm";
import EquipmentsForm from "./components/EquipmentsForm";
import NotesForm from "./components/NotesForm";
import SummaryOfManpowerForm from "./components/SummaryOfManpowerForm";
import Organizations from "./components/organization";

interface ITemplateComponent {
  updateData?: IObject;
  onSubmit: (data) => void;
  isSubmitLoading: boolean;
  isExistOrganogramCreate?: boolean;
}

const TemplateComponent = ({
  updateData,
  onSubmit,
  isSubmitLoading,
  isExistOrganogramCreate = false,
}: ITemplateComponent) => {
  const [treeData, setTreeData] = useState<IObject>(
    !isObjectNull(updateData) &&
      !isObjectNull(updateData?.organizationStructureDto)
      ? updateData?.organizationStructureDto
      : {
          nodeId: generateUUID(),
          titleBn: "অর্গানোগ্রাম তৈরি শুরু করুন",
          titleEn: "Start the Organogram here",
          children: [],
        }
  );

  const [duplicateTitleBnDitected, setDuplicateTitleBnDitected] =
    useState<boolean>(false);
  const [duplicateTitleEnDitected, setDuplicateTitleEnDitected] =
    useState<boolean>(false);
  const [isNotEnamCommittee, setIsNotEnamCommittee] = useState<boolean>(false);
  const [orgGroupTriggered, setOrgGroupTriggered] = useState<boolean>(false);
  const [maxNodeCode, setMaxNodeCode] = useState<number>(1);
  const [maxManpowerCode, setMaxManpowerCode] = useState<number>(1);
  const [orgTriggered, setOrgTriggered] = useState<boolean>(false);
  const [isTemplate, setIsTemplate] = useState<boolean>(
    !isExistOrganogramCreate
  );

  const [organogramChangeActionList, setOrganogramChangeActionList] = useState<
    IObject[]
  >([]);
  const { state } = useLocation();
  const draftListRecord = state?.draftListRecord;
  // console.log(state);

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
    CoreService.getByMetaTypeList(META_TYPE.ORGANOGRAM_CHANGE_ACTION).then(
      (resp) => {
        setOrganogramChangeActionList(resp?.body);
      }
    );
    onIsEnamCommitteeChange(true);
  }, []);

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
      // const org = ;
      reset({
        isEnamCommittee: updateData?.isEnamCommittee,
        isTemplate: updateData?.isTemplate,
        titleBn: updateData?.titleBn,
        titleEn: updateData?.titleEn,
        isInventoryOthers: updateData?.isInventoryOthers || false,
        inventoryOthersObject: updateData?.inventoryOthersObject || "",
        summaryOfManPowerObject: updateData?.summaryOfManPowerObject || "",
        isSummaryOfManPowerObject:
          updateData?.isSummaryOfManPowerObject || false,
        organizationHeader: updateData?.organizationHeader,
        organizationHeaderMsc: updateData?.organizationHeaderMsc,
        parentOrgNameBn: updateData?.parentOrgNameBn,
        parentOrgNameEn: updateData?.parentOrgNameEn,
        organogramDate: updateData?.organogramDate,
        organizationGroupDto: updateData?.organizationGroupDto,
        templateOrganizationsDto:
          updateData?.templateOrganizationsDtoList?.[0]?.organizationDTO,
        // templateOrganizationsDtoList: updateData?.templateOrganizationsDtoList,
        abbreviationDtoList: abbreviationist,
        mainActivitiesDtoList: updateData?.mainActivitiesDtoList,
        businessAllocationDtoList: updateData?.businessAllocationDtoList,
        attachmentDtoList: updateData?.attachmentDtoList,
        attachedOrganizationDtoList:
          updateData?.attachedOrganizationDtoList || [],
        inventoryDtoList: updateData?.inventoryDtoList,
        organogramChangeActionDtoList:
          updateData?.organogramChangeActionDtoList,
        miscellaneousPointDtoList: updateData?.miscellaneousPointDtoList,
        organogramNoteDto: updateData?.organogramNoteDto,
      });

      setIsNotEnamCommittee(!updateData?.isEnamCommittee);
      setIsTemplate(updateData?.isTemplate);
      if (updateData?.maxNodeCode) setMaxNodeCode(updateData?.maxNodeCode);
      if (updateData?.maxManpowerCode)
        setMaxManpowerCode(updateData?.maxManpowerCode);
    } else {
      reset({
        isInventoryOthers: false,
        // isTemplate: true,
        // isEnamCommittee: true,
      });
    }
  }, [updateData]);

  const duplicateTitleCheck = (title, isEn: boolean) => {
    if (!isTemplate) return;
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
    if (!isNotEmptyList(list)) return true;
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

  const templateOrganizationsDtoSimplifier = (organization) => {
    return {
      organizationId: organization?.id,
      organizationNameBn: organization?.nameBn,
      organizationNameEn: organization?.nameEn,
    };
  };

  const onFinalSubmit = (data) => {
    if (!uniqueCheck(data.inventoryDtoList, "inventoryDtoList")) return;
    if (isObjectNull(updateData) && isTemplate) {
      if (duplicateTitleBnDitected || duplicateTitleEnDitected) return;
    }

    // data.templateOrganizationsDtoList = data?.templateOrganizationsDtoList?.map(
    //   (d) => ({
    //     organizationId: !isObjectNull(updateData)
    //       ? d?.organizationId || d?.id
    //       : d?.id,
    //     organizationNameEn: d?.nameEn || d?.organizationNameEn,
    //     organizationNameBn: d?.nameBn || d?.organizationNameBn,
    //   })
    // );
    if (data.organogramChangeActionDtoList?.length > 0) {
      data.organogramChangeActionDtoList =
        !data?.isEnamCommittee &&
        data?.organogramChangeActionDtoList?.length > 0
          ? data?.organogramChangeActionDtoList?.map((d) => ({
              titleEn: d?.titleEn,
              titleBn: d?.titleBn,
            }))
          : null;
    }

    data.templateOrganizationsDtoList = isObjectNull(updateData)
      ? isTemplate
        ? []
        : !isObjectNull(data?.templateOrganizationsDto)
        ? [templateOrganizationsDtoSimplifier(data?.templateOrganizationsDto)]
        : []
      : orgGroupTriggered && !orgTriggered
      ? isNotEmptyList(updateData?.templateOrganizationsDtoList)
        ? [
            templateOrganizationsDtoSimplifier(
              updateData?.templateOrganizationsDtoList?.[0]?.organizationDTO
            ),
          ]
        : []
      : !isObjectNull(data?.templateOrganizationsDto)
      ? [templateOrganizationsDtoSimplifier(data?.templateOrganizationsDto)]
      : [];

    const reqPayload = {
      ...data,
      titleBn: getValues("titleBn"),
      titleEn: getValues("titleEn"),
      maxNodeCode: maxNodeCode,
      maxManpowerCode: maxManpowerCode,
      organizationHeader: getValues("organizationHeader"),
      organizationHeaderMsc: getValues("organizationHeaderMsc"),
      organizationGroupId: data?.organizationGroupDto?.id || null,
      organizationStructureDto: treeData,
      organogramNoteDto: data?.organogramNoteDto?.note
        ? {
            ...data?.organogramNoteDto,
            status: "ORGANOGRAM",
          }
        : null,
    };
    // console.log(reqPayload);

    onSubmit(reqPayload);
  };

  // const onIsTemplateChange = (checked: boolean) => {
  //   setIsTemplate(checked);
  // };

  const onIsEnamCommitteeChange = (checked: boolean) => {
    setIsNotEnamCommittee(!checked);
    const enamApprovalDate = new Date("1982-12-26");
    const hasChosenDate = notNullOrUndefined(getValues("chosenDate"));
    if (checked) setValue("organogramDate", enamApprovalDate);
    else {
      if (hasChosenDate) {
        const chosenDate = getValues("chosenDate");
        setValue("organogramDate", new Date(chosenDate));
      } else {
        if (notNullOrUndefined(updateData?.organogramDate)) {
          setValue("organogramDate", new Date(updateData?.organogramDate));
        }
      }
    }
  };

  return (
    <>
      <div
        className="position-fixed z-index-1"
        style={{ right: "20px", top: "73px" }}
      >
        {" "}
        <Button
          color="primary"
          type="submit"
          isLoading={isSubmitLoading}
          form="templateForm"
          onClick={() => {
            if (!notNullOrUndefined(watch("organogramDate")))
              focusById("orgDateBlock");
          }}
        >
          {!isObjectNull(updateData)
            ? COMMON_LABELS.UPDATE
            : COMMON_LABELS.SAVE}
        </Button>
      </div>
      <div className="card col-md-12 border p-3 mb-4">
        {isObjectNull(updateData) && (
          <div className="d-flex justify-content-start gap-6">
            {/* <Checkbox
              label="টেমপ্লেট ?"
              labelClass="fw-bold fs-2"
              noMargin
              checked={isTemplate}
              registerProperty={{
                ...register("isTemplate", {
                  onChange: (e) => onIsTemplateChange(e.target.checked),
                }),
              }}
            />
            <span className="text-primary fs-2 mx-3">|</span> */}
            <Checkbox
              label={
                "এনাম কমিটি অনুমোদিত " +
                (isTemplate ? " অর্গানোগ্রামের টেমপ্লেট" : " অর্গানোগ্রাম")
              }
              labelClass="fw-bold fs-4"
              noMargin
              checked={!isNotEnamCommittee}
              registerProperty={{
                ...register("isEnamCommittee", {
                  onChange: (e) => onIsEnamCommitteeChange(e.target.checked),
                }),
              }}
            />
          </div>
        )}
        <Separator className="mt-1 mb-4" />
        <div className="row">
          {!draftListRecord && isTemplate && isNotEnamCommittee && (
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
                    required: true,
                    onChange: (e) => duplicateTitleCheck(e.target.value, false),
                  }),
                }}
                autoFocus={watch("isEnamCommittee") !== "true"}
                isError={!!errors?.titleBn}
                errorMessage={errors?.titleBn?.message as string}
              />
            </div>
          )}

          {!draftListRecord && isTemplate && (
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
          )}

          {!isNotEnamCommittee && (draftListRecord || !isTemplate) && (
            <>
              <div className="col-md-6 col-12">
                <Input
                  label="শিরোনাম"
                  placeholder="শিরোনাম লিখুন"
                  // isRequired={true}
                  defaultValue={
                    isObjectNull(updateData)
                      ? "Organization"
                      : updateData?.organizationHeader
                  }
                  registerProperty={{
                    ...register("organizationHeader", {
                      // required: true,
                      // onChange: (e) => duplicateTitleCheck(e.target.value, true),
                      // validate: enCheck,
                    }),
                  }}
                  // isError={!!errors?.organizationHeader}
                  // errorMessage={errors?.organizationHeader?.message as string}
                />
              </div>
              {/* <div className="col-md-6 col-12">
                <Input
                  label="শিরোনাম-২"
                  placeholder="শিরোনাম-২ লিখুন"
                  // isRequired={true}
                  defaultValue={
                    !isObjectNull(updateData)
                      ? updateData?.organizationHeaderMsc
                      : ""
                  }
                  registerProperty={{
                    ...register("organizationHeaderMsc", {
                      // required: true,
                      // onChange: (e) => duplicateTitleCheck(e.target.value, true),
                      // validate: enCheck,
                    }),
                  }}
                  // isError={!!errors?.organizationHeaderMsc}
                  // errorMessage={errors?.organizationHeaderMsc?.message as string}
                />
              </div> */}
            </>
          )}

          <div className="col-md-6 col-12" id="orgDateBlock">
            <DateInput
              label="অর্গানোগ্রাম তারিখ"
              isRequired
              name="organogramDate"
              control={control}
              onChange={(e) => setValue("chosenDate", e.value)}
              blockFutureDate
              isError={!!errors?.organogramDate}
            />
          </div>

          {isNotEnamCommittee &&
            updateData?.organogramChangeActionDtoList?.length > 0 && (
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
            )}
        </div>
        {(!isTemplate || !isObjectNull(updateData)) && (
          <div className="row">
            {isNotEnamCommittee && (
              <div className="col-md-6">
                <Input
                  label="অভিভাবকের প্রতিষ্ঠানের নাম (বাংলা)"
                  placeholder="অভিভাবকের প্রতিষ্ঠানের নাম (বাংলা) লিখুন"
                  // isRequired={isNotEnamCommittee}
                  registerProperty={{
                    ...register("parentOrgNameBn", {
                      // required: isNotEnamCommittee,
                    }),
                  }}
                  isError={!!errors?.parentOrgNameBn}
                  errorMessage={errors?.parentOrgNameBn?.message as string}
                />
              </div>
            )}
            <div className="col-md-6">
              <Input
                label="অভিভাবকের প্রতিষ্ঠানের নাম (ইংরেজি)"
                placeholder="অভিভাবকের প্রতিষ্ঠানের নাম লিখুন (ইংরেজি)"
                // isRequired={!isNotEnamCommittee}
                registerProperty={{
                  ...register("parentOrgNameEn", {
                    // required: !isNotEnamCommittee,
                  }),
                }}
                isError={!!errors?.parentOrgNameEn}
                errorMessage={errors?.parentOrgNameEn?.message as string}
              />
            </div>
          </div>
        )}
      </div>
      <div className="mb-4">
        <Organizations
          formProps={formProps}
          setOrgGroupTriggered={setOrgGroupTriggered}
          setOrgTriggered={setOrgTriggered}
          isTemplate={draftListRecord ? !draftListRecord : isTemplate}
        />
      </div>
      <div className="border border-secondary mb-3">
        <OrganizationTemplateTree
          treeData={treeData}
          setTreeData={setTreeData}
          isNotEnamCommittee={isNotEnamCommittee}
          isTemplate={isTemplate}
          draftListRecord={draftListRecord}
          maxNodeCode={maxNodeCode}
          setMaxNodeCode={setMaxNodeCode}
          maxManpowerCode={maxManpowerCode}
          setMaxManpowerCode={setMaxManpowerCode}
          isOrganogramUpdate={
            !isObjectNull(updateData) &&
            !!updateData?.templateOrganizationsDtoList?.[0]?.organizationDTO?.id
          }
          organogramData={{
            organizationOrganogramId: updateData?.id || "",
            organizationId:
              updateData?.templateOrganizationsDtoList?.[0]?.organizationDTO
                ?.id || "",
            organogramDate: updateData?.organogramDate || "",
          }}
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
          <div className="col-12 mt-3">
            <SummaryOfManpowerForm
              formProps={formProps}
              isNotEnamCommittee={isNotEnamCommittee}
            />
          </div>
          <div className="col-12 mt-3">
            <AttachOrganizationForm
              formProps={formProps}
              isNotEnamCommittee={isNotEnamCommittee}
            />
          </div>
          <div className="col-12 mt-3">
            <AttachmentForm
              formProps={formProps}
              isNotEnamCommittee={isNotEnamCommittee}
            />
          </div>
          <div className="col-md-6 mt-3">
            <AbbreviationForm formProps={formProps} />
          </div>
          <div className="col-md-6 mt-3">
            <NotesForm formProps={formProps} />
          </div>
        </div>
        <div className="d-flex gap-3 justify-content-center mt-5">
          <Button
            color="primary"
            type="submit"
            isLoading={isSubmitLoading}
            form="templateForm"
            onClick={() => {
              if (!notNullOrUndefined(watch("organogramDate")))
                focusById("orgDateBlock");
            }}
          >
            {!isObjectNull(updateData)
              ? COMMON_LABELS.UPDATE
              : COMMON_LABELS.SAVE}
          </Button>
        </div>
      </form>
    </>
  );
};

export default TemplateComponent;
