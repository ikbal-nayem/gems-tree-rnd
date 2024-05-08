import { LABELS } from "@constants/common.constant";
import { IconButton, Separator } from "@gems/components";
import { TextEditor } from "@gems/editor";
import { useEffect, useState } from "react";

interface IForm {
  formProps: any;
  isNotEnamCommittee: boolean;
}

const SummaryOfManpowerForm = ({ formProps, isNotEnamCommittee }: IForm) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = formProps;

  const [isOpen, setIsOpen] = useState<boolean>(
    watch("summaryOfManpowerDetails") ? true : false
  );

  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0 me-2">{LABELS.BN.SUMMARY_MANPOWER}</h4>

        <IconButton
          iconName={isOpen ? "remove" : "add"}
          color="primary"
          isDisabled={!!watch("summaryOfManpowerDetails")}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <Separator className="mt-1 mb-2" />
      {isOpen && (
        <div>
          <TextEditor
            name="summaryOfManpowerDetails"
            // label=""
            // minHeight={400}
            placeholder={`জনশক্তির সারসংক্ষেপ লিখুন...`}
            isRequired
            control={control}
            isError={!!errors?.summaryOfManpowerDetails}
            errorMessage={errors?.summaryOfManpowerDetails?.message as string}
          />
        </div>
      )}
    </div>
  );
};

export default SummaryOfManpowerForm;
