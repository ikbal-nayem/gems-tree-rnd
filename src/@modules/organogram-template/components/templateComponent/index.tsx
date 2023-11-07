import { Button, Input, Separator } from "@gems/components";
import {
  COMMON_LABELS,
  IObject,
  generateUUID,
  isObjectNull,
} from "@gems/utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import OrganizationTemplateTree from "./Tree";
// import { orgData } from "./Tree/data2";
import { bnCheck, enCheck } from "../../../../utility/checkValidation";
import AbbreviationForm from "./components/AbbreviationForm";
import ActivitiesForm from "./components/ActivitesForm";
import AllocationOfBusinessForm from "./components/AllocationOfBusinessForm";
import EquipmentsForm from "./components/EquipmentsForm";
import { OMSService } from "@services/api/OMS.service";
import Organizations from "./components/organization";

interface ITemplateComponent {
	updateData?: IObject;
	onSubmit: (data) => void;
	isSubmitLoading: boolean;
}

const TemplateComponent = ({
	updateData,
	onSubmit,
	isSubmitLoading,
}: ITemplateComponent) => {
	const [treeData, setTreeData] = useState<IObject>(
		!isObjectNull(updateData) &&
			!isObjectNull(updateData?.organizationStructureDto)
			? updateData?.organizationStructureDto
			: {
					id: generateUUID(),
					titleBn: "অর্গানোগ্রাম তৈরি শুরু করুন",
					children: [],
			  }
	);
	const [duplicateTitleBnDitected, setDuplicateTitleBnDitected] =
		useState<boolean>(false);
	const [duplicateTitleEnDitected, setDuplicateTitleEnDitected] =
		useState<boolean>(false);
	const formProps = useForm<any>({
		defaultValues: {
			abbreviationDtoList: [],
			mainActivitiesDtoList: [],
			businessAllocationDtoList: [],
			attachmentDtoList: [],
			inventoryDtoList: [],
			miscellaneousPointDtoList: [],
		},
	});
	const {
		register,
		handleSubmit,
		reset,
		setError,
		clearErrors,
		formState: { errors },
	} = formProps;

	useEffect(() => {
		if (!isObjectNull(updateData)) {
			reset({
				titleBn: updateData?.titleBn,
				titleEn: updateData?.titleEn,
				versionBn: updateData?.versionBn,
				versionEn: updateData?.versionEn,
				abbreviationDtoList: updateData?.abbreviationDtoList,
				mainActivitiesDtoList: updateData?.mainActivitiesDtoList,
				businessAllocationDtoList: updateData?.businessAllocationDtoList,
				attachmentDtoList: updateData?.attachmentDtoList,
				inventoryDtoList: updateData?.inventoryDtoList,
				miscellaneousPointDtoList: updateData?.miscellaneousPointDtoList,
			});
		}
	}, [updateData]);

	const duplicateTitleCheck = (title, isEn: boolean) => {
		const field = isEn ? "titleEn" : "titleBn";
		OMSService.duplicateTemplateTitleCheck(title, isEn)
			.then((res) => {
				if (res?.body) {
					const msg = (isEn ? "ইংরেজি" : "বাংলা") + " শিরোনামটি অনন্য নয় !";

					setError(field, {
						type: "manaul",
						message: msg,
					});

					isEn
						? setDuplicateTitleEnDitected(true)
						: setDuplicateTitleBnDitected(true);
				} else {
					clearErrors(field);
					isEn
						? setDuplicateTitleEnDitected(false)
						: setDuplicateTitleBnDitected(false);
				}
			})
			.catch((e) => console.log(e.message));
	};

	const uniqueCheck = (list, listName: string) => {
		let isUnique = true;
		switch (listName) {
			case "inventoryDtoList":
				for (let i = 0; 0 < list.length && i < list.length; i++) {
					for (let j = 0; j < list.length; j++) {
						if (i !== j && list[i]?.item?.id === list[j]?.item?.id) {
							isUnique = false;
							setError(`inventoryDtoList.[${j}].item`, {
								type: "manaul",
								message:
									"'" + list[j]?.item?.itemTitleBn + "' আইটেমটি অনন্য নয় !",
							});
						}
					}
				}
				break;
			default:
		}
		return isUnique;
	};

	const onFinalSubmit = (data) => {
		if (!uniqueCheck(data.inventoryDtoList, "inventoryDtoList")) return;
		if (isObjectNull(updateData)) {
			if (duplicateTitleBnDitected || duplicateTitleEnDitected) return;
		}

		const reqPayload = {
			...data,
			organizationStructureDto: treeData,
		};
		console.log(
			" ======================= TEST PASSED !!! =========================="
		);

		onSubmit(reqPayload);
	};

	return (
		<div>
			<div className="border border-secondary mb-3">
				<OrganizationTemplateTree
					treeData={treeData}
					setTreeData={setTreeData}
				/>
			</div>
			<form onSubmit={handleSubmit(onFinalSubmit)} noValidate>
				<div className="card col-md-12 border p-3 mb-4">
					<h4 className="m-0">টেমপ্লেট</h4>
					<Separator className="mt-1 mb-2" />
					<div className="row">
						<div className="col-md-6 col-12">
							<Input
								label="শিরোনাম বাংলা"
								placeholder="বাংলায় শিরোনাম লিখুন"
								isRequired
								registerProperty={{
									...register("titleBn", {
										required: " ",
										onChange: (e) => duplicateTitleCheck(e.target.value, false),
										validate: bnCheck,
									}),
								}}
								isError={!!errors?.titleBn}
								errorMessage={errors?.titleBn?.message as string}
							/>
						</div>

						<div className="col-md-6 col-12">
							<Input
								label="শিরোনাম ইংরেজি"
								placeholder="ইংরেজিতে শিরোনাম লিখুন"
								isRequired
								registerProperty={{
									...register("titleEn", {
										required: " ",
										onChange: (e) => duplicateTitleCheck(e.target.value, true),
										validate: enCheck,
									}),
								}}
								isError={!!errors?.titleEn}
								errorMessage={errors?.titleEn?.message as string}
							/>
						</div>
            <div className="col-md-6 col-12">
              <Input
                label="ভার্শন (বাংলা)"
                placeholder="বাংলায় ভার্শন লিখুন"
                isRequired
                registerProperty={{
                  ...register("versionBn", {
                    required: " ",
                    validate: bnCheck,
                  }),
                }}
                isError={!!errors?.versionBn}
                errorMessage={errors?.versionBn?.message as string}
              />
            </div>
            <div className="col-md-6 col-12">
              <Input
                label="ভার্শন (ইংরেজি)"
                placeholder="ইংরেজিতে ভার্শন লিখুন"
                isRequired
                registerProperty={{
                  ...register("versionEn", {
                    required: " ",
                    validate: enCheck,
                  }),
                }}
                isError={!!errors?.versionEn}
                errorMessage={errors?.versionEn?.message as string}
              />
            </div>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6">
						<ActivitiesForm formProps={formProps} />
					</div>
					<div className="col-md-6 mt-md-0 mt-3">
						<AllocationOfBusinessForm formProps={formProps} />
					</div>
					<div className="col-12 mt-3">
						<EquipmentsForm formProps={formProps} />
					</div>
					<div className="col-md-6 mt-3">
						{/* <CheckListForm formProps={formProps} /> */}
						<Organizations formProps={formProps} />
					</div>
					<div className="col-md-6 mt-3">
						<AbbreviationForm formProps={formProps} />
					</div>
				</div>
				<div className="d-flex gap-3 justify-content-center mt-5">
					<Button color="primary" type="submit" isLoading={isSubmitLoading}>
						{!isObjectNull(updateData)
							? COMMON_LABELS.UPDATE
							: COMMON_LABELS.SAVE}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default TemplateComponent;
