import { Button, Label, Separator } from "@gems/components";
import {
  COMMON_LABELS,
  IObject,
  generateUUID,
  isObjectNull,
} from "@gems/utils";
import OrganizationTemplateTree from "./Tree";
// import { orgData } from "./Tree/data2";
import AbbreviationList from "./components/AbbreviationList";
import ActivitiesList from "./components/ActivitesList";
import AllocationOfBusinessList from "./components/AllocationOfBusinessList";
import CheckListList from "./components/CheckListList";
import EquipmentsList from "./components/EquipmentsList";
import ManPowerList from "./components/ManPowerList";

interface ITemplateViewComponent {
  updateData?: IObject;
  isSubmitLoading: boolean;
}

const TemplateViewComponent = ({ updateData }: ITemplateViewComponent) => {
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
          <div className="col-md-6 col-12">
            <p className="fs-6 fw-bolder mb-0">শিরোনাম বাংলা: </p>
            <p>{updateData?.titleBn || COMMON_LABELS.NOT_ASSIGN}</p>
          </div>
          <div className="col-md-6 col-12">
            <p className="fs-6 fw-bolder mb-0">শিরোনাম ইংরেজি: </p>
            <p>{updateData?.titleEn || COMMON_LABELS.NOT_ASSIGN}</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <ActivitiesList data={updateData?.mainActivitiesDtoList || []} />
          <div className="mt-3">
            <CheckListList data={updateData?.attachmentDtoList || []} />
          </div>
          <div className="mt-3">
            <EquipmentsList
              data={updateData?.miscellaneousPointDtoList || []}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mt-md-0 mt-3">
            <AllocationOfBusinessList
              data={updateData?.businessAllocationDtoList || []}
            />
          </div>
          <div className="mt-3">
            <AbbreviationList data={updateData?.abbreviationDtoList || []} />
          </div>
          <div className="mt-3">
            <ManPowerList isLoading={false} data={null} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateViewComponent;
