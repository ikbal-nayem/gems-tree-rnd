import { Button, Input, Separator, toast } from "@gems/components";
import { COMMON_LABELS, IObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useState } from "react";
import { useForm } from "react-hook-form";
import OrganizationTemplateTree from "./Tree";
import { orgData } from "./Tree/data";
import AbbreviationForm from "./components/AbbreviationForm";
import ActivitiesForm from "./components/ActivitesForm";
import AllocationOfBusinessForm from "./components/AllocationOfBusinessForm";
import CheckListForm from "./components/CheckListForm";
import EquipmentsForm from "./components/EquipmentsForm";

const TemplateTree = () => {
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<IObject>(orgData);
  const formProps = useForm<any>({
    defaultValues: {
      abbreviations: [],
      activities: [],
      allocationOfBusiness: [],
      checkList: [],
      inventory: [],
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
      tree: treeData,
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
      <OrganizationTemplateTree treeData={treeData} setTreeData={setTreeData} />
      <form onSubmit={handleSubmit(onFinalSubmit)} noValidate>
        <div className="card col-md-6 border p-3 mb-4">
          <h4 className="m-0">টেমপ্লেট</h4>
          <Separator className="mt-1 mb-2" />
          <Input
            placeholder="টেমপ্লেট শিরোনাম"
            label="শিরোনাম"
            isRequired
            noMargin
            autoFocus
            registerProperty={{
              ...register("title", {
                required: "টেমপ্লেট শিরোনাম যুক্ত করুন",
                // onChange: onDataChange,
              }),
            }}
            isError={!!errors?.title}
            // errorMessage={errors?.title?.message as string}
          />
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
            <EquipmentsForm formProps={formProps} />
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
