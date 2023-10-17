import { LABELS } from "@constants/common.constant";
import { Autocomplete, IconButton, Input, Separator } from "@gems/components";
import { IObject } from "@gems/utils";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import "../style.scss";

const Equipments = ({ data, onOtherDataSet }) => {
  const {
    register,
    control,
    getValues,
    formState: { errors },
    reset,
  } = useForm<any>({
    defaultValues: { inventory: [""] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inventory",
  });

  const [inventoryTypeList, setInventoryTypeList] = useState<IObject[]>([
    {
      id: 1,
      nameBn: "Test",
      nameEn: "test",
    },
    {
      id: 2,
      nameBn: "Test2",
      nameEn: "test",
    },
    {
      id: 3,
      nameBn: "Test3",
      nameEn: "test",
    },
  ]);

  useEffect(() => {
    data ? reset({ ...data }) : append("");
  }, []);

  const onDataChange = () => {
    onOtherDataSet("inventory", getValues()?.inventory);
  };

  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.EQUIPMENTS}</h4>
        <IconButton iconName="add" color="primary" onClick={() => append("")} />
      </div>
      <Separator className="mt-1 mb-2" />
      {/* <Form data={data} onOtherDataSet={onOtherDataSet} /> */}
      <form>
        {fields.map((f, idx) => (
          <div className="d-flex align-items-center gap-3 mt-3" key={idx}>
            <div className="row w-100">
              <div className="col-md-4">
                <Autocomplete
                  label="টাইপ"
                  placeholder="টাইপ বাছাই করুন"
                  control={control}
                  options={inventoryTypeList || []}
                  getOptionLabel={(op) => op?.nameBn}
                  getOptionValue={(op) => op?.id}
                  name={`inventory.${idx}.type`}
                  onChange={onDataChange}
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
                  options={inventoryTypeList || []}
                  getOptionLabel={(op) => op?.nameBn}
                  getOptionValue={(op) => op?.id}
                  name={`inventory.${idx}.item`}
                  onChange={onDataChange}
                  // isDisabled={!watch("type")}
                  //   isRequired
                  //   isError={!!errors?.inventory?.[idx]?.type}
                  //   errorMessage={
                  //     errors?.inventory?.[idx]?.type?.message as string
                  //   }
                />
                {/* <Input
                  label="সরঞ্জামাদির নাম"
                  placeholder="সরঞ্জামাদির নাম লিখুন"
                  registerProperty={{
                    ...register(`inventory.${idx}.item`, {
                      required: "সরঞ্জামাদির নাম লিখুন",
                      onChange: onDataChange,
                    }),
                  }}
                    isRequired
                    isError={!!errors?.inventory?.[idx]?.item}
                    errorMessage={
                      errors?.inventory?.[idx]?.item?.message as string
                    }
                /> */}
              </div>
              <div className="col-md-4">
                <Input
                  label="সংখ্যা"
                  placeholder="সংখ্যা লিখুন"
                  type="number"
                  registerProperty={{
                    ...register(`inventory.${idx}.number`, {
                      required: "সংখ্যা লিখুন",
                      onChange: onDataChange,
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
                  onDataChange();
                }}
              />
            </div>
          </div>
        ))}
      </form>
    </div>
  );
};

export default Equipments;
