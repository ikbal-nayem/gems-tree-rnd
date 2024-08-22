import { LABELS } from "@constants/common.constant";
import { Checkbox, Separator } from "@gems/components";
import { TextEditor } from "@gems/editor";

interface IForm {
  formProps: any;
}

const SummaryOfManpowerForm = ({ formProps }: IForm) => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = formProps;

  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <h4 className="m-0 me-2">{LABELS.BN.SUMMARY_MANPOWER}</h4>
          <Checkbox
            noMargin
            label="অন্যান্য"
            registerProperty={{
              ...register(`isSummaryOfManPowerObject`),
            }}
          />
        </div>
      </div>
      <Separator className="mt-1 mb-2" />
      {watch("isSummaryOfManPowerObject") && (
        <div>
          <TextEditor
            name="summaryOfManPowerObject"
            // label=""
            // minHeight={400}
            placeholder={`জনশক্তির সারসংক্ষেপ লিখুন...`}
            isRequired
            control={control}
            isError={!!errors?.summaryOfManPowerObject}
            errorMessage={errors?.summaryOfManPowerObject?.message as string}
          />
        </div>
      )}
    </div>
  );
};

export default SummaryOfManpowerForm;
