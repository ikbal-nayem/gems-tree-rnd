import TextBlock from "@components/TextBlock";
import { LABELS } from "@constants/common.constant";
import { Separator } from "@gems/components";
import { IObject, isObjectNull } from "@gems/utils";
import { numOfNewLines } from "utility/utils";
import "../style.scss";

interface INotesList {
  data: IObject;
  langEn: boolean;
}
const NotesList = ({ data, langEn }: INotesList) => {
  const LABEL = langEn ? LABELS.EN : LABELS.BN;

  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABEL?.NOTES}</h4>
      </div>
      <Separator className="mt-1 mb-1" />
      {!isObjectNull(data) && (
        <div className="mb-2">
          {numOfNewLines(data?.note) < 1 ? (
            data?.note
          ) : (
            <TextBlock value={data?.note} />
          )}
        </div>
      )}
    </div>
  );
};

export default NotesList;
