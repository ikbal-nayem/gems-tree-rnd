import { ACLWrapper, Button, Icon, Label, Switch } from "@gems/components";
import {
  COMMON_LABELS,
  IObject,
  ROLES,
  generateUUID,
  isObjectNull,
} from "@gems/utils";
import OrganizationTemplateTree from "./Tree";
// import { orgData } from "./Tree/data2";
import {
  COMMON_LABELS as COMN_LABELS,
  LABELS,
} from "@constants/common.constant";
import { useState } from "react";
import AbbreviationList from "./components/AbbreviationList";
import ActivitiesList from "./components/ActivitesList";
import AllocationOfBusinessList from "./components/AllocationOfBusinessList";
import EquipmentsList from "./components/EquipmentsList";
import ManPowerList from "./components/ManPowerList";
import OrgList from "./components/Organization";

interface ITemplateViewComponent {
  updateData: IObject;
  inventoryData?: IObject[];
  manpowerData?: IObject;
  isSubmitLoading?: boolean;
  organogramView?: boolean;
}

const TemplateViewComponent = ({
  updateData,
  inventoryData,
  manpowerData,
  organogramView = false,
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

  const [langEn, setLangEn] = useState<boolean>(false);

  const switchLang = () => {
    setLangEn(!langEn);
  };
  const LABEL = langEn ? LABELS.EN : LABELS.BN;
  return (
    <div>
      <div className="card col-12 border p-3 mb-4">
        <div className="d-flex justify-content-center fs-3 fw-bolder mb-0">
          {(organogramView
            ? langEn
              ? updateData?.organization?.nameEn
              : updateData?.organization?.nameBn
            : langEn
            ? updateData?.titleEn
            : updateData?.titleBn) || COMMON_LABELS.NOT_ASSIGN}
        </div>
        <div className="d-flex justify-content-center fw-bolder mb-0">
          <Label className="mb-0 text-info">
            <span className="mb-0 fw-bold">{LABEL.VERSION}: </span>
            {(langEn ? updateData?.versionEn : updateData?.versionBn) ||
              COMMON_LABELS.NOT_ASSIGN}
          </Label>
        </div>
        <div className="position-absolute p-6" style={{ top: 0, right: 0 }}>
          <Switch
            label={langEn ? "বাংলা" : "English"}
            onChange={switchLang}
            className="gap-4 fw-bold text-gray-800 cursor-pointer"
            noMargin
          />
        </div>
      </div>
      <div className="border border-secondary mb-3">
        <OrganizationTemplateTree treeData={treeData} langEn={langEn} />
      </div>
      <div className="row">
        <div className="col-md-6">
          <ActivitiesList
            data={updateData?.mainActivitiesDtoList || []}
            langEn={langEn}
          />

          <div className="mt-3">
            <EquipmentsList
              data={updateData?.miscellaneousPointDtoList || []}
              inventoryData={inventoryData || []}
              langEn={langEn}
            />
          </div>
          {!organogramView && (
            <div className="mt-3">
              <OrgList
                data={updateData?.templateOrganizationsDtoList || []}
                langEn={langEn}
              />
              {/* <CheckListList data={updateData?.attachmentDtoList || []} /> */}
            </div>
          )}
        </div>
        <div className="col-md-6">
          <div className="mt-md-0 mt-3">
            <AllocationOfBusinessList
              data={updateData?.businessAllocationDtoList || []}
              langEn={langEn}
            />
          </div>
          <div className="mt-3">
            <ManPowerList
              isLoading={false}
              data={manpowerData}
              langEn={langEn}
            />
          </div>
          <div className="mt-3">
            <AbbreviationList
              data={updateData?.abbreviationDtoList || []}
              langEn={langEn}
            />
          </div>
        </div>
      </div>

      {organogramView ? (
        <ACLWrapper visibleToRoles={[ROLES.OFFICE_ADMIN, ROLES.APPROVER]}>
          <div className="d-flex justify-content-center gap-8 mt-12">
            <Button
              className="rounded-pill fw-bold pe-8"
              color="danger"
              onClick={() => null}
            >
              <Icon icon="arrow_back" className="fw-bold me-2" />
              <span> {COMN_LABELS.SEND_BACK} </span>
            </Button>

            <Button
              className="rounded-pill px-8 fw-bold"
              color="success"
              onClick={() => null}
            >
              <span> {COMN_LABELS.APPROVE} </span>
              <Icon icon="check" size={15} className="fw-bold ms-1" />
            </Button>
          </div>
        </ACLWrapper>
      ) : (
        <div className="d-flex justify-content-center gap-8 mt-12">
          <Button
            className="rounded-pill px-8 fw-bold"
            color="success"
            onClick={() => null}
          >
            <span> {COMN_LABELS.CONFIRM} </span>
            <Icon icon="check" size={15} className="fw-bold ms-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TemplateViewComponent;
