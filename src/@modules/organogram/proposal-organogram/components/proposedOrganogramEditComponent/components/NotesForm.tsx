import { LABELS } from "@constants/common.constant";
import { Separator, Textarea } from "@gems/components";

interface INotesForm {
  formProps: any;
}
const NotesForm = ({ formProps }: INotesForm) => {
  const {
    register,
    formState: { errors },
  } = formProps;
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.NOTES}</h4>
      </div>
      <Separator className="mt-1 mb-2" />
      <Textarea
        placeholder={LABELS.BN.NOTES + " লিখুন"}
        rows={3}
        noMargin
        registerProperty={{
          ...register(`organogramNoteDto.note`),
        }}
        isError={!!errors?.organogramNoteDto?.note}
        errorMessage={errors?.organogramNoteDto?.note?.message as string}
      />
    </div>
  );
};

export default NotesForm;
