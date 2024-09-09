import { Button, NoData, toast } from "@gems/components";
import { IObject, isListNull, isObjectNull } from "@gems/utils";
import { ProposalService } from "@services/api/Proposal.service";
import { useEffect, useState } from "react";
import Form from "./Form";

interface ICheckListView {
  organogramId: string;
}

const checkListView = ({ organogramId }: ICheckListView) => {
  const [changeTypeList, setChangeTypeList] = useState<IObject[]>([]);
  const [selectedChangeType, setSelectedChangeType] = useState<IObject>({});
  const [checkListData, setCheckListData] = useState<IObject[]>([]);

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

  const onChangeTypeChange = (item: IObject) => {
    setSelectedChangeType(item);
    if (item?.id) {
      ProposalService.FETCH.checklistByChangeTypeId(item?.id)
        .then((resp) => {
          setCheckListData(resp?.body || []);
        })
        .catch((e) => toast.error(e?.message));
    }
  };

  const onSubmit = (data) => {
    console.log("yam", data);
  };

  // const dataSet = [
  //   {
  //     serialNo: 1,
  //     list: [
  //       {
  //         titleBn:
  //           "(খ) বিভিন্ন সময়ে সৃজিত/বিলুপ্তকৃত এবং বর্তমানে প্রস্তাবিত পদের তালিকা নিম্নের ছক অনুযায়ী মন্ত্রণালয়/বিভাগের সিনিয়র সচিব/সচিব মহোদয়ের স্বাক্ষরসহ প্রেরণ করা হয়েছে কিনা?",
  //       },
  //       { titleBn: "test 2" },
  //     ],
  //   },
  //   { serialNo: 2, list: [{ titleBn: "test 11" }] },
  // ];

  return (
    <div>
      {changeTypeList?.length > 0 ? (
        <>
          <div className="d-flex bg-white rounded mb-3 overflow-auto">
            {changeTypeList?.map((item, idx) => {
              return (
                <Button
                  onClick={() => onChangeTypeChange(item)}
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
          {!isObjectNull(selectedChangeType) && !isListNull(checkListData) && (
            <div>
              <Form data={checkListData || []} onSubmit={onSubmit} />
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
