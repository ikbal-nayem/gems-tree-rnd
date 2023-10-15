import { Separator } from "@gems/components";
import Form from "./form";
import "../style.scss";
import { LABELS } from "@constants/common.constant";
import { useState } from "react";

const Abbreviations = ({ data, onOtherDataSet }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.ABBREVIATIONS}</h4>
      </div>
      <Separator className="mt-1 mb-2" />
      {/* <ol className="ol">
				{data?.abbreviations?.map((d) => (
					<li key={d}>{d.short + '  = ' + d.details}</li>
				))}
			</ol> */}
      <Form data={data} onOtherDataSet={onOtherDataSet} />
    </div>
  );
};

export default Abbreviations;
