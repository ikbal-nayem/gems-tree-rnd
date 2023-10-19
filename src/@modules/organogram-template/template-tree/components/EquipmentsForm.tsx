import { LABELS } from "@constants/common.constant";
import { Autocomplete, IconButton, Input, Separator } from "@gems/components";
import { IObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import "../style.scss";

interface IEquipmentsForm {
  formProps: any;
}

const EquipmentsForm = ({ formProps }: IEquipmentsForm) => {
  const { register, control, watch, setValue } = formProps;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inventory",
  });

  const [inventoryTypeList, setInventoryTypeList] = useState<IObject[]>([]);
  const [inventoryItemList, setInventoryItemList] = useState<IObject[]>([]);

  useEffect(() => {
    OMSService.getInventoryTypeList().then((resp) =>
      setInventoryTypeList(resp.body || [])
    );
  }, []);

  const onInventoryTypeChange = (e, idx) => {
    setValue(`inventory.[${idx}].item`, null);
    if (e?.id) {
      OMSService.getInventoryItemListByType(e?.id).then((resp) =>
        setInventoryItemList(resp.body || [])
      );
    } else setInventoryItemList([]);
  };

  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.EQUIPMENTS}</h4>
        <IconButton iconName="add" color="primary" onClick={() => append("")} />
      </div>
      <Separator className="mt-1 mb-2" />
      <div>
        {fields.map((f, idx) => (
          <div className="d-flex align-items-center gap-3 mt-3" key={idx}>
            <div className="row w-100">
              <div className="col-md-4">
                <Autocomplete
                  label="টাইপ"
                  placeholder="টাইপ বাছাই করুন"
                  control={control}
                  options={inventoryTypeList || []}
                  getOptionLabel={(op) => op?.inventoryTypeBn}
                  getOptionValue={(op) => op?.id}
                  name={`inventory.${idx}.type`}
                  onChange={(e) => {
                    onInventoryTypeChange(e, idx);
                  }}
                  // isDisabled={!watch("type")}
                  //   isRequired
                  //   isError={!!errors?.inventory?.[idx]?.type}
                  //   errorMessage={
                  //     errors?.inventory?.[idx]?.type?.message as string
                  //   }
                />
              </div>
              <div className="col-md-4">
                <Autocomplete
                  label="সরঞ্জামাদি"
                  placeholder="সরঞ্জামাদি বাছাই করুন"
                  control={control}
                  options={inventoryItemList || []}
                  getOptionLabel={(op) => op?.itemTitleBn}
                  getOptionValue={(op) => op?.id}
                  name={`inventory.${idx}.item`}
                  key={watch(`inventory.${idx}.type`)}
                  isDisabled={!watch(`inventory.${idx}.type`)}
                  //   isRequired
                  //   isError={!!errors?.inventory?.[idx]?.type}
                  //   errorMessage={
                  //     errors?.inventory?.[idx]?.type?.message as string
                  //   }
                />
              </div>
              <div className="col-md-4">
                <Input
                  label="সংখ্যা"
                  placeholder="সংখ্যা লিখুন"
                  type="number"
                  registerProperty={{
                    ...register(`inventory.${idx}.number`, {
                      required: "সংখ্যা লিখুন",
                    }),
                  }}
                  //   isRequired
                  //   isError={!!errors?.inventory?.[idx]?.number}
                  //   errorMessage={
                  //     errors?.inventory?.[idx]?.number?.message as string
                  //   }
                />
              </div>
            </div>
            <div className="mt-1">
              <IconButton
                iconName="delete"
                color="danger"
                // isDisabled={fields.length === 1}
                rounded={false}
                onClick={() => {
                  remove(idx);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentsForm;
