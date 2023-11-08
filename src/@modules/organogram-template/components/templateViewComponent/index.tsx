import { Button, Icon, Label, Separator } from "@gems/components";
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
import EquipmentsList from "./components/EquipmentsList";
import ManPowerList from "./components/ManPowerList";
import {
  LABELS,
  COMMON_LABELS as COMN_LABELS,
} from "@constants/common.constant";
import OrgList from "./components/Organization";

interface ITemplateViewComponent {
	updateData?: IObject;
	inventoryData?: IObject[];
	manpowerData?: IObject;
	isSubmitLoading?: boolean;
}

const TemplateViewComponent = ({
	updateData,
	inventoryData,
	manpowerData,
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

	const langEn = false;
	const LABEL = langEn ? LABELS.EN : LABELS.BN;
	return (
		<div>
			<div className="border border-secondary mb-3">
				<OrganizationTemplateTree treeData={treeData} />
			</div>
			<div className="card col-md-6 border p-3 mb-4">
				<div className="row">
					<div className="col-6">
						<Label className="fs-3 fw-bolder mb-0">টেমপ্লেট</Label>
					</div>
					<div className="col-6 d-flex justify-content-end">
						<Label className="mb-0 text-info">
							<span className="mb-0 fw-bold">{LABEL.VERSION}: </span>
							{updateData?.versionBn || COMMON_LABELS.NOT_ASSIGN}
						</Label>
					</div>
				</div>

				<Separator className="mt-1 mb-2" />
				<div className="row">
					<div className="col-md-6 col-12">
						<p className="fs-6 fw-bolder mb-0">{LABEL.TEMPLATE_TITLE_BN}: </p>
						<p>{updateData?.titleBn || COMMON_LABELS.NOT_ASSIGN}</p>
					</div>
					<div className="col-md-6 col-12">
						<p className="fs-6 fw-bolder mb-0">{LABEL.TEMPLATE_TITLE_EN}: </p>
						<p>{updateData?.titleEn || COMMON_LABELS.NOT_ASSIGN}</p>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-md-6">
					<ActivitiesList data={updateData?.mainActivitiesDtoList || []} />

					<div className="mt-3">
						<EquipmentsList
							data={updateData?.miscellaneousPointDtoList || []}
							inventoryData={inventoryData || []}
						/>
					</div>
					<div className="mt-3">
						<OrgList data={updateData?.templateOrganizationsDtoList || []} />
						{/* <CheckListList data={updateData?.attachmentDtoList || []} /> */}
					</div>
				</div>
				<div className="col-md-6">
					<div className="mt-md-0 mt-3">
						<AllocationOfBusinessList
							data={updateData?.businessAllocationDtoList || []}
						/>
					</div>
					<div className="mt-3">
						<ManPowerList isLoading={false} data={manpowerData} />
					</div>
					<div className="mt-3">
						<AbbreviationList data={updateData?.abbreviationDtoList || []} />
					</div>
				</div>
			</div>
			<div className="d-flex justify-content-center gap-5 mt-12">
				<Button className="rounded-pill" color="success" onClick={() => null}>
					<Icon icon="check" className="fw-bold me-2" />
					<span> {COMN_LABELS.APPROVE} </span>
				</Button>
				<Button className="rounded-pill" color="danger" onClick={() => null}>
					<Icon icon="reply" className="fw-bold me-2" />
					<span> {COMN_LABELS.SEND_BACK} </span>
				</Button>
			</div>
		</div>
	);
};

export default TemplateViewComponent;
