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
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

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
    setIsSubmitLoading(true);
    let fileList =
      (data?.orgmChangeList?.length > 0 &&
        data?.orgmChangeList.flatMap(
          (item) =>
            item.orgChecklistDtoList?.length > 0 &&
            item.orgChecklistDtoList
              .filter(
                (subItem) =>
                  subItem.attachmentFile !== undefined ||
                  !isObjectNull(subItem.attachmentFile)
              )
              ?.map((d) => {
                if (d?.fileName) return d?.attachmentFile;
                return;
              })
        )) ||
      [];

    console.log("sdsdsadad", fileList);

    data?.orgmChangeList?.length > 0 &&
      data?.orgmChangeList.forEach(
        (item) =>
          item.orgChecklistDtoList?.length > 0 &&
          item.orgChecklistDtoList?.forEach((d) => {
            if (d?.fileName) {
              delete d.attachmentFile;
            }
          })
      );

    let fd = new FormData();
    fd.append("orgmId", organogramId || "");
    fd.append("body", JSON.stringify(data?.orgmChangeList));
    fileList?.length > 0 &&
      fileList.forEach((element) => {
        fd.append("files", element);
      });

    ProposalService.SAVE.proposalChecklist(fd)
      .then((res) => {
        toast.success(res?.message);
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setIsSubmitLoading(false));
  };

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
              <Form
                data={checkListData || []}
                onSubmit={onSubmit}
                isSubmitLoading={isSubmitLoading}
              />
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
