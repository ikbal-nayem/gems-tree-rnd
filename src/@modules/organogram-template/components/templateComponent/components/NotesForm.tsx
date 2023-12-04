import { LABELS } from "@constants/common.constant";
import { IconButton, Label, Separator, Textarea } from "@gems/components";
import { notNullOrUndefined, numEnToBn } from "@gems/utils";
import { useFieldArray } from "react-hook-form";

interface INotesForm {
  formProps: any;
}
const NotesForm = ({ formProps }: INotesForm) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = formProps;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "organogramNoteDtoList",
  });
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.NOTES}</h4>
        <IconButton iconName="add" color="primary" onClick={() => append("")} />
      </div>
      <Separator className="mt-1 mb-2" />
      <div>
        {fields.map((f, idx) => {
          return (
            <div
              key={idx}
              className="d-flex align-items-top gap-3 mt-1 w-100 border rounded px-3 my-1 bg-gray-100"
            >
              <div className={idx < 1 ? "mt-8" : "mt-2"}>
                <Label> {numEnToBn(idx + 1) + "।"} </Label>
              </div>
              <div className="row w-100">
                <Textarea
                  placeholder={LABELS.BN.NOTES + " লিখুন"}
                  isRequired
                  noMargin
                  registerProperty={{
                    ...register(`organogramNoteDtoList.${idx}.note`, {
                      onChange: (e) => {
                        if (notNullOrUndefined(e.target.value)) {
                          setValue(
                            `organogramNoteDtoList.${idx}.displayOrder`,
                            idx + 1
                          );
                        }
                      },
                      required: " ",
                    }),
                  }}
                  isError={
                    !!errors?.organogramNoteDtoList?.[idx]?.mainActivityEn
                  }
                />
              </div>
              <div className="mt-4">
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

export default NotesForm;
