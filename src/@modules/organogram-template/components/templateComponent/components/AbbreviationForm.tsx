import { LABELS } from "@constants/common.constant";
import { IconButton, Input, Separator, Textarea } from "@gems/components";
import { useFieldArray } from "react-hook-form";

interface IAbbreviationForm {
  formProps: any;
}

const AbbreviationForm = ({ formProps }: IAbbreviationForm) => {
  const {
    register,
    control,
    formState: { errors },
  } = formProps;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "abbreviationDtoList",
  });
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.ABBREVIATIONS}</h4>
        <IconButton
          iconName="add"
          color="primary"
          onClick={() => {
            append("");
          }}
        />
      </div>
      <Separator className="mt-1 mb-2" />
      <div className="mt-3">
        {fields.map((field, index) => (
          <div
            className="d-flex align-items-top gap-3 mt-3 w-100 border rounded pt-3 px-3 my-2 bg-gray-100 pb-3 pb-xl-0"
            key={field?.id}
          >
            <div className="row w-100">
              <div className="col-md-6">
                <Input
                  label="সংক্ষিপ্তরূপ"
                  placeholder="সংক্ষিপ্তরূপ লিখুন"
                  registerProperty={{
                    ...register(`abbreviationDtoList.${index}.shortForm`, {
                      required: " ",
                      // onChange: onDataChange,
                    }),
                  }}
                  isError={!!errors?.abbreviationDtoList?.[index]?.shortForm}
                  errorMessage={
                    errors?.abbreviationDtoList?.[index]?.shortForm
                      ?.message as string
                  }
                />
              </div>
              <div className="col-md-6">
                <Textarea
                  label="বিস্তারিত"
                  placeholder="বিস্তারিত লিখুন"
                  registerProperty={{
                    ...register(`abbreviationDtoList.${index}.fullForm`, {
                      required: " ",
                      // onChange: onDataChange,
                    }),
                  }}
                  isError={!!errors?.abbreviationDtoList?.[index]?.fullForm}
                  errorMessage={
                    errors?.abbreviationDtoList?.[index]?.fullForm
                      ?.message as string
                  }
                />
              </div>
            </div>
            <div className="mt-2">
              <IconButton
                iconName="delete"
                color="danger"
                rounded={false}
                onClick={() => {
                  remove(index);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AbbreviationForm;
