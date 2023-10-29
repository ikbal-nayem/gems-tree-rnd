import { LABELS } from "@constants/common.constant";
import {
  Autocomplete,
  IconButton,
  Input,
  Separator,
  toast,
} from "@gems/components";
import { IObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import "../style.scss";

interface IEquipmentsForm {
  formProps: any;
}

const EquipmentsForm = ({ formProps }: IEquipmentsForm) => {
  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = formProps;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inventoryDtoList",
  });

  const [inventoryTypeList, setInventoryTypeList] = useState<IObject[]>([]);
  const [inventoryItemList, setInventoryItemList] = useState<IObject[]>([]);

  useEffect(() => {
    OMSService.getInventoryTypeList().then((resp) =>
      setInventoryTypeList(resp.body || [])
    );
  }, []);

  const onInventoryTypeChange = (e, idx) => {
    setValue(`inventoryDtoList.[${idx}].item`, null);
    if (e?.id) {
      OMSService.getInventoryItemListByType(e?.id).then((resp) =>
        setInventoryItemList(resp.body || [])
      );
    } else setInventoryItemList([]);
  };

  const onInventoryChange = (obj, idx) => {
    if (obj?.id) {
      const inventoryDtoList = getValues("inventoryDtoList") || [];
      for (let i = 0; i < inventoryDtoList.length; i++) {
        if (i !== idx && inventoryDtoList[i]?.item?.id === obj?.id) {
          toast.error(
            "'" + inventoryDtoList[i]?.item?.itemTitleBn + "' আইটেমটি অনন্য নয়"
          );

          setError(`inventoryDtoList.[${idx}].item`, {
            type: "manaul",
            message:
            "'" + inventoryDtoList[i]?.item?.itemTitleBn + "' আইটেমটি অনন্য নয় !",
          });
          break;
        }
        clearErrors(`inventoryDtoList.[${idx}].item`);
      }
    } else clearErrors(`inventoryDtoList.[${idx}].item`);
  };

  // console.log("Inventory List Errors: ", errors?.inventoryDtoList);

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
                  name={`inventoryDtoList.${idx}.type`}
                  onChange={(e) => onInventoryTypeChange(e, idx)}
                  // isDisabled={!watch("type")}
                  //   isRequired
                  //   isError={!!errors?.inventoryDtoList?.[idx]?.type}
                  //   errorMessage={
                  //     errors?.inventoryDtoList?.[idx]?.type?.message as string
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
                  name={`inventoryDtoList.${idx}.item`}
                  key={watch(`inventoryDtoList.${idx}.type`)}
                  isDisabled={!watch(`inventoryDtoList.${idx}.type`)}
                  onChange={(obj) => {
                    onInventoryChange(obj, idx);
                  }}
                  //   isRequired
                  isError={!!errors?.inventoryDtoList?.[idx]?.item}
                  errorMessage={
                    errors?.inventoryDtoList?.[idx]?.item?.message as string
                  }
                />
              </div>
              <div className="col-md-4">
                <Input
                  label="সংখ্যা"
                  placeholder="সংখ্যা লিখুন"
                  type="number"
                  defaultValue={0}
                  registerProperty={{
                    ...register(`inventoryDtoList.${idx}.quantity`, {
                      // required: "সংখ্যা লিখুন",
                    }),
                  }}
                  //   isRequired
                  //   isError={!!errors?.inventoryDtoList?.[idx]?.quantity}
                  //   errorMessage={
                  //     errors?.inventoryDtoList?.[idx]?.quantity?.message as string
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
