import { LABELS } from "@constants/common.constant";
import { Separator } from "@gems/components";

interface IEquipmentsForm {
  data: any;
}

let test = [
  {
    id: "cb7abfc3-00d3-47b6-8bf4-bc5c680eadb9",
    inventoryTypeEn: "Vehicle",
    inventoryTypeBn: "যানবাহন",
    itemList: [
      {
        id: "dfd1c62c-d5d5-4f76-a044-29638670e3a4",
        itemTitleBn: "মোটর সাইকেল",
        itemTitleEn: "Motorcycle",
        quantity: 1,
      },
    ],
  },
  {
    id: "f7787494-eb3f-43e8-b87e-184fdfd166ac",
    inventoryTypeEn: "Office-Equipment",
    inventoryTypeBn: "অফিস সরঞ্জাম",
    itemList: [
      {
        id: "85836fd0-4b2d-4b55-bb2f-03e54af6d369",
        itemTitleBn: "ফ্যান",
        itemTitleEn: "Fan",
        quantity: 3,
      },
      {
        id: "d596c2b8-5dd7-4d6d-aa59-b969fb1e317a",
        itemTitleBn: "চেয়ার",
        itemTitleEn: "Chair",
        quantity: 0,
      },
    ],
  },
];

const EquipmentsForm = ({ data }: IEquipmentsForm) => {
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.EQUIPMENTS}</h4>
      </div>
      <Separator className="mt-1 mb-2" />
      <div className="row">
        {test?.map((item, i) => {
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
        <ol>
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
