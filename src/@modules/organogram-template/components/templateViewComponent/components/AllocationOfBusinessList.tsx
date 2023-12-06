import { LABELS } from "@constants/common.constant";
import { Separator } from "@gems/components";
import "../style.scss";
import { numOfNewLines } from "utility/utils";
import TextBlock from "@components/TextBlock";

interface IAllocationOfBusinessForm {
  data: any;
  langEn: boolean;
}

const AllocationOfBusinessForm = ({
  data,
  langEn,
}: IAllocationOfBusinessForm) => {
  const LABEL = langEn ? LABELS.EN : LABELS.BN;
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABEL.ALLOCATION_OF_BUSINESS}</h4>
      </div>
      <Separator className="mt-1 mb-1" />
      {data?.length > 0 && (
        <ol className={langEn ? "" : "bn_ol"}>
          {data?.map((item, i) => {
            return (
              <li key={i}>
                {langEn ? (
                  numOfNewLines(item?.businessOfAllocationEn) < 1 ? (
                    item?.businessOfAllocationEn
                  ) : (
                    <TextBlock value={item?.businessOfAllocationEn} />
                  )
                ) : numOfNewLines(item?.businessOfAllocationBn) < 1 ? (
                  item?.businessOfAllocationBn
                ) : (
                  <TextBlock value={item?.businessOfAllocationBn} />
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default AllocationOfBusinessForm;
