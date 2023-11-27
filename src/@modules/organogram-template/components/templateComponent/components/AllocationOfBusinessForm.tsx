import { LABELS } from "@constants/common.constant";
import { IconButton, Input, Label, Separator } from "@gems/components";
import { numEnToBn } from "@gems/utils";
import { useFieldArray } from "react-hook-form";
import { enCheck } from "utility/checkValidation";

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
        {fields.map((f, idx) => {
          const label = "বরাদ্দ";
          const labelBn = label + " (বাংলা)";
          const labelEn = label + " (ইংরেজি)";
          return (
            <div
              key={idx}
              className="d-flex align-items-top gap-3 mt-1 w-100 border rounded px-3 my-1 bg-gray-100"
            >
              <div className={idx < 1 ? "mt-8" : "mt-2"}>
                <Label> {numEnToBn(idx + 1) + "।"} </Label>
              </div>
              <div className="row w-100">
                {/* <div className="col-xl-6 col-12">
                  <Input
                    label={idx < 1 ? labelBn : ""}
                    placeholder={labelBn + " লিখুন"}
                    isRequired
                    noMargin
                    autoFocus
                    registerProperty={{
                      ...register(
                        `businessAllocationDtoList.${idx}.businessOfAllocationBn`,
                        {
                          required: "বরাদ্দ " + numEnToBn(idx + 1) + " লিখুন",
                        }
                      ),
                    }}
                    isError={
                      !!errors?.businessAllocationDtoList?.[idx]
                        ?.businessOfAllocationBn
                    }
                  />
                </div> */}
                <div className="col-12 mt-1 mt-xl-0">
                  <Input
                    label={idx < 1 ? labelEn : ""}
                    placeholder={labelEn + " লিখুন"}
                    isRequired
                    noMargin
                    autoFocus
                    registerProperty={{
                      ...register(
                        `businessAllocationDtoList.${idx}.businessOfAllocationEn`,
                        {
                          required: "বরাদ্দ " + numEnToBn(idx + 1) + " লিখুন",
                          validate: enCheck,
                        }
                      ),
                    }}
                    isError={
                      !!errors?.businessAllocationDtoList?.[idx]
                        ?.businessOfAllocationEn
                    }
                  />
                </div>
              </div>
              <div className={idx < 1 ? "mt-6" : ""}>
                <IconButton
                  iconName="delete"
                  color="danger"
                  iconSize={15}
                  rounded={false}
                  onClick={() => {
                    remove(idx);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllocationOfBusinessForm;
