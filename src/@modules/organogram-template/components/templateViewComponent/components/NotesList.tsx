import { LABELS } from "@constants/common.constant";
import { Separator, Tag } from "@gems/components";
import { COMMON_LABELS, IColors } from "@gems/utils";
import { statusColorMapping } from "utility/colorMap";
import "../style.scss";

interface INotesList {
  data: any;
  langEn: boolean;
}
const NotesList = ({ data, langEn }: INotesList) => {
  const LABEL = langEn ? LABELS.EN : LABELS.BN;
  console.log(data);

  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABEL?.NOTES}</h4>
      </div>
      <Separator className="mt-1 mb-1" />
      {data?.length > 0 &&
        data?.map((item, i) => {
          return (
            <div className="mb-2" key={i}>
              <Tag
                title={item?.status || COMMON_LABELS.NOT_ASSIGN}
                color={
                  statusColorMapping(
                    item?.status || "IN_REVIEW",
                    "class"
                  ) as IColors
                }
              />
              {item?.organogramNoteDtoList?.length > 0 && (
                <ol className={langEn ? "" : "bn_ol"}>
                  {item?.organogramNoteDtoList?.map((noteItem, index) => {
                    return <li key={i}>{noteItem?.note}</li>;
                  })}
                </ol>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default NotesList;
