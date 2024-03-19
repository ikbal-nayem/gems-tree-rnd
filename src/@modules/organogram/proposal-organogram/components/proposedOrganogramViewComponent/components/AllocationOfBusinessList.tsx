import TextBlock from "@components/TextBlock";
import { COMMON_LABELS, LABELS } from "@constants/common.constant";
import { Separator } from "@gems/components";
import { numOfNewLines } from "utility/utils";
import "../style.scss";

interface IAllocationOfBusinessList {
  data: any;
  langEn: boolean;
  isTabContent?: boolean;
  title?: string;
}

const AllocationOfBusinessList = ({
  data,
  langEn,
  isTabContent,
  title,
}: IAllocationOfBusinessList) => {
  const LABEL = langEn ? LABELS.EN : LABELS.BN;
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className={title ? "m-0 text-primary" : "m-0"}>
          {isTabContent && title ? title : LABEL.ALLOCATION_OF_BUSINESS}
        </h4>
      </div>
      <Separator className="mt-1 mb-1" />
      {data?.length > 0 && (
        <ol className={langEn ? "" : "bn_ol"}>
          {data?.map((item, i) => {
            return (
              <li key={i}>
                {langEn ? (
                  numOfNewLines(item?.businessOfAllocationEn) < 1 ? (
                    item?.businessOfAllocationEn || COMMON_LABELS.NOT_ASSIGN
                  ) : (
                    <TextBlock value={item?.businessOfAllocationEn} />
                  )
                ) : numOfNewLines(item?.businessOfAllocationBn) < 1 ? (
                  item?.businessOfAllocationBn || COMMON_LABELS.NOT_ASSIGN
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

export default AllocationOfBusinessList;
