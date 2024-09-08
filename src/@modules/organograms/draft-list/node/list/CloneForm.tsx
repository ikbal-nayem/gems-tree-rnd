import { ROUTE_L2 } from "@constants/internal-route.constant";
import {
  Autocomplete,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  toast,
} from "@gems/components";
import {
  COMMON_LABELS,
  IObject,
  enCheck,
  notNullOrUndefined,
} from "@gems/utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { OMSService } from "../../../../../@services/api/OMS.service";
import { Input } from "@components/Input";

interface IForm {
  cloneNodeId: string;
  isOpen: boolean;
  onClose: () => void;
  getDataList?: () => void;
  isNotEnamCommittee?: boolean;
  stateData?: IObject;
}

const NodeClone = ({
  cloneNodeId,
  isOpen,
  onClose,
  isNotEnamCommittee,
  getDataList,
  stateData,
}: IForm) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [cloneNodeData, setCloneNodeData] = useState<IObject>({});
  const [parentNodeList, setParentNodeList] = useState<IObject[]>([]);
  const [titleList, setTitleList] = useState<IObject[]>([]);
  const navigate = useNavigate();
  const formProps = useForm<any>();

  const {
    register,
    handleSubmit,
    reset,
    // setError,
    // clearErrors,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = formProps;

  useEffect(() => {
    getNodeDetailsById();
    getParentNodeList();
  }, [isOpen, cloneNodeId]);

  const getNodeDetailsById = () => {
    OMSService.FETCH.nodeDetailsById(cloneNodeId)
      .then((resp) => {
        setCloneNodeData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  const getParentNodeList = () => {
    OMSService.FETCH.nodeParentListByOrganogramId(stateData?.id)
      .then((resp) => {
        setParentNodeList(resp?.body);
      })
      .catch((e) => console.log(e?.message));
  };

  const onTitleChange = (val, fieldLang: "en" | "bn") => {
    if (!notNullOrUndefined(val)) return;
    let suggestedValue;
    // if (fieldLang === "en") {
    //   suggestedValue = titleList?.find((obj) => obj?.titleEn === val);
    //   if (notNullOrUndefined(suggestedValue))
    //     setValue("titleBn", suggestedValue?.titleBn);
    // } else {
    suggestedValue = titleList?.find((obj) => obj?.titleBn === val);
    if (notNullOrUndefined(suggestedValue))
      setValue("titleEn", suggestedValue?.titleEn);
    // }
  };

  useEffect(() => {
    OMSService.FETCH.nodeTitle().then((resp) => {
      setTitleList(resp?.body);
    });
  }, []);

  const onSubmit = (data) => {
    // if (duplicateTitleBnDitected || duplicateTitleEnDitected) return;

    const reqPayload = {
      ...data,
      commentNode: cloneNodeData?.commentNode || "",
      manpowerList:
        cloneNodeData?.manpowerList?.length > 0
          ? cloneNodeData?.manpowerList?.map((m, i) => {
              return {
                ...m,
                code: stateData?.maxManpowerCode + i + 1,
                id: null,
              };
            })
          : [],
      postFunctionalityList: cloneNodeData?.postFunctionalityList || [],
      organizationOrganogramId: stateData?.id || null,
      organizationId: stateData?.orgId || null,
      organogramDate: stateData?.organogramDate || null,
      code: stateData?.maxNodeCode ? stateData?.maxNodeCode + 1 : 1,
      maxNodeCode: stateData?.maxNodeCode ? stateData?.maxNodeCode + 1 : 1,
      maxManpowerCode:
        stateData?.maxManpowerCode + cloneNodeData?.manpowerList?.length,
    };

    setIsSubmitLoading(true);

    OMSService.SAVE.organogramSingleNodeCreate(reqPayload)
      .then((res) => {
        toast.success(res?.message);
        navigate(ROUTE_L2.OMS_ORGANOGRAM_NODE_LIST, {
          state: {
            ...stateData,
            maxNodeCode: stateData?.maxNodeCode
              ? stateData?.maxNodeCode + 1
              : 1,
            maxManpowerCode:
              stateData?.maxManpowerCode + cloneNodeData?.manpowerList?.length,
          },
        });
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => {
        setIsSubmitLoading(false);
        onClose();
        getDataList();
      });
  };

  const MODAL_TITLE =
    (cloneNodeData?.titleBn ? "'" + cloneNodeData?.titleBn + "' এর " : "") +
    "ক্লোন-পদ/স্তর তথ্য প্রদান করুন";
  return (
    <Modal
      title={MODAL_TITLE}
      // title="অর্গানোগ্রামের তথ্য প্রদান করুন"
      isOpen={isOpen}
      handleClose={onClose}
      holdOn
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <ModalBody>
          <div className="col-12 col-md-6 mb-3">
            <Autocomplete
              label={"পদ/স্তরের অভিভাবক"}
              placeholder="পদ/স্তরের অভিভাবক বাছাই করুন"
              control={control}
              options={parentNodeList || []}
              getOptionLabel={(op) =>
                isNotEnamCommittee ? op?.titleBn : op?.titleEn
              }
              getOptionValue={(op) => op?.id}
              name={`parentNodeDTO`}
              onChange={(t) => setValue("parentNodeId", t?.id)}
              noMargin
            />
          </div>
          <div className="row">
            {isNotEnamCommittee && (
              <div className="col-md-6 col-12">
                <Input
                  label="বাংলা নাম (শাখা/সেল/অধিশাখা/অনুবিভাগ)"
                  placeholder="বাংলা নাম লিখুন"
                  isRequired
                  noMargin
                  registerProperty={{
                    ...register("titleBn", {
                      onChange: (e) => onTitleChange(e.target.value, "bn"),
                      required: true,
                    }),
                  }}
                  suggestionOptions={titleList || []}
                  autoSuggestionKey="nodeTitleBn"
                  suggestionTextKey="titleBn"
                  isError={!!errors?.titleBn}
                  errorMessage={errors?.titleBn?.message as string}
                />
              </div>
            )}
            <div className={isNotEnamCommittee ? "col-md-6 col-12" : "col-12"}>
              <Input
                label="ইংরেজি নাম (শাখা/সেল/অধিশাখা/অনুবিভাগ)"
                placeholder="নাম ইংরেজিতে লিখুন"
                isRequired={!isNotEnamCommittee}
                noMargin
                registerProperty={{
                  ...register("titleEn", {
                    required: !isNotEnamCommittee,
                    onChange: (e) => {
                      if (isNotEnamCommittee)
                        onTitleChange(e.target.value, "en");
                    },
                    validate: enCheck,
                  }),
                }}
                suggestionOptions={titleList || []}
                autoSuggestionKey="nodeTitleEn"
                suggestionTextKey="titleEn"
                isError={!!errors?.titleEn}
                errorMessage={errors?.titleEn?.message as string}
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="d-flex gap-3 justify-content-end">
            <Button color="secondary" onClick={onClose}>
              {COMMON_LABELS.CANCEL}
            </Button>
            <Button color="primary" type="submit" isLoading={isSubmitLoading}>
              {COMMON_LABELS.SAVE}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default NodeClone;
