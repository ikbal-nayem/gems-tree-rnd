import { META_TYPE } from "@constants/common.constant";
import {
	Autocomplete,
	Checkbox,
	ContentPreloader,
	Icon,
	Modal,
	ModalBody,
	ModalHeader,
	NoData,
	topProgress,
} from "@gems/components";
import { IObject } from "@gems/utils";
import { CoreService } from "@services/api/Core.service";
import { OMSService } from "@services/api/OMS.service";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

const OrgFromOrgtype = ({ selectedOrgList, onOrgSelect, onMultiOrgSelect }) => {
	const [isOpen, setOpen] = useState<boolean>(false);
	const [orgTypes, setOrgTypes] = useState<IObject[]>();
	const [orgListFormType, setOrgListFromType] = useState<IObject[]>();
	const [isLoading, setLoading] = useState<boolean>(false);
	const orgType = useRef<IObject>();

	useEffect(() => {
		CoreService.getByMetaTypeList(META_TYPE.ORG_TYPE).then((resp) =>
			setOrgTypes(resp?.body)
		);
	}, []);

	const onModalClose = () => {
		setOpen(false);
		setOrgListFromType([]);
	};

	const onOrgTypeChoose = (ot: IObject) => {
		setOpen(true);
		topProgress.show();
		setLoading(true);
		orgType.current = ot;
		OMSService.getOrganizationByType(ot?.metaKey)
			.then((resp) => setOrgListFromType(resp?.body))
			.catch((err) => console.log(err.message))
			.finally(() => {
				topProgress.hide();
				setLoading(false);
			});
	};

	return (
		<>
			<Autocomplete
				placeholder="প্রতিষ্ঠান টাইপ"
				options={orgTypes || []}
				noMargin
				getOptionLabel={(op) => op.titleBn}
				getOptionValue={(op) => op?.metaKey}
				name="orgType"
				onChange={onOrgTypeChoose}
			/>
			<Modal noHeader isOpen={isOpen} scrollBody>
				<ModalHeader
					title={
						<div className="d-flex">
							{!!orgListFormType?.length && (
								<Checkbox
									noMargin
									checked={selectedOrgList?.length === orgListFormType?.length}
									onChange={(e) =>
										onMultiOrgSelect(orgListFormType, e.target.checked)
									}
								/>
							)}
							&nbsp;<h2 className="m-0">{orgType.current?.titleBn}</h2>
						</div>
					}
					handleClose={onModalClose}
				/>
				<ModalBody className="min-h-200px p-0">
					<ul className="list-group list-group-flush">
						{orgListFormType?.map((org) => {
							const isSelected =
								selectedOrgList?.findIndex((so) => so?.id === org?.id) >= 0;
							return (
								<li
									className={clsx(
										"list-group-item list-group-item-action cursor-pointer d-flex align-items-center gap-2",
										{
											"text-primary bg-light-primary": isSelected,
										}
									)}
									onClick={() => onOrgSelect(org, true)}
									key={org?.id}
								>
									{isSelected ? (
										<Icon icon="done" color="primary" />
									) : (
										<div className="mx-2" />
									)}
									{org?.nameBn}
								</li>
							);
						})}
					</ul>
					<ContentPreloader show={isLoading} />
					{!orgListFormType?.length && !isLoading && (
						<NoData details="কোনো অফিস পাওয়া যায়নি!" />
					)}
				</ModalBody>
			</Modal>
		</>
	);
};

export default OrgFromOrgtype;
