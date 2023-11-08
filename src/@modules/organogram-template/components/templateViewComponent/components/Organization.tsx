import { LABELS } from "@constants/common.constant";
import { Separator } from "@gems/components";
import { numEnToBn } from "@gems/utils";

const OrgList = ({ data }) => {
	return (
		<div className="card border p-3">
			<div className="card-head d-flex justify-content-between align-items-center">
				<h4 className="m-0">{LABELS.BN.ORGANIZATION}</h4>
			</div>
			<Separator className="mt-1" />
			<div className="d-flex flex-wrap gap-2">
				{data?.map((org, i) => (
					<div
						className="border rounded px-3 py-1 d-flex gap-2 bg-light"
						key={org?.id}
					>
						{`${numEnToBn(i + 1)}. ${org?.nameBn}`}
					</div>
				))}
			</div>
		</div>
	);
};

export default OrgList;
