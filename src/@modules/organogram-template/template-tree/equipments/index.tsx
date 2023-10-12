import { Separator } from "@gems/components";
import Form from "./form";
import "../style.scss";
import { LABELS } from "@constants/common.constant";
import { useState } from "react";

const Equipments = ({ data, onOtherDataSet }) => {
	const [open, setOpen] = useState<boolean>(false);
	const onSubmit = (formData) => {
		onOtherDataSet("transport", formData?.transport);
		console.log(formData);
		setOpen(false);
	};

	return (
		<div className="card border p-3">
			<div className="card-head d-flex justify-content-between align-items-center">
				<h4 className="m-0">{LABELS.BN.EQUIPMENTS}</h4>
				<Form onSubmit={onSubmit} isOpen={open} setOpen={setOpen}/>
			</div>
			<Separator className="mt-1 mb-2" />
			<ol className="ol">
				{data?.transport?.map((d) => (
					<li key={d}>{d.name + ' X' + d.number}</li>
				))}
			</ol>
		</div>
	);
};

export default Equipments;
