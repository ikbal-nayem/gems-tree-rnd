import { LABELS } from "@constants/common.constant";
import { Separator } from "@gems/components";
import "../style.scss";

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
      <Separator className="mt-1 mb-2" />
      <div>
        <ol className={langEn ? "" : "bn_ol"}>
          {data?.length > 0 &&
            data?.map((item, i) => {
              return (
                <li key={i}>
                  &nbsp;&nbsp;
                  {langEn
                    ? item?.businessOfAllocationEn
                    : item?.businessOfAllocationBn}
                </li>
              );
            })}
        </ol>
      </div>
    </div>
  );
};

export default AllocationOfBusinessForm;
