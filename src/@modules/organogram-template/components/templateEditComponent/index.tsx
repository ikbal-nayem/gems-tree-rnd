import { Autocomplete, Button, DateInput, Input } from "@gems/components";
import {
  COMMON_LABELS,
  IObject,
  generateUUID,
  isObjectNull,
  notNullOrUndefined,
} from "@gems/utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import OrganizationTemplateTree from "./Tree";
// import { orgData } from "./Tree/data2";
import { META_TYPE } from "@constants/common.constant";
import { CoreService } from "@services/api/Core.service";
import { focusById } from "utility/utils";
import AbbreviationForm from "./components/AbbreviationForm";
import ActivitiesForm from "./components/ActivitesForm";
import AllocationOfBusinessForm from "./components/AllocationOfBusinessForm";
import AttachmentForm from "./components/AttachmentForm";
import EquipmentsForm from "./components/EquipmentsForm";
import NotesForm from "./components/NotesForm";
import WorkSpaceComponent from "./components/WorkSpaceComponent";

interface ITemplateEditComponent {
  updateData?: IObject;
  onSubmit: (data) => void;
  isSubmitLoading: boolean;
}

const TemplateEditComponent = ({
  updateData,
  onSubmit,
  isSubmitLoading,
}: ITemplateEditComponent) => {
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
  const [organogramChangeActionList, setOrganogramChangeActionList] = useState<
    IObject[]
  >([]);
  const [isNotEnamCommittee, setIsNotEnamCommittee] = useState<boolean>(false);
  const [maxNodeCode, setMaxNodeCode] = useState<number>(1);
  const [maxManpowerCode, setMaxManpowerCode] = useState<number>(1);

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
  }, []);

  useEffect(() => {
    if (!isObjectNull(updateData)) {
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
      setIsNotEnamCommittee(!updateData?.isEnamCommittee);
      reset({
        titleBn: updateData?.titleBn,
        titleEn: updateData?.titleEn,
        isEnamCommittee: updateData?.isEnamCommittee,
        organogramDate: updateData?.organogramDate,
        abbreviationDtoList: abbreviationist,
        mainActivitiesDtoList: updateData?.mainActivitiesDtoList,
        businessAllocationDtoList: updateData?.businessAllocationDtoList,
        attachmentDtoList: updateData?.attachmentDtoList,
        inventoryDtoList: updateData?.inventoryDtoList,
        organization: updateData?.organization,
        organogramChangeActionDtoList:
          updateData?.organogramChangeActionDtoList,
        miscellaneousPointDtoList: updateData?.miscellaneousPointDtoList,
        organogramNoteDto: updateData?.organogramNoteDto,
        templateOrganizationsDtoList: updateData?.templateOrganizationsDtoList,
      });
    }
  }, [updateData]);

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
        data?.organogramChangeActionDtoList?.length > 0
          ? data?.organogramChangeActionDtoList?.map((d) => ({
              titleEn: d?.titleEn,
              titleBn: d?.titleBn,
            }))
          : null;
    }

    const reqPayload = {
      ...data,
      titleBn: getValues("titleBn") || null,
      titleEn: getValues("titleEn") || null,
      maxNodeCode: maxNodeCode,
      maxManpowerCode: maxManpowerCode,
      organizationHeader: getValues("organizationHeader") || "",
      organizationHeaderMsc: getValues("organizationHeaderMsc") || "",
      organizationStructureDto: treeData,
      organogramNoteDto: data?.organogramNoteDto?.note
        ? {
            ...data?.organogramNoteDto,
            status: "ORGANOGRAM",
          }
        : null,
    };

    onSubmit(reqPayload);
    // console.log(reqPayload);
  };

  return (
    <div>
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
        <div className="row">
          <div className="col-md-6 col-12">
            <WorkSpaceComponent
              {...formProps}
              isRequired="প্রতিষ্ঠান বাছাই করুন"
              disabled
            />
          </div>
          {!isNotEnamCommittee && (
            <>
              <div className="col-md-6 col-12">
                <Input
                  label="অর্গানাইজেশন"
                  placeholder="অর্গানাইজেশন লিখুন"
                  defaultValue={
                    isObjectNull(updateData)
                      ? "Organization"
                      : updateData?.organizationHeader
                  }
                  registerProperty={{
                    ...register("organizationHeader"),
                  }}
                />
              </div>
              <div className="col-md-6 col-12">
                <Input
                  label="অর্গানাইজেশন মিসেলিনিয়াস"
                  placeholder="অর্গানাইজেশন মিসেলিনিয়াস লিখুন"
                  defaultValue={
                    !isObjectNull(updateData)
                      ? updateData?.organizationHeaderMsc
                      : ""
                  }
                  registerProperty={{
                    ...register("organizationHeaderMsc"),
                  }}
                />
              </div>
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
          <div className="col-md-6 col-12">
            <Autocomplete
              label="অর্গানোগ্রাম পরিবর্তনের কারণসমূহ"
              placeholder="অর্গানোগ্রাম পরিবর্তনের কারণসমূহ দিন"
              options={organogramChangeActionList || []}
              getOptionLabel={(op) => op?.titleBn}
              getOptionValue={(op) => op?.titleEn}
              isMulti
              closeMenuOnSelect={false}
              // isRequired="অর্গানোগ্রাম পরিবর্তনের কারণ সমূহ দিন"
              name="organogramChangeActionDtoList"
              control={control}
            />
          </div>
        </div>
      </div>

      <div className="border border-secondary mb-3">
        <OrganizationTemplateTree
          treeData={treeData}
          setTreeData={setTreeData}
          maxNodeCode={maxNodeCode}
          setMaxNodeCode={setMaxNodeCode}
          maxManpowerCode={maxManpowerCode}
          setMaxManpowerCode={setMaxManpowerCode}
          // isNotEnamCommittee={isNotEnamCommittee}
        />
      </div>
      <form onSubmit={handleSubmit(onFinalSubmit)} noValidate id="templateForm">
        <div className="row">
          <div className="col-md-6">
            <ActivitiesForm
              formProps={formProps}
              // isNotEnamCommittee={isNotEnamCommittee}
            />
          </div>
          <div className="col-md-6 mt-md-0 mt-3">
            <AllocationOfBusinessForm
              formProps={formProps}
              // isNotEnamCommittee={isNotEnamCommittee}
            />
          </div>
          <div className="col-12 mt-3">
            <EquipmentsForm
              formProps={formProps}
              // isNotEnamCommittee={isNotEnamCommittee}
            />
          </div>
          {/* <div className="col-md-6 mt-3">
            <Organizations
              formProps={formProps}
              notOrganizationData={notOrganizationData}
              setNotOrganizationData={setNotOrganizationData}
            />
          </div> */}
          <div className="col-12 mt-3">
            <AttachmentForm
              formProps={formProps}
              // isNotEnamCommittee={isNotEnamCommittee}
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
    </div>
  );
};

export default TemplateEditComponent;
