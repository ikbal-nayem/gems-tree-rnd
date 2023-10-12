import { LABELS } from "@constants/common.constant";
import { Button, IconButton, Input, Modal, ModalBody } from "@gems/components";
import { COMMON_LABELS } from "@gems/utils";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

const Form = ({ onSubmit, isOpen, setOpen }) => {
	
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<any>({
		defaultValues: { transport: [{}], },
	});

	// const { fields, append, remove } = useFieldArray({
	// 	control,
	// 	name: "activities",
	// });

	// useEffect(() => {
	// 	data ? reset({ activities: data }) : append("");
	// }, [data]);

	// const onSubmit = (data) => {
	// 	onOtherDataSet("transport", data.transport);
	// 	setOpen(false);
	// };

	const {
		fields: transportFields,
		append: transportAppend,
		remove: transportRemove,
	} = useFieldArray({
		control,
		name: "transport",
	});

	return (
		<>
			<IconButton
				iconName="edit"
				iconSize={15}
				color="primary"
				onClick={() => setOpen(true)}
			/>
			<Modal
				isOpen={isOpen}
				title={LABELS.BN.EQUIPMENTS + ' যুক্ত করুন'} 
				handleClose={() => setOpen(false)}
			>
				<ModalBody>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="mt-3">
							<div className="d-flex justify-content-between">
								<h2 className="mb-0 mt-3"><u>পরিবহণ</u></h2>
								<div className="mt-2">
									<IconButton
										iconName="add"
										color="success"
										rounded={false}
										onClick={() => {
											transportAppend({});
										}}
									/>
								</div>
							</div>
							{transportFields.map((field, index) => (
								<div
									className="d-flex align-items-center gap-3 w-100"
									key={field?.id}
								>
									<div className="row w-100">
										<div className="col-md-6">
											<Input
												label="পরিবহণ"
												placeholder="পরিবহণ লিখুন"
												registerProperty={{
													...register(`transport.${index}.name`, {
														required: "পরিবহণ লিখুন",
													}),
												}}
												isRequired
												isError={!!errors?.transport?.[index]?.name}
												errorMessage={errors?.transport?.[index]?.name?.message as string}
											/>
										</div>
										<div className="col-md-6">
											<Input
												label="সংখ্যা"
												placeholder="সংখ্যা লিখুন"
												type="number"
												registerProperty={{
													...register(`transport.${index}.number`, {
														required: "সংখ্যা লিখুন",
													}),
												}}
												isRequired
												isError={!!errors?.transport?.[index]?.number}
												errorMessage={errors?.transport?.[index]?.number?.message as string}
											/>
										</div>
									</div>
									<div className="mt-2">
										<IconButton
											iconName="delete"
											color="danger"
											rounded={false}
											onClick={() => transportRemove(index)}
										/>
									</div>
								</div>
							))}
						</div>



						{/* {fields.map((f, idx) => (
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
						))} */}
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
