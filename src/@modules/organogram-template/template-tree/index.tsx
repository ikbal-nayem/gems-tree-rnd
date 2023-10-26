import { Button, Input, Separator, toast } from "@gems/components";
import { COMMON_LABELS, IObject, generateUUID } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useState } from "react";
import { useForm } from "react-hook-form";
import OrganizationTemplateTree from "./Tree";
// import { orgData } from "./Tree/data2";
import AbbreviationForm from "./components/AbbreviationForm";
import ActivitiesForm from "./components/ActivitesForm";
import AllocationOfBusinessForm from "./components/AllocationOfBusinessForm";
import CheckListForm from "./components/CheckListForm";
import EquipmentsForm from "./components/EquipmentsForm";
import { bnCheck, enCheck } from "utility/checkValidation";

const TemplateTree = () => {
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<IObject>({
    id: generateUUID(),
    titleBn: "হালনাগাদ করে শুরু করুন",
    children: [],
  });
  const formProps = useForm<any>({
    defaultValues: {
      abbreviationDtoList: [],
      mainActivitiesDtoList: [],
      businessAllocationDtoList: [],
      attachmentDtoList: [],
      inventoryDtoList: [],
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formProps;

  const onFinalSubmit = (data) => {
    const reqPayload = {
      ...data,
      organizationStructureDto: treeData,
    };
    console.log("data", reqPayload);
    setIsSubmitLoading(false);

    OMSService.templateCreate(reqPayload)
      .then((res) => {
        toast.success(res?.message);
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setIsSubmitLoading(false));
  };

  // console.log("tree", treeData);

  return (
    <div>
      <div className="border border-secondary mb-3">
        <OrganizationTemplateTree
          treeData={treeData}
          setTreeData={setTreeData}
        />
      </div>
      <form onSubmit={handleSubmit(onFinalSubmit)} noValidate>
        <div className="card col-md-6 border p-3 mb-4">
          <h4 className="m-0">টেমপ্লেট</h4>
          <Separator className="mt-1 mb-2" />
          <div className="row">
            <div className="col-md-6 col-12">
              <Input
                label="শিরোনাম বাংলা"
                placeholder="শিরোনাম বাংলা লিখুন"
                isRequired
                registerProperty={{
                  ...register("titleBn", {
                    required: "শিরোনাম বাংলা লিখুন",
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
                    validate: enCheck,
                  }),
                }}
                isError={!!errors?.titleEn}
                errorMessage={errors?.titleEn?.message as string}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <ActivitiesForm formProps={formProps} />
            <div className="mt-3">
              <AllocationOfBusinessForm formProps={formProps} />
            </div>
            <div className="mt-3">
              <CheckListForm formProps={formProps} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mt-md-0 mt-3">
              <EquipmentsForm formProps={formProps} />
            </div>
            <div className="mt-3">
              <AbbreviationForm formProps={formProps} />
            </div>
          </div>
        </div>
        <div className="d-flex gap-3 justify-content-center mt-5">
          <Button color="primary" type="submit" isLoading={isSubmitLoading}>
            {COMMON_LABELS.SAVE}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TemplateTree;
