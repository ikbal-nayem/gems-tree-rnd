import { Autocomplete, toast } from "@gems/components";
import { IObject, isObjectNull } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { ProposalService } from "@services/api/Proposal.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Form from "./Form";

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

  const onLetterTemplateChange = (id: string) => {
    if (id) {
      ProposalService.FETCH.letterDetailsById(id)
        .then((resp) => {
          setData(
            resp?.body?.letterDoc ? { draftDoc: resp?.body?.letterDoc } : {}
          );
        })
        .catch((e) => toast.error(e?.message));
    }
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

  // const prepareOptions = (op) => (
  //   <div key={op?.id} className="d-flex justify-content-between  rounded">
  //     <div className="fw-bold fs-6  opacity-75">{op?.title}</div>
  //     <div className="text-end" onClick={() => console.log("ami pari")}>
  //       sdfsdaf
  //     </div>
  //   </div>
  // );

  return (
    <div className="card p-3">
      <div className="w-md-350px ">
        <Autocomplete
          label="পত্রের টেমপ্লেট"
          placeholder="পত্রের টেমপ্লেট বাছাই করুন"
          options={letterlist || []}
          getOptionLabel={(op) => op?.title}
          filterProps={["title"]}
          getOptionValue={(op) => op?.id}
          onChange={(op) => onLetterTemplateChange(op?.id)}
          name="selectedLetter"
          control={control}
        />
      </div>
      {!isObjectNull(data) ? (
        <Form
          onSubmit={onSubmit}
          data={data}
          isSubmitLoading={isSubmitLoading}
        />
      ) : null}
    </div>
  );
};

export default DraftLetter;
