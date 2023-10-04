import { Button, Input, Modal, ModalBody, ModalFooter } from "@gems/components";
import { COMMON_LABELS } from "@gems/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface INodeForm {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data) => void;
	updateData?: { item: any; idx?: number };
	isSubmitting?: boolean;
}

const NodeForm = ({
	isOpen,
	onClose,
	onSubmit,
	isSubmitting,
	updateData,
}: INodeForm) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		if (isOpen && updateData?.item) {
			reset({ ...updateData?.item });
		} else reset({});
	}, [isOpen, updateData, reset]);

	return (
		<Modal title="Node" isOpen={isOpen} handleClose={onClose} holdOn size="lg" >
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<ModalBody>
					<div className="row">
						<div className="col-md-6 col-12">
							<Input
								label="বাংলা নাম"
								placeholder="বাংলা নাম লিখুন"
								isRequired
								registerProperty={{
									...register("titleBn", {
										required: "বাংলা নাম লিখুন",
									}),
								}}
								isError={!!errors?.titleBn}
								errorMessage={errors?.titleBn?.message as string}
							/>
						</div>
						<div className="col-md-6 col-12">
							<Input
								label="ইংরেজি নাম"
								placeholder="ইংরেজি নাম লিখুন"
								isRequired
								registerProperty={{
									...register("titleEn", {
										required: "ইংরেজি নাম লিখুন",
									}),
								}}
								isError={!!errors?.titleEn}
								errorMessage={errors?.titleEn?.message as string}
							/>
						</div>
					</div>
				</ModalBody>

				<ModalFooter>
					<div className="d-flex gap-3 justify-content-end">
						<Button
							size="sm"
							color="secondary"
							onClick={onClose}
							isDisabled={isSubmitting}
						>
							{COMMON_LABELS.CANCEL}
						</Button>
						<Button
							size="sm"
							color="primary"
							type="submit"
							isLoading={isSubmitting}
						>
							{COMMON_LABELS.SAVE}
						</Button>
					</div>
				</ModalFooter>
			</form>
		</Modal>
	);
};
export default NodeForm;
