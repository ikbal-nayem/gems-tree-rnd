import {
  ContentPreloader,
  Icon,
  Input,
  Modal,
  ModalFooter,
  Pagination,
  Tag,
} from "@gems/components";
import { IMeta, IObject, useDebounce } from "@gems/utils";
import { CoreService } from "@services/api/Core.service";
import clsx from "clsx";
import { FC, useEffect, useRef, useState } from "react";
import { ModalBody } from "react-bootstrap";
import { Controller } from "react-hook-form";

const initPayload = {
  meta: {
    page: 0,
    limit: 15,
  },
  body: {},
};

type LocationWorkSpaceComponentProps = {
  getValues?: (name: string | string[]) => Array<string> | Array<IObject>;
  setValue?: (name: string, value: string | IObject) => void;
  control?: any;
  clearErrors?: any;
  isRequired?: boolean | string;
  onLocationChange?: (data) => void;
  disabled?: boolean;
};

const LocationWorkSpaceComponent: FC<LocationWorkSpaceComponentProps> = ({
  getValues,
  setValue,
  control,
  clearErrors,
  isRequired,
  onLocationChange,
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
    CoreService.getLocationBySearch(reqPayload.current)
      .then((resp) => {
        setWSList(resp?.body || []);
        reqPayload.current.meta = resp?.meta || reqPayload.current.meta;
      })
      .finally(() => setLoading(false));
  };

  const onPageChange = (meta) => {
    reqPayload.current.meta = { ...meta };
    onSearch();
  };

  const onClose = () => setSearchOpen(false);

  const onSelect = (ws: IObject | null) => {
    clearErrors("location");
    setValue("location", ws);
    setValue("locationId", ws?.id);
    onLocationChange && onLocationChange(ws);
    setSearchOpen(false);
  };

  const values = getValues(["location", "locationId"]);

  return (
    <>
      <Controller
        control={control}
        name="location"
        rules={{ required: isRequired }}
        render={({ field, formState: { errors } }) => (
          <Input
            label="স্থান"
            placeholder="স্থান বাছাই করুন"
            onClick={() => setSearchOpen(true)}
            isRequired={isRequired as boolean}
            disabled={disabled}
            endIcon={
              field.value?.titleBn
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
            value={field.value?.titleBn || ""}
            isError={!!errors?.location}
            errorMessage={errors?.location?.message as string}
          />
        )}
      />

      <Modal isOpen={searchOpen} handleClose={onClose} size="lg">
        <ModalBody>
          <Input
            placeholder="স্থান অনুসন্ধান করুন ..."
            startIcon={<Icon icon="search" size={20} />}
            autoFocus
            onChange={(e) => setSearchKey(e.target?.value)}
            type="search"
            defaultValue={values?.[0]?.["titleBn"]}
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
                <span className="fs-5">
                  {ws?.titleBn}{" "}
                  <Tag title={ws?.typeTitleBn} className="ms-2" size="sm" />
                </span>
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

export default LocationWorkSpaceComponent;
