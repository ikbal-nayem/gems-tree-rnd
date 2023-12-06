import Drawer from "@components/Drawer";
import DrawerBody from "@components/Drawer/DrawerBody";
import DrawerFooter from "@components/Drawer/DrawerFooter";
import { MENU } from "@constants/menu-titles.constant";
import {
  Autocomplete,
  Button,
  DateInput,
  IconButton,
  Label,
} from "@gems/components";
import {
  COMMON_LABELS,
  IMetaKeyResponse,
  META_TYPE,
  isObjectNull,
  numEnToBn,
} from "@gems/utils";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

type IOptions = {
  orgList: IMetaKeyResponse[];
  postList: IMetaKeyResponse[];
  serviceList: IMetaKeyResponse[];
  cadreList: IMetaKeyResponse[];
  gradeList: IMetaKeyResponse[];
};

interface IForm {
  isOpen?: boolean;
  onSubmit: (data) => void;
  onClose: () => void;
  options?: IOptions;
  submitLoading?: boolean;
  userOrg: any;
}

const CreateForm = ({
  isOpen,
  onClose,
  onSubmit,
  options,
  submitLoading,
  userOrg,
}: IForm) => {
  const formProps = useForm();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    control,
    setValue,
  } = formProps;

  const cadreObj = options?.serviceList?.find(
    (op) => op?.metaKey === META_TYPE.SERVICE_TYPE_CADRE
  );

  useEffect(() => {
    reset({
      organization: userOrg,
    });
    setValue("organizationId", userOrg?.id);
    if (isOpen)
      postListAppend({
        serviceTypeDto: cadreObj,
      });
  }, [isOpen]);

  const {
    fields: postListFields,
    append: postListAppend,
    remove: postListRemove,
  } = useFieldArray({
    control,
    name: "postList",
  });

  return (
    <Drawer
      title={MENU.BN.POST_CONFIG + " " + COMMON_LABELS.SAVE}
      isOpen={isOpen}
      handleClose={onClose}
      widthXl="50"
      widthMd="50"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DrawerBody>
          <div className="row">
            <div className="col-12">
              <Autocomplete
                label="প্রতিষ্ঠান"
                name="organization"
                placeholder="প্রতিষ্ঠান বাছাই করুন"
                isRequired="প্রতিষ্ঠান বাছাই করুন"
                options={options?.orgList || []}
                getOptionLabel={(t) => t.nameBn}
                getOptionValue={(op) => op?.id}
                defaultValue={options?.orgList?.find(
                  (op) => op?.id === userOrg?.id
                )}
                onChange={(t) => setValue("organizationId", t?.id)}
                control={control}
                isError={!!errors?.organization}
                errorMessage={errors?.organization?.message as string}
              />
            </div>
            <div className="col-12">
              <DateInput
                label="অর্গানোগ্রাম তারিখ"
                isRequired="অর্গানোগ্রাম তারিখ বাছাই করুন"
                name="organogramDate"
                control={control}
                blockFutureDate
                isError={!!errors?.organogramDate}
                errorMessage={errors?.organogramDate?.message as string}
              />
            </div>

            {/* ============================== POST LIST ======================================= */}

            <div className="col-12">
              {postListFields.map((field, index) => (
                <div
                  className="d-flex align-items-top gap-3 w-100 border rounded px-3 my-1 bg-gray-100"
                  key={field?.id}
                >
                  <div className={index < 1 ? "mt-10" : "mt-3"}>
                    <Label> {numEnToBn(index + 1) + "।"} </Label>
                  </div>
                  <div className="row w-100">
                    <div className="col-md-4">
                      <Autocomplete
                        label={index < 1 ? "পদবি" : ""}
                        placeholder="পদবি বাছাই করুন"
                        isRequired=" "
                        control={control}
                        options={options?.postList || []}
                        getOptionLabel={(op) => op?.nameBn}
                        getOptionValue={(op) => op?.id}
                        name={`postList.${index}.postDTO`}
                        onChange={(t) =>
                          setValue(`postList.${index}.postId`, t?.id)
                        }
                        noMargin
                        isError={!!errors?.postList?.[index]?.postDTO}
                        errorMessage={
                          errors?.postList?.[index]?.postDTO?.message as string
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <Autocomplete
                        label={index < 1 ? "গ্রেড" : ""}
                        placeholder="গ্রেড বাছাই করুন"
                        isRequired=" "
                        control={control}
                        options={options?.gradeList || []}
                        getOptionLabel={(op) => op?.nameBn}
                        getOptionValue={(op) => op?.id}
                        name={`postList.${index}.gradeDTO`}
                        onChange={(t) =>
                          setValue(`postList.${index}.gradeId`, t?.id)
                        }
                        noMargin
                        isError={!!errors?.postList?.[index]?.gradeDTO}
                        errorMessage={
                          errors?.postList?.[index]?.gradeDTO?.message as string
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <Autocomplete
                        label={index < 1 ? "সার্ভিসের ধরণ" : ""}
                        placeholder="সার্ভিসের ধরণ বাছাই করুন"
                        isRequired=" "
                        control={control}
                        options={options?.serviceList || []}
                        getOptionLabel={(op) => op?.titleBn}
                        getOptionValue={(op) => op?.metaKey}
                        defaultValue={cadreObj}
                        name={`postList.${index}.serviceTypeDto`}
                        onChange={(t) =>
                          setValue(
                            `postList.${index}.serviceTypeKey`,
                            t?.metaKey
                          )
                        }
                        noMargin
                        isError={!!errors?.postList?.[index]?.serviceTypeDto}
                        errorMessage={
                          errors?.postList?.[index]?.serviceTypeDto
                            ?.message as string
                        }
                      />
                    </div>
                  </div>
                  <div className={index < 1 ? "mt-6" : ""}>
                    <IconButton
                      iconName="delete"
                      color="danger"
                      rounded={false}
                      onClick={() => postListRemove(index)}
                    />
                  </div>
                </div>
              ))}
              <div className="d-flex justify-content-center mt-8 mb-12">
                <IconButton
                  iconName="add"
                  color="success"
                  className="w-50 rounded-pill"
                  rounded={false}
                  onClick={() => {
                    postListAppend({ serviceTypeDto: cadreObj });
                  }}
                />
              </div>
            </div>
          </div>
        </DrawerBody>

        <DrawerFooter>
          <div className="d-flex gap-3 justify-content-end">
            <Button
              color="secondary"
              onClick={onClose}
              isDisabled={submitLoading}
            >
              {COMMON_LABELS.CLOSE}
            </Button>
            <Button color="primary" type="submit" isLoading={submitLoading}>
              {COMMON_LABELS.SAVE}
            </Button>
          </div>
        </DrawerFooter>
      </form>
    </Drawer>
  );
};
export default CreateForm;
