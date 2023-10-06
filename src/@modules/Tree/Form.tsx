import {
  Button,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
} from "@gems/components";
import { COMMON_LABELS, IObject, isObjectNull } from "@gems/utils";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

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
      functionality: [{}],
      employee: [{}],
    },
  });

  const {
    fields: functionalityFields,
    append: functionalityAppend,
    remove: functionalityRemove,
  } = useFieldArray({
    control,
    name: "functionality",
  });
  const {
    fields: employeeFields,
    append: employeeAppend,
    remove: employeeRemove,
  } = useFieldArray({
    control,
    name: "employee",
  });

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
          <div className="row">
            <div className="col-md-6 col-12">
              <Input
                label="বাংলা নাম"
                placeholder="বাংলা নাম লিখুন"
                isRequired
                registerProperty={{
                  ...register("nameBn", {
                    required: "বাংলা নাম লিখুন",
                  }),
                }}
                isError={!!errors?.nameBn}
                errorMessage={errors?.nameBn?.message as string}
              />
            </div>
            <div className="col-md-6 col-12">
              <Input
                label="ইংরেজি নাম"
                placeholder="ইংরেজি নাম লিখুন"
                isRequired
                registerProperty={{
                  ...register("nameEn", {
                    required: "ইংরেজি নাম লিখুন",
                  }),
                }}
                isError={!!errors?.nameEn}
                errorMessage={errors?.nameEn?.message as string}
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
                    functionalityAppend({});
                  }}
                />
              </div>
            </div>
            {functionalityFields.map((field, index) => (
              <div
                className="d-flex align-items-center gap-3 w-100"
                key={field?.id}
              >
                <div className="row w-100">
                  <div>
                    <Input
                      label="দায়িত্ব"
                      placeholder="দায়িত্ব লিখুন"
                      registerProperty={{
                        ...register(`functionality.${index}.responsibility`, {
                          required: "দায়িত্ব লিখুন",
                        }),
                      }}
                      isRequired
                      isError={!!errors?.functionality?.[index]?.responsibility}
                      errorMessage={
                        errors?.functionality?.[index]?.responsibility
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
                    onClick={() => functionalityRemove(index)}
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
                    employeeAppend({});
                  }}
                />
              </div>
            </div>
            {employeeFields.map((field, index) => (
              <div
                className="d-flex align-items-center gap-3 w-100"
                key={field?.id}
              >
                <div className="row w-100">
                  <div className="col-md-6">
                    <Input
                      label="পদ"
                      placeholder="পদ লিখুন"
                      registerProperty={{
                        ...register(`employee.${index}.rank`, {
                          required: "পদ লিখুন",
                        }),
                      }}
                      isRequired
                      isError={!!errors?.employee?.[index]?.rank}
                      errorMessage={
                        errors?.employee?.[index]?.rank?.message as string
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      label="জনবল সংখ্যা"
                      placeholder="জনবল সংখ্যা লিখুন"
                      type="number"
                      registerProperty={{
                        ...register(`employee.${index}.employeeNumber`, {
                          required: "জনবল সংখ্যা লিখুন",
                        }),
                      }}
                      isRequired
                      isError={!!errors?.employee?.[index]?.employeeNumber}
                      errorMessage={
                        errors?.employee?.[index]?.employeeNumber
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
                    onClick={() => employeeRemove(index)}
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
