import { IconButton, Input } from "@gems/components";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

const Form = ({ data, onOtherDataSet }) => {
  const {
    register,
    control,
    formState: { errors },
    getValues,
    reset,
  } = useForm<any>({
    defaultValues: { abbreviations: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "abbreviations",
  });

  useEffect(() => {
    data ? reset({ abbreviations: data }) : append("");
  }, [data]);

  const onDataChange = () => {
    onOtherDataSet("abbreviations", getValues()?.abbreviations);
  };

  return (
    <form>
      <div className="mt-3">
        <div className="d-flex justify-content-between">
          <h2 className="mb-0 mt-3">
            <u>সংক্ষিপ্তরূপ</u>
          </h2>
          <div className="mt-2">
            <IconButton
              iconName="add"
              color="success"
              rounded={false}
              onClick={() => {
                append({});
              }}
            />
          </div>
        </div>
        {fields.map((field, index) => (
          <div
            className="d-flex align-items-center gap-3 w-100"
            key={field?.id}
          >
            <div className="row w-100">
              <div className="col-md-6">
                <Input
                  label="সংক্ষিপ্তরূপ"
                  placeholder="সংক্ষিপ্তরূপ লিখুন"
                  registerProperty={{
                    ...register(`abbreviations.${index}.short`, {
                      required: "সংক্ষিপ্তরূপ লিখুন",
                      onChange: onDataChange,
                    }),
                  }}
                  isRequired
                  isError={!!errors?.abbreviations?.[index]?.short}
                  errorMessage={
                    errors?.abbreviations?.[index]?.short?.message as string
                  }
                />
              </div>
              <div className="col-md-6">
                <Input
                  label="বিস্তারিত"
                  placeholder="বিস্তারিত লিখুন"
                  registerProperty={{
                    ...register(`abbreviations.${index}.details`, {
                      required: "বিস্তারিত লিখুন",
                      onChange: onDataChange,
                    }),
                  }}
                  isRequired
                  isError={!!errors?.abbreviations?.[index]?.details}
                  errorMessage={
                    errors?.abbreviations?.[index]?.details?.message as string
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
                  onDataChange();
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};

export default Form;
