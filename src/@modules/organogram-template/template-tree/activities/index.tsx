import { Separator } from "@gems/components";
import Form from "./form";

const Activities = ({ data, onOtherDataSet }) => {
	return (
		<div className="card border p-3">
			<div className="card-head d-flex justify-content-between align-items-center">
				<h4 className="m-0">MAIN ACTIVITIES</h4>
				<Form data={data} onOtherDataSet={onOtherDataSet} />
			</div>
			<Separator className="mt-1 mb-2" />
			<ol>
				{data?.map((d) => (
					<li key={d}>{d}</li>
				))}
			</ol>
		</div>
	);
};

export default Activities;
