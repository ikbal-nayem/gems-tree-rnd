import { Button, Separator } from "@gems/components";
import {
  COMMON_LABELS,
  IObject,
  generateUUID,
  isObjectNull,
} from "@gems/utils";
import OrganizationTemplateTree from "./Tree";
// import { orgData } from "./Tree/data2";
import AbbreviationForm from "./components/AbbreviationForm";
import ActivitiesForm from "./components/ActivitesForm";
import AllocationOfBusinessForm from "./components/AllocationOfBusinessForm";
import CheckListForm from "./components/CheckListForm";
import EquipmentsForm from "./components/EquipmentsForm";

interface ITemplateViewComponent {
  updateData?: IObject;
  isSubmitLoading: boolean;
}

const TemplateViewComponent = ({
  updateData,
  isSubmitLoading,
}: ITemplateViewComponent) => {
  const treeData =
    !isObjectNull(updateData) &&
    !isObjectNull(updateData?.organizationStructureDto)
      ? updateData?.organizationStructureDto
      : {
          id: generateUUID(),
          titleBn: "হালনাগাদ করে শুরু করুন",
          children: [],
        };

  return (
    <div>
      <div className="border border-secondary mb-3">
        <OrganizationTemplateTree treeData={treeData} />
      </div>
      <div className="card col-md-6 border p-3 mb-4">
        <h4 className="m-0">টেমপ্লেট</h4>
        <Separator className="mt-1 mb-2" />
        <div className="row">
          <div className="col-md-6 col-12"></div>
          <div className="col-md-6 col-12"></div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <ActivitiesForm data={updateData} />

          <div className="mt-3">
            <CheckListForm data={updateData} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mt-md-0 mt-3">
            <AllocationOfBusinessForm data={updateData} />
          </div>
          <div className="mt-3">
            <AbbreviationForm data={updateData} />
          </div>
        </div>
        <div className="mt-3">
          <EquipmentsForm data={updateData} />
        </div>
      </div>
      <div className="d-flex gap-3 justify-content-center mt-5">
        <Button color="primary" type="submit" isLoading={isSubmitLoading}>
          {!isObjectNull(updateData)
            ? COMMON_LABELS.UPDATE
            : COMMON_LABELS.SAVE}
        </Button>
      </div>
    </div>
  );
};

export default TemplateViewComponent;
