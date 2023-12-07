import { LABELS } from "@constants/common.constant";
import { Separator } from "@gems/components";
import "../style.scss";
import TextBlock from "@components/TextBlock";

interface INotesList {
  data: any;
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
      {data?.length > 0 && (
        <ol className={langEn ? "" : "bn_ol"}>
          {data?.map((item, i) => {
            return (
              <li key={i}>
                <TextBlock value={item?.note} />
                {/* &nbsp;&nbsp;
                {langEn ? item?.note : item?.note} */}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default NotesList;
