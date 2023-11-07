import { Icon } from "@gems/components";
import { numEnToBn } from "@gems/utils";

const OrgList = ({ selectedOrgList, onOrgCancle }) => {
	return (
		<div className="mt-3">
			<div className="d-flex flex-wrap gap-2">
				{selectedOrgList?.map((org, i) => (
					<div
						className="border rounded px-3 py-1 d-flex gap-2 justify-content-between align-items-center bg-light"
						key={org?.id}
					>
						{`${numEnToBn(i + 1)}. ${org?.nameBn}`}
						<Icon
							icon="close"
							size={15}
							color="danger"
							onClick={() => onOrgCancle(i)}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default OrgList;
