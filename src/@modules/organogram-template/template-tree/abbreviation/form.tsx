import { LABELS } from "@constants/common.constant";
import { Button, IconButton, Input, Modal, ModalBody } from "@gems/components";
import { COMMON_LABELS } from "@gems/utils";
import { useFieldArray, useForm } from "react-hook-form";

const Form = ({ onSubmit, isOpen, setOpen }) => {

	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<any>({
		defaultValues: { abbreviations: [{}], },
	});

	const {
		fields: abbreviationsFields,
		append: abbreviationsAppend,
		remove: abbreviationsRemove,
	} = useFieldArray({
		control,
		name: "abbreviations",
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
								<h2 className="mb-0 mt-3"><u>সংক্ষিপ্তরূপ</u></h2>
								<div className="mt-2">
									<IconButton
										iconName="add"
										color="success"
										rounded={false}
										onClick={() => {
											abbreviationsAppend({});
										}}
									/>
								</div>
							</div>
							{abbreviationsFields.map((field, index) => (
								<div
									className="d-flex align-items-center gap-3 w-100"
									key={field?.id}
								>
									<div className="row w-100">
										<div className="col-md-6">
											<Input
												label="সংক্ষিপ্তরূপ"
												placeholder="সংক্ষিপ্তরূপ লিখুন"
												registerProperty={{
													...register(`abbreviations.${index}.short`, {
														required: "সংক্ষিপ্তরূপ লিখুন",
													}),
												}}
												isRequired
												isError={!!errors?.abbreviations?.[index]?.short}
												errorMessage={errors?.abbreviations?.[index]?.short?.message as string}
											/>
										</div>
										<div className="col-md-6">
											<Input
												label="বিস্তারিত"
												placeholder="বিস্তারিত লিখুন"
												registerProperty={{
													...register(`abbreviations.${index}.details`, {
														required: "বিস্তারিত লিখুন",
													}),
												}}
												isRequired
												isError={!!errors?.abbreviations?.[index]?.details}
												errorMessage={errors?.abbreviations?.[index]?.details?.message as string}
											/>
										</div>
									</div>
									<div className="mt-2">
										<IconButton
											iconName="delete"
											color="danger"
											rounded={false}
											onClick={() => abbreviationsRemove(index)}
										/>
									</div>
								</div>
							))}
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
