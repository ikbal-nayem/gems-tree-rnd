import {
  Autocomplete,
  Button,
  Checkbox,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
} from "@gems/components";
import {
  COMMON_LABELS,
  IObject,
  isObjectNull,
  numBnToEn,
  numericCheck,
} from "@gems/utils";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { OMSService } from "@services/api/OMS.service";
import { bnCheck, enCheck } from "utility/checkValidation";

interface INodeForm {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data) => void;
  updateData?: IObject;
}

const NodeForm = ({ isOpen, onClose, onSubmit, updateData }: INodeForm) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      postFunctionalityList: [{}],
      manpowerList: [{}],
    },
  });

  const {
    fields: postFunctionalityListFields,
    append: postFunctionalityListAppend,
    remove: postFunctionalityListRemove,
  } = useFieldArray({
    control,
    name: "postFunctionalityList",
  });
  const {
    fields: manpowerListFields,
    append: manpowerListAppend,
    remove: manpowerListRemove,
  } = useFieldArray({
    control,
    name: "manpowerList",
  });

  const [postList, setPostist] = useState<IObject[]>([]);

  useEffect(() => {
    OMSService.getPostList().then((resp) => setPostist(resp.body || []));
  }, []);

  useEffect(() => {
    if (isOpen && !isObjectNull(updateData)) {
      reset({ ...updateData });
    } else reset({});
  }, [isOpen, updateData, reset]);

  return (
    <Modal
      title={`তথ্য ${isObjectNull(updateData) ? "যুক্ত" : "হালনাগাদ"} করুন`}
      isOpen={isOpen}
      handleClose={onClose}
      holdOn
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <ModalBody>
          <div className="row border rounded p-3 my-2 bg-gray-100">
            <div className="col-md-6 col-12">
              <Input
                label="বাংলা নাম"
                placeholder="বাংলা নাম লিখুন"
                isRequired
                registerProperty={{
                  ...register("titleBn", {
                    required: "বাংলা নাম লিখুন",
                    validate: bnCheck,
                  }),
                }}
                isError={!!errors?.titleBn}
                errorMessage={errors?.titleBn?.message as string}
              />
            </div>
            <div className="col-md-6 col-12">
              <Input
                label="ইংরেজি নাম"
                placeholder="ইংরেজি নাম লিখুন"
                isRequired
                registerProperty={{
                  ...register("titleEn", {
                    required: "ইংরেজি নাম লিখুন",
                    validate: enCheck,
                  }),
                }}
                isError={!!errors?.titleEn}
                errorMessage={errors?.titleEn?.message as string}
              />
            </div>
          </div>
          <div className="mt-3">
            <div className="d-flex justify-content-between">
              <h3 className="mt-3">কার্যকারিতা</h3>
              <div className="mt-2">
                <IconButton
                  iconName="add"
                  color="success"
                  rounded={false}
                  onClick={() => {
                    postFunctionalityListAppend({});
                  }}
                />
              </div>
            </div>
            {postFunctionalityListFields.map((field, index) => (
              <div
                className="d-flex align-items-center gap-3 w-100 border rounded p-3 my-2 bg-gray-100"
                key={field?.id}
              >
                <div className="row w-100">
                  <div>
                    <Input
                      label="দায়িত্ব"
                      placeholder="দায়িত্ব লিখুন"
                      registerProperty={{
                        ...register(
                          `postFunctionalityList.${index}.functionality`
                          // {
                          //   required: "দায়িত্ব লিখুন",
                          // }
                        ),
                      }}
                      // isRequired
                      isError={
                        !!errors?.postFunctionalityList?.[index]?.functionality
                      }
                      errorMessage={
                        errors?.postFunctionalityList?.[index]?.functionality
                          ?.message as string
                      }
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <IconButton
                    iconName="delete"
                    color="danger"
                    rounded={false}
                    onClick={() => postFunctionalityListRemove(index)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <div className="d-flex justify-content-between">
              <h3 className="mb-0 mt-3">কর্মকর্তা</h3>
              <div className="mt-2">
                <IconButton
                  iconName="add"
                  color="success"
                  rounded={false}
                  onClick={() => {
                    manpowerListAppend({});
                  }}
                />
              </div>
            </div>
            {manpowerListFields.map((field, index) => (
              <div
                className="d-flex align-items-center gap-3 w-100 border rounded p-3 my-2 bg-gray-100"
                key={field?.id}
              >
                <div className="row w-100">
                  <div className="col-md-6 col-xl-5">
                    <Autocomplete
                      label="পদবি"
                      placeholder="পদবি বাছাই করুন"
                      control={control}
                      options={postList || []}
                      getOptionLabel={(op) => op?.nameBn}
                      getOptionValue={(op) => op?.id}
                      name={`manpowerList.${index}.postDto`}
                      // onChange={onDataChange}
                      // isDisabled={!watch("type")}
                      //   isRequired
                      //   isError={!!errors?.inventory?.[idx]?.type}
                      //   errorMessage={
                      //     errors?.inventory?.[idx]?.type?.message as string
                      //   }
                    />
                  </div>
                  <div className="col-md-6 col-xl-2 d-flex align-items-center">
                    <Checkbox
                      label="প্রধান ?"
                      registerProperty={{
                        ...register(`manpowerList.${index}.isHead`),
                      }}
                    />
                  </div>
                  <div className="col-md-6 col-xl-5">
                    <Input
                      label="জনবল সংখ্যা"
                      placeholder="জনবল সংখ্যা লিখুন"
                      registerProperty={{
                        ...register(`manpowerList.${index}.numberOfEmployee`, {
                          setValueAs: (v) => numBnToEn(v),
                          validate: numericCheck,
                        }),
                      }}
                      // isRequired
                      isError={
                        !!errors?.manpowerList?.[index]?.numberOfEmployee
                      }
                      errorMessage={
                        errors?.manpowerList?.[index]?.numberOfEmployee
                          ?.message as string
                      }
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <IconButton
                    iconName="delete"
                    color="danger"
                    rounded={false}
                    onClick={() => manpowerListRemove(index)}
                  />
                </div>
              </div>
            ))}
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="d-flex gap-3 justify-content-end">
            <Button color="secondary" onClick={onClose}>
              {COMMON_LABELS.CANCEL}
            </Button>
            <Button color="primary" type="submit">
              {COMMON_LABELS.SAVE}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};
export default NodeForm;
