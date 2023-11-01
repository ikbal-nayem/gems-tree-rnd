import { LABELS } from "@constants/common.constant";
import { IconButton, Input, Separator } from "@gems/components";
import { numEnToBn } from "@gems/utils";
import { useFieldArray } from "react-hook-form";
import "../style.scss";

interface IAllocationOfBusinessForm {
  formProps: any;
}

const AllocationOfBusinessForm = ({ formProps }: IAllocationOfBusinessForm) => {
  const {
    register,
    control,
    formState: { errors },
  } = formProps;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "businessAllocationDtoList",
  });
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.ALLOCATION_OF_BUSINESS}</h4>
        <IconButton iconName="add" color="primary" onClick={() => append("")} />
      </div>
      <Separator className="mt-1 mb-2" />
      <div>
        {fields.map((f, idx) => (
          <div key={idx} className="d-flex gap-3 mt-3">
            <Input
              placeholder={`বরাদ্দ ${numEnToBn(idx + 1)}`}
              // isRequired
              noMargin
              autoFocus
              registerProperty={{
                ...register(
                  `businessAllocationDtoList.${idx}.businessOfAllocation`,
                  {
                    required: "বরাদ্দ " + numEnToBn(idx + 1) + " লিখুন",
                  }
                ),
              }}
              isError={
                !!errors?.businessAllocationDtoList?.[idx].businessOfAllocation
              }
              errorMessage={
                errors?.businessAllocationDtoList?.[idx].businessOfAllocation
                  ?.message as string
              }
            />
            <IconButton
              iconName="delete"
              color="danger"
              // isDisabled={fields.length === 1}
              iconSize={15}
              rounded={false}
              onClick={() => {
                remove(idx);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllocationOfBusinessForm;
