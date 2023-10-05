import { Button, Input, Modal, ModalBody, ModalFooter } from "@gems/components";
import { COMMON_LABELS, IObject, isObjectNull } from "@gems/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface INodeForm {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data) => void;
	updateData?: IObject;
}

const NodeForm = ({ isOpen, onClose, onSubmit, updateData }: INodeForm) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		if (isOpen && !isObjectNull(updateData)) {
			reset({ ...updateData });
		} else reset({});
	}, [isOpen, updateData, reset]);

	return (
		<Modal title="Node" isOpen={isOpen} handleClose={onClose} holdOn size="lg">
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<ModalBody>
					<div className="row">
						<div className="col-md-6 col-12">
							<Input
								label="বাংলা নাম"
								placeholder="বাংলা নাম লিখুন"
								isRequired
								registerProperty={{
									...register("nameBn", {
										required: "বাংলা নাম লিখুন",
									}),
								}}
								isError={!!errors?.nameBn}
								errorMessage={errors?.nameBn?.message as string}
							/>
						</div>
						<div className="col-md-6 col-12">
							<Input
								label="ইংরেজি নাম"
								placeholder="ইংরেজি নাম লিখুন"
								isRequired
								registerProperty={{
									...register("nameEn", {
										required: "ইংরেজি নাম লিখুন",
									}),
								}}
								isError={!!errors?.nameEn}
								errorMessage={errors?.nameEn?.message as string}
							/>
						</div>
					</div>
				</ModalBody>

				<ModalFooter>
					<div className="d-flex gap-3 justify-content-end">
						<Button color="secondary" onClick={onClose}>
							{COMMON_LABELS.CANCEL}
						</Button>
						<Button color="primary" type="submit">
							{COMMON_LABELS.SAVE}
						</Button>
					</div>
				</ModalFooter>
			</form>
		</Modal>
	);
};
export default NodeForm;
