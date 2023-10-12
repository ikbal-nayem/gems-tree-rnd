import { Button, IconButton, Input, Modal, ModalBody } from "@gems/components";
import { COMMON_LABELS, numEnToBn } from "@gems/utils";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

const Form = ({ data, onOtherDataSet }) => {
	const [open, setOpen] = useState<boolean>(false);
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<any>({
		defaultValues: { activities: [""] },
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "activities",
	});

	useEffect(() => {
		data ? reset({ activities: data }) : append("");
	}, [data]);

	const onSubmit = (data) => {
		onOtherDataSet("activities", data.activities);
		setOpen(false);
	};

	return (
		<>
			<IconButton
				iconName="edit"
				iconSize={15}
				color="primary"
				onClick={() => setOpen(true)}
			/>
			<Modal
				isOpen={open}
				title="কার্যক্রম ফর্ম"
				handleClose={() => setOpen(false)}
			>
				<ModalBody>
					<div className="d-flex justify-content-between align-items-center">
						<h5 className="m-0">কার্যক্রম</h5>
						<IconButton
							iconName="add"
							color="primary"
							onClick={() => append("")}
						/>
					</div>
					<form onSubmit={handleSubmit(onSubmit)}>
						{fields.map((f, idx) => (
							<div key={idx} className="d-flex gap-3 mt-3">
								<Input
									placeholder={`কার্যক্রম ${numEnToBn(idx + 1)}`}
									isRequired
									noMargin
									autoFocus
									registerProperty={{
										...register(`activities.${idx}`, {
											required: "কার্যক্রম যুক্ত করুন",
										}),
									}}
									isError={!!errors?.activities?.[idx]}
									errorMessage={errors?.activities?.[idx]?.message as string}
								/>
								<IconButton
									iconName="delete"
									color="danger"
									isDisabled={fields.length === 1}
									iconSize={15}
									rounded={false}
									onClick={() => remove(idx)}
								/>
							</div>
						))}
						<Button color="primary" type="submit" className="ms-auto mt-5">
							{COMMON_LABELS.SAVE}
						</Button>
					</form>
				</ModalBody>
			</Modal>
		</>
	);
};

export default Form;
