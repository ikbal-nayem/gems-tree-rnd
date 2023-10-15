import { Separator } from "@gems/components";
import Form from "./form";
import "../style.scss";
import { LABELS } from "@constants/common.constant";
import { useState } from "react";

const Equipments = ({ data, onOtherDataSet }) => {
	const [open, setOpen] = useState<boolean>(false);
	const onSubmit = (formData) => {
		onOtherDataSet("equipment", formData);
		// console.log(formData);
		setOpen(false);
	};

	return (
		<div className="card border p-3">
			<div className="card-head d-flex justify-content-between align-items-center">
				<h4 className="m-0">{LABELS.BN.EQUIPMENTS}</h4>
				<Form onSubmit={onSubmit} isOpen={open} setOpen={setOpen} />
			</div>
			<Separator className="mt-1 mb-2" />
			<div className="row">
				<div className="col-6">
					<h4 className="mb-0 mt-3"><u>পরিবহণ</u></h4>
					<ol className="ol">
						{data?.equipment?.transport?.map((d) => (
							<li key={d}>{d.name + ' X' + d.number}</li>
						))}
					</ol>
				</div>

				<div className="col-6">
					<h4 className="mb-0 mt-3"><u>{'অফিস ' + LABELS.BN.EQUIPMENTS}</u></h4>
					<ol className="ol">
						{data?.equipment?.officeEquipments?.map((eq) => (
							<li key={eq}>{eq.name + ' X' + eq.number}</li>
						))}
					</ol>
				</div>
				
				<Separator />

				<div className="col-12">
					<h4 className="mb-0 mt-3"><u>{LABELS.BN.MISCELLANEOUS}</u></h4>
					<ol className="ol">
						{data?.equipment?.miscellaneous?.map((m) => (
							<li key={m}>{m.name}</li>
						))}
					</ol>
				</div>

				<div className="col-6">

				</div>
			</div>

		</div>
	);
};

export default Equipments;
