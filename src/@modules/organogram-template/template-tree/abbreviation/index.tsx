import { LABELS } from "@constants/common.constant";
import { IconButton, Input, Separator } from "@gems/components";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import "../style.scss";

const Abbreviations = ({ data, onOtherDataSet }) => {
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
    data ? reset({ ...data?.abbreviations }) : append("");
  }, []);

  const onDataChange = () => {
    onOtherDataSet("abbreviations", getValues()?.abbreviations);
  };

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
      {/* <Form data={data} onOtherDataSet={onOtherDataSet} /> */}
      <form>
        <div className="mt-3">
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
                        // required: "সংক্ষিপ্তরূপ লিখুন",
                        onChange: onDataChange,
                      }),
                    }}
                    // isRequired
                    // isError={!!errors?.abbreviations?.[index]?.short}
                    // errorMessage={
                    //   errors?.abbreviations?.[index]?.short?.message as string
                    // }
                  />
                </div>
                <div className="col-md-6">
                  <Input
                    label="বিস্তারিত"
                    placeholder="বিস্তারিত লিখুন"
                    registerProperty={{
                      ...register(`abbreviations.${index}.details`, {
                        // required: "বিস্তারিত লিখুন",
                        onChange: onDataChange,
                      }),
                    }}
                    // isRequired
                    // isError={!!errors?.abbreviations?.[index]?.details}
                    // errorMessage={
                    //   errors?.abbreviations?.[index]?.details?.message as string
                    // }
                  />
                </div>
              </div>
              <div className="mt-2">
                <IconButton
                  iconName="delete"
                  color="danger"
                  // isDisabled={fields.length === 1}
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
    </div>
  );
};

export default Abbreviations;
