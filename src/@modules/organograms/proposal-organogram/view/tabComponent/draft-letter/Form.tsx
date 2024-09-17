import { Button, IconButton, Label } from "@gems/components";
import { TextEditor } from "@gems/editor";
import { ckToPdfMake, generatePDF, IObject, isObjectNull } from "@gems/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface IForm {
  data: IObject;
  onSubmit: (data) => void;
  isSubmitLoading?: boolean;
}
const Form = ({ data, onSubmit, isSubmitLoading }: IForm) => {
  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!isObjectNull(data))
      reset({
        ...data,
      });
    else reset({});
  }, [data, reset]);

  const onMenualDownload = () => {
    const docs = ckToPdfMake(watch("draftDoc"));
    generatePDF({ content: docs }, { action: "open" });
  };

  return (
    <div className="card border p-3">
      <div className="d-flex justify-content-between mb-2">
        <Label isRequired>খসড়া পত্র</Label>
        <IconButton
          iconName="file_download"
          iconVariant="outlined"
          color="primary"
          hoverTitle={"খসড়া পত্র ডাউনলোড করুন"}
          onClick={onMenualDownload}
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextEditor
          name="draftDoc"
          // minHeight={400}
          placeholder={`খসড়া পত্র লিখুন...`}
          isRequired="খসড়া পত্র লিখুন"
          control={control}
          isError={!!errors?.draftDoc}
          errorMessage={errors?.draftDoc?.message as string}
        />
        <div className="d-flex gap-3 justify-content-center mt-3">
          <Button color="primary" type="submit" isLoading={isSubmitLoading}>
            {Object.keys(data)?.length > 0 ? "হালনাগাদ করুন" : "সংরক্ষণ করুন"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Form;
