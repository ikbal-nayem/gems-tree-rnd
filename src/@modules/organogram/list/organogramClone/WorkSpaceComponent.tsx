import {
  ContentPreloader,
  Icon,
  Input,
  Modal,
  ModalFooter,
  Pagination,
} from "@gems/components";
import { IMeta, IObject, useDebounce } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import clsx from "clsx";
import { FC, useEffect, useRef, useState } from "react";
import { ModalBody } from "react-bootstrap";
import { Controller } from "react-hook-form";

const initPayload = {
  meta: {
    page: 0,
    limit: 15,
    sort: [{ order: "asc", field: "createdOn" }],
  },
  body: {
    isActive: true,
  },
};

type WorkSpaceComponentProps = {
  getValues?: (name: string | string[]) => Array<string> | Array<IObject>;
  setValue?: (name: string, value: string | IObject) => void;
  control?: any;
  clearErrors?: any;
  isRequired?: boolean | string;
  onInstitutionChange?: (data) => void;
  disabled?: boolean;
};

const WorkSpaceComponent: FC<WorkSpaceComponentProps> = ({
  getValues,
  setValue,
  control,
  isRequired,
  clearErrors,
  onInstitutionChange,
  disabled,
}) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [WSList, setWSList] = useState([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const reqPayload = useRef<any>(initPayload);

  let searchKeyDebounce = useDebounce(searchKey, 500);

  useEffect(() => {
    if (searchOpen) {
      reqPayload.current.body = {
        ...reqPayload.current.body,
        searchKey: searchKeyDebounce,
        // trainingOfficeTag: "TRAINING",
      };
      reqPayload.current.meta.page = 0;
      onSearch();
    }
  }, [searchKeyDebounce, searchOpen]);

  const onSearch = () => {
    setLoading(true);
    OMSService.getOrganizationList(reqPayload.current)
      // OMSService.FETCH.childOrgByLoggedUser()
      .then((resp) => {
        setWSList(resp?.body);
        reqPayload.current.meta = resp?.meta;
      })
      .finally(() => setLoading(false));
  };

  const onPageChange = (meta) => {
    reqPayload.current.meta = { ...meta };
    onSearch();
  };

  const onClose = () => setSearchOpen(false);

  const onSelect = (ws: IObject | null) => {
    clearErrors("organization");
    setValue("organization", ws);
    setValue("organizationId", ws?.id);
    onInstitutionChange && onInstitutionChange(ws);
    setSearchOpen(false);
  };

  const values = getValues(["organization", "organizationId"]);

  return (
    <>
      <Controller
        control={control}
        name="organization"
        rules={{ required: isRequired }}
        render={({ field, formState: { errors } }) => (
          <Input
            label="প্রতিষ্ঠান"
            placeholder="প্রতিষ্ঠান বাছাই করুন"
            onClick={() => setSearchOpen(true)}
            isRequired={isRequired as boolean}
            disabled={disabled}
            endIcon={
              field.value?.nameBn
                ? !disabled && (
                    <Icon
                      icon="close"
                      size={20}
                      onClick={() => onSelect(null)}
                    />
                  )
                : null
            }
            onChange={() => {}}
            value={field.value?.nameBn || ""}
            isError={!!errors?.organization}
          />
        )}
      />

      <Modal
        isOpen={searchOpen}
        handleClose={onClose}
        size="lg"
        title="প্রতিষ্ঠান বাছাই করুন"
      >
        <ModalBody>
          <Input
            placeholder="প্রতিষ্ঠান অনুসন্ধান করুন ..."
            startIcon={<Icon icon="search" size={20} />}
            autoFocus
            onChange={(e) => setSearchKey(e.target?.value)}
            type="search"
            defaultValue={values?.[0]?.["nameBn"]}
          />
          <div className="d-block overflow-auto h-100">
            {WSList?.map((ws) => (
              <div
                key={ws?.id}
                className={clsx("bg-hover-light border rounded p-1 px-2 my-2", {
                  "text-white bg-primary bg-hover-primary":
                    values?.[0]?.["id"] === ws?.id,
                })}
                onClick={() => onSelect(ws)}
              >
                <span className="fs-5">{ws?.nameBn}</span>
              </div>
            ))}
          </div>
          <ContentPreloader show={isLoading} loaderText="অনুসন্ধান চলছে..." />
        </ModalBody>
        <ModalFooter className="d-block">
          <Pagination
            meta={reqPayload.current?.meta as IMeta}
            pageNeighbours={1}
            isLimitChangeable={false}
            // hideDataCount
            onPageChanged={onPageChange}
          />
        </ModalFooter>
      </Modal>
    </>
  );
};

export default WorkSpaceComponent;
