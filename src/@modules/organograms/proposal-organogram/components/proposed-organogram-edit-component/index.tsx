import { Autocomplete, Button, Input } from "@gems/components";
import {
  COMMON_LABELS,
  IObject,
  generateUUID,
  isListNull,
  isObjectNull,
  notNullOrUndefined,
} from "@gems/utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import OrganizationTemplateTree from "./tree";
// import { orgData } from "./Tree/data2";
import { ProposalService } from "@services/api/Proposal.service";
import { focusById } from "utility/utils";
import AbbreviationForm from "./components/AbbreviationForm";
import ActivitiesForm from "./components/ActivitesForm";
import AllocationOfBusinessForm from "./components/AllocationOfBusinessForm";
import AttachmentForm from "./components/AttachmentForm";
import AttachOrganizationForm from "./components/AttachOrganizationForm";
import EquipmentsForm from "./components/EquipmentsForm";
import NotesForm from "./components/NotesForm";
import SummaryOfManpowerForm from "./components/SummaryOfManpowerForm";
import WorkSpaceComponent from "./components/WorkSpaceComponent";

const payload = {
  meta: {
    page: 0,
    limit: 50,
    sort: [
      {
        field: "createdOn",
        order: "desc",
      },
    ],
  },
  body: {},
};
interface IProposalOrganogramEditComponent {
  updateData?: IObject;
  onSubmit: (data) => void;
  isSubmitLoading: boolean;
}

const ProposalOrganogramEditComponent = ({
  updateData,
  onSubmit,
  isSubmitLoading,
}: IProposalOrganogramEditComponent) => {
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
    ProposalService.FETCH.organogramChangeTypeList(payload)
      .then((res) => {
        setOrganogramChangeActionList(res?.body || []);
      })
      .catch((err) => console.log(err?.message));
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
        isInventoryOthers: updateData?.isInventoryOthers || false,
        inventoryOthersObject: updateData?.inventoryOthersObject || "",
        summaryOfManPowerObject: updateData?.summaryOfManPowerObject || "",
        isSummaryOfManPowerObject:
          updateData?.isSummaryOfManPowerObject || false,
        isEnamCommittee: updateData?.isEnamCommittee,
        organogramDate: updateData?.organogramDate,
        abbreviationDtoList: abbreviationist,
        mainActivitiesDtoList: updateData?.mainActivitiesDtoList,
        businessAllocationDtoList: updateData?.businessAllocationDtoList,
        attachmentDtoList: updateData?.attachmentDtoList,
        attachedOrganizationDtoList:
          updateData?.attachedOrganizationDtoList || [],
        inventoryDtoList: updateData?.inventoryDtoList,
        organization: updateData?.organization,
        organogramChangeActionDtoList:
          updateData?.organogramChangeActionDtoList,
        miscellaneousPointDtoList: updateData?.miscellaneousPointDtoList,
        organogramNoteDto: updateData?.organogramNoteDto,
        templateOrganizationsDtoList: updateData?.templateOrganizationsDtoList,
      });
      if (updateData?.maxNodeCode) setMaxNodeCode(updateData?.maxNodeCode);
      if (updateData?.maxManpowerCode)
        setMaxManpowerCode(updateData?.maxManpowerCode);
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

    if (!isListNull(data.organogramChangeActionDtoList)) {
      data.organogramChangeActionDtoList =
        data?.organogramChangeActionDtoList?.map((d) => ({
          titleEn: d?.titleEn,
          titleBn: d?.titleBn,
          organogramChangeTypeId: d?.organogramChangeTypeId || d?.id || "",
          organizationOrganogramId: updateData?.id || "",
        }));
    }

    const reqPayload = {
      ...data,
      titleBn: getValues("titleBn") || null,
      titleEn: getValues("titleEn") || null,
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
          {/* <div className="col-md-6 col-12" id="orgDateBlock">
            <DateInput
              label="অর্গানোগ্রাম তারিখ"
              isRequired
              name="organogramDate"
              control={control}
              onChange={(e) => setValue("chosenDate", e.value)}
              blockFutureDate
              isError={!!errors?.organogramDate}
            />
          </div> */}
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
          organogramData={{
            organizationOrganogramId: updateData?.id || "",
            organizationId: updateData?.organization?.id || "",
            organogramDate: updateData?.organogramDate || "",
          }}
        />
      </div>
      <form onSubmit={handleSubmit(onFinalSubmit)} noValidate id="templateForm">
        <div className="row">
          <div className="col-md-6">
            <ActivitiesForm
              formProps={formProps}
              updateData={updateData?.mainActivitiesDtoList || []}
              // isNotEnamCommittee={isNotEnamCommittee}
            />
          </div>
          <div className="col-md-6 mt-md-0 mt-3">
            <AllocationOfBusinessForm
              formProps={formProps}
              updateData={updateData?.businessAllocationDtoList || []}
              // isNotEnamCommittee={isNotEnamCommittee}
            />
          </div>
          <div className="col-12 mt-3">
            <EquipmentsForm
              formProps={formProps}
              updateInventoryData={updateData?.inventoryDtoList || []}
              updateMiscellaneousPointData={
                updateData?.miscellaneousPointDtoList || []
              }
              // isNotEnamCommittee={isNotEnamCommittee}
            />
          </div>
          <div className="col-12 mt-3">
            <SummaryOfManpowerForm formProps={formProps} />
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
          <div className="col-12 mt-3">
            <AttachOrganizationForm
              formProps={formProps}
              isNotEnamCommittee={isNotEnamCommittee}
              updateData={updateData?.attachedOrganizationDtoList || []}
            />
          </div>
          <div className="col-md-6 mt-3">
            <AbbreviationForm
              formProps={formProps}
              updateData={updateData?.abbreviationDtoList}
            />
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

export default ProposalOrganogramEditComponent;
