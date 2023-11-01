import { LABELS } from "@constants/common.constant";
import {
  Autocomplete,
  IconButton,
  Input,
  Separator,
  toast,
} from "@gems/components";
import { IObject, numEnToBn } from "@gems/utils";
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

  const {
    fields: inventoryDtoListFields,
    append: inventoryDtoListAppend,
    remove: inventoryDtoListRemove,
  } = useFieldArray({
    control,
    name: "inventoryDtoList",
  });

  const {
    fields: miscellaneousDtoListFields,
    append: miscellaneousDtoListAppend,
    remove: miscellaneousDtoListRemove,
  } = useFieldArray({
    control,
    name: "miscellaneousDtoList",
  });

  const [inventoryTypeList, setInventoryTypeList] = useState<IObject[]>([]);
  const [inventoryItemList, setInventoryItemList] = useState<IObject[][]>([]);

  useEffect(() => {
    OMSService.getInventoryTypeList().then((resp) =>
      setInventoryTypeList(resp.body || [])
    );
  }, []);

  const inventoryDtoList = watch("inventoryDtoList");

  useEffect(() => {
    Promise.all(
      inventoryDtoList?.map((item) =>
        OMSService.getInventoryItemListByType(item?.type?.id)
      )
    ).then((resp) => {
      let cInventoryItemList = [...inventoryItemList];
      resp?.forEach((item, i) => {
        cInventoryItemList[i] = [...item?.body];
      });
      setInventoryItemList(cInventoryItemList);
    });
  }, [inventoryDtoList]);

  const onInventoryTypeChange = (e, idx) => {
    setValue(`inventoryDtoList.[${idx}].item`, null);
    if (e?.id) {
      OMSService.getInventoryItemListByType(e?.id).then((resp) => {
        const cInventoryItemList = [...inventoryItemList];
        cInventoryItemList[idx] = [...resp?.body];
        setInventoryItemList(cInventoryItemList);
      });
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
              "'" +
              inventoryDtoList[i]?.item?.itemTitleBn +
              "' আইটেমটি অনন্য নয় !",
          });
          break;
        }
        clearErrors(`inventoryDtoList.[${idx}].item`);
      }
    } else clearErrors(`inventoryDtoList.[${idx}].item`);
  };

  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.EQUIPMENTS}</h4>
        <IconButton
          iconName="add"
          color="primary"
          onClick={() => inventoryDtoListAppend("")}
        />
      </div>
      <Separator className="mt-1 mb-2" />
      <div>
        {inventoryDtoListFields.map((f, idx) => (
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
                />
              </div>
              <div className="col-md-4">
                <Autocomplete
                  label="সরঞ্জামাদি"
                  placeholder="সরঞ্জামাদি বাছাই করুন"
                  control={control}
                  options={inventoryItemList?.[idx] || []}
                  getOptionLabel={(op) => op?.itemTitleBn}
                  getOptionValue={(op) => op?.id}
                  name={`inventoryDtoList.${idx}.item`}
                  key={watch(`inventoryDtoList.${idx}.item`)}
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
                  inventoryDtoListRemove(idx);
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <Separator className="mt-1 mb-2" />
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.MISCELLANEOUS}</h4>
        <IconButton
          iconName="add"
          color="primary"
          onClick={() => miscellaneousDtoListAppend("")}
        />
      </div>
      <Separator className="mt-1 mb-2" />
      <div>
        {miscellaneousDtoListFields.map((f, idx) => (
          <div className="d-flex align-items-center gap-3 mt-3" key={idx}>
            <div className="row w-100">
              <Input
                label="তালিকা"
                placeholder={`তালিকা ${numEnToBn(idx + 1)}`}
                autoFocus
                registerProperty={{
                  ...register(`miscellaneousDtoList.${idx}.titleBn`, {
                    // required: "তালিকা যুক্ত করুন",
                  }),
                }}
                isError={!!errors?.miscellaneousDtoList?.[idx].titleBn}
                errorMessage={
                  errors?.miscellaneousDtoList?.[idx]?.titleBn
                    ?.message as string
                }
              />
            </div>
            <div className="mt-1">
              <IconButton
                iconName="delete"
                color="danger"
                // isDisabled={fields.length === 1}
                rounded={false}
                onClick={() => {
                  miscellaneousDtoListRemove(idx);
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
