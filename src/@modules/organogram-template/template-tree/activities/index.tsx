import { Separator } from "@gems/components";
import Form from "./form";
import "../style.scss";
import { LABELS } from "@constants/common.constant";

const Activities = ({ data, onOtherDataSet }) => {
	return (
		<div className="card border p-3">
			<div className="card-head d-flex justify-content-between align-items-center">
				<h4 className="m-0">{LABELS.BN.MAIN_ACTIVITIES}</h4>
				<Form data={data} onOtherDataSet={onOtherDataSet} />
			</div>
			<Separator className="mt-1 mb-2" />
			<ol className="ol">
				{data?.map((d) => (
					<li key={d}>{d}</li>
				))}
			</ol>
		</div>
	);
};

export default Activities;
