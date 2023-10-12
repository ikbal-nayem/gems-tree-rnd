import React, { useState } from "react";
import OrganizationTemplateTree from "./Tree";
import { COMMON_LABELS, IObject } from "@gems/utils";
import { orgData } from "./Tree/data";
import { Button } from "@gems/components";
import Activities from "./activities";
import Equipments from "./equipments";

const TemplateTree = () => {
	const [treeData, setTreeData] = useState<IObject>(orgData);
	const [data, setData] = useState<any>();

	const onOtherDataSet = (title: string, value) => {
		setData({ ...data, [title]: value });
	};

	const onFinalSubmit = () => {
		console.log("ddddddd", treeData);
	};

	return (
		<div>
			<OrganizationTemplateTree treeData={treeData} setTreeData={setTreeData} />
			<div className="row">
				<div className="col-4">
					<Activities data={data?.activities} onOtherDataSet={onOtherDataSet} />
				</div>
				<div className="col-8">
					<Equipments data={data} onOtherDataSet={onOtherDataSet} />
				</div>
			</div>
			<div className="d-flex gap-3 justify-content-center mt-5">
				<Button color="primary" onClick={onFinalSubmit}>
					{COMMON_LABELS.SAVE}
				</Button>
			</div>
		</div>
	);
};

export default TemplateTree;
