import { Autocomplete, Button, toast } from "@gems/components";
import { IObject, isObjectNull } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { ProposalService } from "@services/api/Proposal.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Form from "./Form";
import LetterTemplateView from "./LetterTemplateView";

let letterlistPayload = {
  meta: {
    page: 0,
    limit: 10000,
  },
  body: {},
};

interface IDraftLetter {
  organogramId: string;
}

const DraftLetter = ({ organogramId }: IDraftLetter) => {
  const { control } = useForm();
  const [letterlist, setLetterList] = useState<IObject[]>([]);
  const [data, setData] = useState<IObject>({});
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [seletectTemplateId, setSelectedTemplateId] = useState<string>("");
  const [templateViewData, setTemplateViewData] = useState<IObject>({});
  const [templateViewOpen, setTemplateViewOpen] = useState<boolean>(false);

  useEffect(() => {
    getLetterList();
    getDraftLetterData();
  }, [organogramId]);

  const getDraftLetterData = () => {
    ProposalService.FETCH.getDraftLetterByOrganogramId(organogramId)
      .then((res) => {
        setData(res?.body || {});
      })
      .catch((err) => console.log(err?.message));
  };

  const getLetterList = () => {
    OMSService.FETCH.getLetterBuilderList(letterlistPayload)
      .then((res) => {
        setLetterList(res?.body || []);
      })
      .catch((err) => console.log(err?.message));
  };

  const handleLetterTemplate = (method: string) => {
    if (seletectTemplateId) {
      ProposalService.FETCH.letterDetailsById(seletectTemplateId)
        .then((resp) => {
          let template = resp?.body?.letterDoc
            ? { draftDoc: resp?.body?.letterDoc }
            : {};
          if (method === "view") {
            setTemplateViewData(template);
            setTemplateViewOpen(true);
          } else setData(template);
        })
        .catch((e) => toast.error(e?.message));
    }
  };

  const onViewClose = () => {
    setTemplateViewData({});
    setTemplateViewOpen(false);
  };

  const onSubmit = (item) => {
    setIsSubmitLoading(true);
    let payload = {
      organizationOrganogramId: organogramId,
      draftDoc: item?.draftDoc,
    };
    ProposalService.SAVE.draftLetterCreate(payload)
      .then((res) => {
        if (res) {
          toast.success(res?.message);
        }
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsSubmitLoading(false));
  };

  return (
    <div className="card p-3">
      <div className="d-flex gap-3 align-items-center flex-wrap">
        <div className="w-md-350px">
          <Autocomplete
            label="পত্রের টেমপ্লেট"
            placeholder="পত্রের টেমপ্লেট বাছাই করুন"
            options={letterlist || []}
            getOptionLabel={(op) => op?.title}
            filterProps={["title"]}
            getOptionValue={(op) => op?.id}
            onChange={(op) => setSelectedTemplateId(op?.id)}
            name="selectedLetter"
            control={control}
          />
        </div>
        <div className="d-flex gap-3 mb-3 mb-md-0">
          <Button
            color="light-primary"
            size="sm"
            onClick={() => handleLetterTemplate("view")}
            isDisabled={!seletectTemplateId}
          >
            দেখুন
          </Button>
          <Button
            color="light-primary"
            size="sm"
            onClick={() => handleLetterTemplate("")}
            isDisabled={!seletectTemplateId}
          >
            খসড়া পত্রে যুক্ত করুন
          </Button>
        </div>
      </div>

      {!isObjectNull(data) ? (
        <Form
          onSubmit={onSubmit}
          data={data}
          isSubmitLoading={isSubmitLoading}
        />
      ) : null}

      <LetterTemplateView
        data={templateViewData}
        isOpen={templateViewOpen}
        onClose={onViewClose}
      />
    </div>
  );
};

export default DraftLetter;
