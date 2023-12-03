import { LABELS } from "@constants/common.constant";
import { Separator } from "@gems/components";
import { IObject, numEnToBn } from "@gems/utils";
import { isNotEmptyList } from "utility/utils";

interface IEquipmentsForm {
  data: IObject[];
  inventoryData: IObject[];
  langEn: boolean;
}

const EquipmentsForm = ({ data, inventoryData, langEn }: IEquipmentsForm) => {
  const LABEL = langEn ? LABELS.EN : LABELS.BN;
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABEL.EQUIPMENTS}</h4>
      </div>
      <Separator className="mt-1 mb-1" />
      <div className="row">
        {isNotEmptyList(inventoryData) &&
          inventoryData?.map((item, i) => {
            return (
              <div className="col-md-6 col-12" key={i}>
                <span className="fs-5 fw-bold">{i + 1 + ". "}</span>
                <u className="fs-5 fw-bold mb-0">
                  {langEn ? item?.inventoryTypeEn : item?.inventoryTypeBn}
                </u>
                <ol type="a">
                  {item?.itemList.map((d, idx) => {
                    return (
                      <li key={idx}>
                        {langEn ? d?.quantity : numEnToBn(d?.quantity)} x{" "}
                        {langEn ? d?.itemTitleEn : d?.itemTitleBn}{" "}
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          })}
      </div>

      {data?.length > 0 && (
        <>
          <div className="card-head d-flex justify-content-start align-items-center gap-2">
            <span className="fs-5 fw-bold">3.</span>
            <u className="fs-5 fw-bold m-0">{LABEL.MISCELLANEOUS}</u>
          </div>
          <Separator className="mt-1 mb-2" />
        </>
      )}

      <div>
        <ol type="a" className={langEn ? "mb-0" : "bn_ol mb-0"}>
          {data?.length > 0 &&
            data?.map((item, i) => {
              return <li key={i}>{langEn ? item?.titleEn : item?.titleBn}</li>;
            })}
        </ol>
      </div>
    </div>
  );
};

export default EquipmentsForm;
