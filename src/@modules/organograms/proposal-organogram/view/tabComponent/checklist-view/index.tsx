import { Button, NoData, toast } from "@gems/components";
import { IObject, isObjectNull } from "@gems/utils";
import { ProposalService } from "@services/api/Proposal.service";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Form from "./Form";

interface ICheckListView {
  organogramId: string;
}

const checkListView = ({ organogramId }: ICheckListView) => {
  const [changeTypeList, setChangeTypeList] = useState<IObject[]>([]);
  const [selectedChangeType, setSelectedChangeType] = useState<IObject>({});

  useEffect(() => {
    getChangeTypeList();
  }, [organogramId]);

  const getChangeTypeList = () => {
    ProposalService.FETCH.changeTypesByOrganogramId(organogramId)
      .then((resp) => {
        setChangeTypeList(resp?.body || []);
      })
      .catch((e) => toast.error(e?.message));
  };

  const dataSet = [
    {
      serialNo: 1,
      list: [
        {
          titleBn:
            "(খ) বিভিন্ন সময়ে সৃজিত/বিলুপ্তকৃত এবং বর্তমানে প্রস্তাবিত পদের তালিকা নিম্নের ছক অনুযায়ী মন্ত্রণালয়/বিভাগের সিনিয়র সচিব/সচিব মহোদয়ের স্বাক্ষরসহ প্রেরণ করা হয়েছে কিনা?",
        },
        { titleBn: "test 2" },
      ],
    },
    { serialNo: 2, list: [{ titleBn: "test 11" }] },
  ];

  return (
    <div>
      {changeTypeList?.length > 0 ? (
        <>
          <div className="d-flex bg-white rounded mb-3 overflow-auto">
            {changeTypeList?.map((item, idx) => {
              return (
                <Button
                  onClick={() => setSelectedChangeType(item)}
                  key={idx}
                  variant="fill"
                >
                  <span
                    className={`fs-5 ${
                      selectedChangeType?.id === item?.id ? "text-primary" : ""
                    }`}
                  >
                    {item?.titleBn}
                  </span>
                </Button>
              );
            })}
          </div>
          {!isObjectNull(selectedChangeType) && (
            <div>
              <Form updateData={dataSet || []} />
            </div>
          )}
        </>
      ) : (
        <NoData details="কোনো চেকলিস্ট তথ্য নেই" />
      )}
    </div>
  );
};

export default checkListView;
