import { LABELS } from "@constants/common.constant";
import { Button, IconButton, Input, Modal, ModalBody, Separator } from "@gems/components";
import { COMMON_LABELS, numEnToBn } from "@gems/utils";
import { useFieldArray, useForm } from "react-hook-form";

const Form = ({ onSubmit, isOpen, setOpen }) => {

	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<any>({
		defaultValues: { transport: [{}], officeEquipments: [{}], },
	});

	const {
		fields: transportFields,
		append: transportAppend,
		remove: transportRemove,
	} = useFieldArray({
		control,
		name: "transport",
	});

	const {
		fields: oeFields,
		append: oeAppend,
		remove: oeRemove,
	} = useFieldArray({
		control,
		name: "officeEquipments",
	});

	const {
		fields: miscellFields,
		append: miscellAppend,
		remove: miscellRemove,
	} = useFieldArray({
		control,
		name: "miscellaneous",
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
				size="xl"
			>
				<ModalBody>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="row mt-3">

							<div className="col-12 col-md-6 px-5">
								<div className="d-flex justify-content-between">
									<h5 className="mb-0 mt-3"><u>পরিবহণ</u></h5>
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
													label={numEnToBn(index+1) + '. পরিবহণ'}
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

							<div className="col-12 col-md-6 border-start px-5">
								<div className="d-flex justify-content-between">
									<h5 className="mb-0 mt-3"><u>{'অফিস ' + LABELS.BN.EQUIPMENTS}</u></h5>
									<div className="mt-2">
										<IconButton
											iconName="add"
											color="success"
											rounded={false}
											onClick={() => {
												oeAppend({});
											}}
										/>
									</div>
								</div>
								{oeFields.map((field, index) => (
									<div
										className="d-flex align-items-center gap-3 w-100"
										key={field?.id}
									>
										<div className="row w-100">
											<div className="col-md-6">
												<Input
													label={numEnToBn(index+1) + '. ' + LABELS.BN.EQUIPMENTS}
													placeholder={LABELS.BN.EQUIPMENTS + " লিখুন"}
													registerProperty={{
														...register(`officeEquipments.${index}.name`, {
															required: LABELS.BN.EQUIPMENTS + " লিখুন",
														}),
													}}
													isRequired
													isError={!!errors?.officeEquipments?.[index]?.name}
													errorMessage={errors?.officeEquipments?.[index]?.name?.message as string}
												/>
											</div>
											<div className="col-md-6">
												<Input
													label="সংখ্যা"
													placeholder="সংখ্যা লিখুন"
													type="number"
													registerProperty={{
														...register(`officeEquipments.${index}.number`, {
															required: "সংখ্যা লিখুন",
														}),
													}}
													isRequired
													isError={!!errors?.officeEquipments?.[index]?.number}
													errorMessage={errors?.officeEquipments?.[index]?.number?.message as string}
												/>
											</div>
										</div>
										<div className="mt-2">
											<IconButton
												iconName="delete"
												color="danger"
												rounded={false}
												onClick={() => oeRemove(index)}
											/>
										</div>
									</div>
								))}
							</div>
							<Separator />
							<div className="col-12 px-5">
								<div className="d-flex justify-content-between">
									<h5 className="mb-0 mt-3"><u>{LABELS.BN.MISCELLANEOUS}</u></h5>
									<div className="mt-2">
										<IconButton
											iconName="add"
											color="success"
											rounded={false}
											onClick={() => {
												miscellAppend({});
											}}
										/>
									</div>
								</div>
								{miscellFields.map((field, index) => (
									<div
										className="d-flex align-items-center gap-3 w-100"
										key={field?.id}
									>
										<div className="row w-100">
											<div className="col-12">
												<Input
													label={numEnToBn(index+1) + '. ' + LABELS.BN.MISCELLANEOUS}
													placeholder={LABELS.BN.MISCELLANEOUS + " লিখুন"}
													registerProperty={{
														...register(`miscellaneous.${index}.name`, {
															required: LABELS.BN.EQUIPMENTS + " লিখুন",
														}),
													}}
													isRequired
													isError={!!errors?.officeEquipments?.[index]?.name}
													errorMessage={errors?.officeEquipments?.[index]?.name?.message as string}
												/>
											</div>
										</div>
										<div className="mt-2">
											<IconButton
												iconName="delete"
												color="danger"
												rounded={false}
												onClick={() => miscellRemove(index)}
											/>
										</div>
									</div>
								))}
							</div>

						</div>

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
