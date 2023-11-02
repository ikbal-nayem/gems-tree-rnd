import { LABELS } from "@constants/common.constant";
import { Separator } from "@gems/components";
import { IObject } from "@gems/utils";

interface IEquipmentsForm {
  data: IObject[];
  inventoryData: IObject[];
}

const EquipmentsForm = ({ data, inventoryData }: IEquipmentsForm) => {
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.EQUIPMENTS}</h4>
      </div>
      <Separator className="mt-1 mb-2" />
      <div className="row">
        {inventoryData?.length &&
          inventoryData?.map((item, i) => {
            return (
              <div className="col-md-6 col-12" key={i}>
                <p className="fs-5 fw-bold mb-0">{item?.inventoryTypeBn}</p>
                <ol type="a">
                  {item?.itemList.map((d, idx) => {
                    return (
                      <li key={idx}>
                        {d?.quantity} x {d?.itemTitleBn}{" "}
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          })}
      </div>
      <Separator className="mt-1 mb-2" />
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.MISCELLANEOUS}</h4>
      </div>
      <Separator className="mt-1 mb-2" />
      <div>
        <ol className="bn_ol">
          {data?.length > 0 &&
            data?.map((item, i) => {
              return <li key={i}>&nbsp;&nbsp;{item?.titleBn}</li>;
            })}
        </ol>
      </div>
    </div>
  );
};

export default EquipmentsForm;
