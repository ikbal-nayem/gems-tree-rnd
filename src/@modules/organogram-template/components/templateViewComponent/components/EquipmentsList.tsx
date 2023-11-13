import { LABELS } from "@constants/common.constant";
import { Separator } from "@gems/components";
import { IObject, numEnToBn } from "@gems/utils";

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
      <Separator className="mt-1 mb-2" />
      <div className="row">
        {inventoryData?.length>0 &&
          inventoryData?.map((item, i) => {
            return (
              <div className="col-md-6 col-12" key={i}>
                <p className="fs-5 fw-bold mb-0">
                  {langEn ? item?.inventoryTypeEn : item?.inventoryTypeBn}
                </p>
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
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABEL.MISCELLANEOUS}</h4>
      </div>
      <Separator className="mt-1 mb-2" />
      <div>
        <ol className={langEn ? "" : "bn_ol"}>
          {data?.length > 0 &&
            data?.map((item, i) => {
              return (
                <li key={i}>
                  &nbsp;&nbsp;{langEn ? item?.titleEn : item?.titleBn}
                </li>
              );
            })}
        </ol>
      </div>
    </div>
  );
};

export default EquipmentsForm;
