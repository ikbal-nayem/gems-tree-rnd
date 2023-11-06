import { Autocomplete, Icon, Modal } from "@gems/components";
import clsx from "clsx";
import { useState } from "react";

const dummy = [
	{
		id: "c5a1a872-5b7b-4645-87ce-a3e1d985d02e",
		parent: {
			id: "1ae4014e-afca-42cb-9211-dd179392639c",
			nameEn: "Central Government",
			nameBn: "কেন্দ্রীয় সরকার",
			officeType: "INSTITUTION_TYPE_GOVERNMENT",
			orgType: "ORG_TYPE_CENTRAL_GOVERNMENT",
			address: "Dhaka, Bangladesh",
			locationId: "1f5e315a-1965-4726-87b8-d597eed4488d",
			email: "info@gems.gov.bd",
			isActive: true,
		},
		nameEn: "Cabinet Division",
		nameBn: "মন্ত্রিপরিষদ বিভাগ",
		officeType: "INSTITUTION_TYPE_GOVERNMENT",
		officeTypeDTO: {
			id: "6871a00a-c85f-4398-94f7-a3241bfc4ef0",
			titleEn: "Government",
			titleBn: "সরকারি",
			metaTypeEn: "INSTITUTION_TYPE",
			metaTypeBn: "প্রতিষ্ঠানের ধরন",
			metaKey: "INSTITUTION_TYPE_GOVERNMENT",
			isDefault: false,
			serial: 1,
			isActive: true,
		},
		orgType: "ORG_TYPE_MINISTRY",
		orgTypeDTO: {
			id: "f7eb9b72-a824-4af2-acb1-1595d85cd913",
			titleEn: "Ministry",
			titleBn: "মন্ত্রণালয়",
			metaTypeEn: "ORG_TYPE",
			metaTypeBn: "সংস্থার ধরন",
			metaKey: "ORG_TYPE_MINISTRY",
			isDefault: false,
			serial: 1,
			isActive: true,
		},
		address: "DHAKA",
		locationId: "1f5e315a-1965-4726-87b8-d597eed4488d",
		location: {
			id: "1f5e315a-1965-4726-87b8-d597eed4488d",
			titleEn: "Dhaka",
			titleBn: "ঢাকা",
			type: "LOCATION_DISTRICT",
			typeTitleEn: "District",
			typeTitleBn: "জেলা",
			parentId: "c4805f16-0ac8-4b89-ad91-a4a0aac77b61",
			parentTitleEn: "Dhaka",
			parentTitleBn: "ঢাকা",
			parentType: "LOCATION_DIVISION",
			parentTypeTitleEn: "Division",
			parentTypeTitleBn: "বিভাগ",
			classKey: "LOCATION_CLASS_KA",
			classTitleEn: "Ka",
			classTitleBn: "ক",
			isDeleted: false,
		},
		email: "no@email.found",
		isActive: true,
	},
	{
		id: "25d6ded8-6b59-43bd-9466-8901db88341e",
		parent: {
			id: "1ae4014e-afca-42cb-9211-dd179392639c",
			nameEn: "Central Government",
			nameBn: "কেন্দ্রীয় সরকার",
			officeType: "INSTITUTION_TYPE_GOVERNMENT",
			orgType: "ORG_TYPE_CENTRAL_GOVERNMENT",
			address: "Dhaka, Bangladesh",
			locationId: "1f5e315a-1965-4726-87b8-d597eed4488d",
			email: "info@gems.gov.bd",
			isActive: true,
		},
		nameEn: "Prime Minister'S Office",
		nameBn: "প্রধানমন্ত্রীর কার্যালয়",
		officeType: "INSTITUTION_TYPE_GOVERNMENT",
		officeTypeDTO: {
			id: "6871a00a-c85f-4398-94f7-a3241bfc4ef0",
			titleEn: "Government",
			titleBn: "সরকারি",
			metaTypeEn: "INSTITUTION_TYPE",
			metaTypeBn: "প্রতিষ্ঠানের ধরন",
			metaKey: "INSTITUTION_TYPE_GOVERNMENT",
			isDefault: false,
			serial: 1,
			isActive: true,
		},
		orgType: "ORG_TYPE_MINISTRY",
		orgTypeDTO: {
			id: "f7eb9b72-a824-4af2-acb1-1595d85cd913",
			titleEn: "Ministry",
			titleBn: "মন্ত্রণালয়",
			metaTypeEn: "ORG_TYPE",
			metaTypeBn: "সংস্থার ধরন",
			metaKey: "ORG_TYPE_MINISTRY",
			isDefault: false,
			serial: 1,
			isActive: true,
		},
		address: "DHAKA",
		locationId: "1f5e315a-1965-4726-87b8-d597eed4488d",
		location: {
			id: "1f5e315a-1965-4726-87b8-d597eed4488d",
			titleEn: "Dhaka",
			titleBn: "ঢাকা",
			type: "LOCATION_DISTRICT",
			typeTitleEn: "District",
			typeTitleBn: "জেলা",
			parentId: "c4805f16-0ac8-4b89-ad91-a4a0aac77b61",
			parentTitleEn: "Dhaka",
			parentTitleBn: "ঢাকা",
			parentType: "LOCATION_DIVISION",
			parentTypeTitleEn: "Division",
			parentTypeTitleBn: "বিভাগ",
			classKey: "LOCATION_CLASS_KA",
			classTitleEn: "Ka",
			classTitleBn: "ক",
			isDeleted: false,
		},
		email: "no@email.found",
		isActive: true,
	},
	{
		id: "4e81c84d-d352-4e35-9981-55d09c832346",
		parent: {
			id: "1ae4014e-afca-42cb-9211-dd179392639c",
			nameEn: "Central Government",
			nameBn: "কেন্দ্রীয় সরকার",
			officeType: "INSTITUTION_TYPE_GOVERNMENT",
			orgType: "ORG_TYPE_CENTRAL_GOVERNMENT",
			address: "Dhaka, Bangladesh",
			locationId: "1f5e315a-1965-4726-87b8-d597eed4488d",
			email: "info@gems.gov.bd",
			isActive: true,
		},
		nameEn: "Ministry Of Environment, Forest And Climate Change",
		nameBn: "পরিবেশ, বন ও জলবায়ু পরিবর্তন মন্ত্রণালয়",
		officeType: "INSTITUTION_TYPE_GOVERNMENT",
		officeTypeDTO: {
			id: "6871a00a-c85f-4398-94f7-a3241bfc4ef0",
			titleEn: "Government",
			titleBn: "সরকারি",
			metaTypeEn: "INSTITUTION_TYPE",
			metaTypeBn: "প্রতিষ্ঠানের ধরন",
			metaKey: "INSTITUTION_TYPE_GOVERNMENT",
			isDefault: false,
			serial: 1,
			isActive: true,
		},
		orgType: "ORG_TYPE_MINISTRY",
		orgTypeDTO: {
			id: "f7eb9b72-a824-4af2-acb1-1595d85cd913",
			titleEn: "Ministry",
			titleBn: "মন্ত্রণালয়",
			metaTypeEn: "ORG_TYPE",
			metaTypeBn: "সংস্থার ধরন",
			metaKey: "ORG_TYPE_MINISTRY",
			isDefault: false,
			serial: 1,
			isActive: true,
		},
		address: "DHAKA",
		locationId: "1f5e315a-1965-4726-87b8-d597eed4488d",
		location: {
			id: "1f5e315a-1965-4726-87b8-d597eed4488d",
			titleEn: "Dhaka",
			titleBn: "ঢাকা",
			type: "LOCATION_DISTRICT",
			typeTitleEn: "District",
			typeTitleBn: "জেলা",
			parentId: "c4805f16-0ac8-4b89-ad91-a4a0aac77b61",
			parentTitleEn: "Dhaka",
			parentTitleBn: "ঢাকা",
			parentType: "LOCATION_DIVISION",
			parentTypeTitleEn: "Division",
			parentTypeTitleBn: "বিভাগ",
			classKey: "LOCATION_CLASS_KA",
			classTitleEn: "Ka",
			classTitleBn: "ক",
			isDeleted: false,
		},
		email: "no@email.found",
		isActive: true,
	},
	{
		id: "a0f5b7fa-fb6c-4b0c-a874-440be90c648a",
		parent: {
			id: "1ae4014e-afca-42cb-9211-dd179392639c",
			nameEn: "Central Government",
			nameBn: "কেন্দ্রীয় সরকার",
			officeType: "INSTITUTION_TYPE_GOVERNMENT",
			orgType: "ORG_TYPE_CENTRAL_GOVERNMENT",
			address: "Dhaka, Bangladesh",
			locationId: "1f5e315a-1965-4726-87b8-d597eed4488d",
			email: "info@gems.gov.bd",
			isActive: true,
		},
		nameEn: "Ministry Of Agriculture",
		nameBn: "কৃষি মন্ত্রণালয়",
		officeType: "INSTITUTION_TYPE_GOVERNMENT",
		officeTypeDTO: {
			id: "6871a00a-c85f-4398-94f7-a3241bfc4ef0",
			titleEn: "Government",
			titleBn: "সরকারি",
			metaTypeEn: "INSTITUTION_TYPE",
			metaTypeBn: "প্রতিষ্ঠানের ধরন",
			metaKey: "INSTITUTION_TYPE_GOVERNMENT",
			isDefault: false,
			serial: 1,
			isActive: true,
		},
		orgType: "ORG_TYPE_MINISTRY",
		orgTypeDTO: {
			id: "f7eb9b72-a824-4af2-acb1-1595d85cd913",
			titleEn: "Ministry",
			titleBn: "মন্ত্রণালয়",
			metaTypeEn: "ORG_TYPE",
			metaTypeBn: "সংস্থার ধরন",
			metaKey: "ORG_TYPE_MINISTRY",
			isDefault: false,
			serial: 1,
			isActive: true,
		},
		address: "DHAKA",
		locationId: "1f5e315a-1965-4726-87b8-d597eed4488d",
		location: {
			id: "1f5e315a-1965-4726-87b8-d597eed4488d",
			titleEn: "Dhaka",
			titleBn: "ঢাকা",
			type: "LOCATION_DISTRICT",
			typeTitleEn: "District",
			typeTitleBn: "জেলা",
			parentId: "c4805f16-0ac8-4b89-ad91-a4a0aac77b61",
			parentTitleEn: "Dhaka",
			parentTitleBn: "ঢাকা",
			parentType: "LOCATION_DIVISION",
			parentTypeTitleEn: "Division",
			parentTypeTitleBn: "বিভাগ",
			classKey: "LOCATION_CLASS_KA",
			classTitleEn: "Ka",
			classTitleBn: "ক",
			isDeleted: false,
		},
		email: "no@email.found",
		isActive: true,
	},
	{
		id: "e56785ed-b9df-47c1-a161-ed1d7f1f0509",
		parent: {
			id: "1ae4014e-afca-42cb-9211-dd179392639c",
			nameEn: "Central Government",
			nameBn: "কেন্দ্রীয় সরকার",
			officeType: "INSTITUTION_TYPE_GOVERNMENT",
			orgType: "ORG_TYPE_CENTRAL_GOVERNMENT",
			address: "Dhaka, Bangladesh",
			locationId: "1f5e315a-1965-4726-87b8-d597eed4488d",
			email: "info@gems.gov.bd",
			isActive: true,
		},
		nameEn: "Finance Division",
		nameBn: "অর্থ বিভাগ",
		officeType: "INSTITUTION_TYPE_GOVERNMENT",
		officeTypeDTO: {
			id: "6871a00a-c85f-4398-94f7-a3241bfc4ef0",
			titleEn: "Government",
			titleBn: "সরকারি",
			metaTypeEn: "INSTITUTION_TYPE",
			metaTypeBn: "প্রতিষ্ঠানের ধরন",
			metaKey: "INSTITUTION_TYPE_GOVERNMENT",
			isDefault: false,
			serial: 1,
			isActive: true,
		},
		orgType: "ORG_TYPE_MINISTRY",
		orgTypeDTO: {
			id: "f7eb9b72-a824-4af2-acb1-1595d85cd913",
			titleEn: "Ministry",
			titleBn: "মন্ত্রণালয়",
			metaTypeEn: "ORG_TYPE",
			metaTypeBn: "সংস্থার ধরন",
			metaKey: "ORG_TYPE_MINISTRY",
			isDefault: false,
			serial: 1,
			isActive: true,
		},
		address: "DHAKA",
		locationId: "1f5e315a-1965-4726-87b8-d597eed4488d",
		location: {
			id: "1f5e315a-1965-4726-87b8-d597eed4488d",
			titleEn: "Dhaka",
			titleBn: "ঢাকা",
			type: "LOCATION_DISTRICT",
			typeTitleEn: "District",
			typeTitleBn: "জেলা",
			parentId: "c4805f16-0ac8-4b89-ad91-a4a0aac77b61",
			parentTitleEn: "Dhaka",
			parentTitleBn: "ঢাকা",
			parentType: "LOCATION_DIVISION",
			parentTypeTitleEn: "Division",
			parentTypeTitleBn: "বিভাগ",
			classKey: "LOCATION_CLASS_KA",
			classTitleEn: "Ka",
			classTitleBn: "ক",
			isDeleted: false,
		},
		email: "no@email.found",
		isActive: true,
	},
];

const OrgFromOrgtype = ({ selectedOrgList, onOrgSelect }) => {
	const [isOpen, setOpen] = useState<boolean>(false);

	return (
		<>
			<Autocomplete
				placeholder="প্রতিষ্ঠান টাইপ"
				options={[]}
				noMargin
				getOptionLabel={(op) => op.nameBn}
				getOptionValue={(op) => op?.id}
				name="postDTO"
			/>

			<Modal isOpen={isOpen} handleClose={() => setOpen(false)}>
				<ul className="list-group list-group-flush">
					{dummy.map((org) => {
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
			</Modal>
		</>
	);
};

export default OrgFromOrgtype;
