import { Icon } from "@gems/components";
import { numEnToBn } from "@gems/utils";

const OrgList = ({ selectedOrgList, onOrgCancle }) => {
	return (
		<div>
			<ul className="list-group list-group-flush">
				{selectedOrgList?.map((org, i) => (
					<li
						className="list-group-item d-flex justify-content-between align-items-center"
						key={org?.id}
					>
						{`${numEnToBn(i + 1)}. ${org?.nameBn}`}
						<Icon
							icon="close"
							size={15}
							color="danger"
							onClick={() => onOrgCancle(i)}
						/>
					</li>
				))}
			</ul>
		</div>
	);
};

export default OrgList;
