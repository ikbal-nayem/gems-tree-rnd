import { LABELS } from "@constants/common.constant";
import { IconButton, Input, Separator } from "@gems/components";
import { numEnToBn } from "@gems/utils";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import "../style.scss";

const AllocationOfBusiness = ({ data, onOtherDataSet }) => {
  const {
    register,
    control,
    // formState: { errors },
    reset,
    getValues,
  } = useForm<any>({
    defaultValues: { allocationOfBusiness: [""] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "allocationOfBusiness",
  });

  useEffect(() => {
    data ? reset({ ...data }) : append("");
  }, [data]);

  const onDataChange = () => {
    onOtherDataSet("allocationOfBusiness", getValues()?.allocationOfBusiness);
  };
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.ALLOCATION_OF_BUSINESS}</h4>
        <IconButton iconName="add" color="primary" onClick={() => append("")} />
      </div>
      <Separator className="mt-1 mb-2" />
      {/* <Form data={data} onOtherDataSet={onOtherDataSet} /> */}
      <form>
        {fields.map((f, idx) => (
          <div key={idx} className="d-flex gap-3 mt-3">
            <Input
              placeholder={`বরাদ্দ ${numEnToBn(idx + 1)}`}
              // isRequired
              noMargin
              autoFocus
              registerProperty={{
                ...register(`allocationOfBusiness.${idx}`, {
                  // required: "বরাদ্দ যুক্ত করুন",
                  onChange: onDataChange,
                }),
              }}
              // isError={!!errors?.allocationOfBusiness?.[idx]}
              // errorMessage={
              //   errors?.allocationOfBusiness?.[idx]?.message as string
              // }
            />
            <IconButton
              iconName="delete"
              color="danger"
              // isDisabled={fields.length === 1}
              iconSize={15}
              rounded={false}
              onClick={() => {
                remove(idx);
                onDataChange();
              }}
            />
          </div>
        ))}
      </form>
    </div>
  );
};

export default AllocationOfBusiness;
