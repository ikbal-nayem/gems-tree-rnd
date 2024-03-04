import { COMMON_LABELS } from "@constants/common.constant";
import { numEnToBn } from "@gems/utils";

const MpNode = ({ nodeData, isEnamCommittee }) => {
  const list = nodeData?.manpowerDtoList;
  return (
    <div className="position rounded">
      <div className="row bg-light text-start px-3 py-2">
        {list?.length > 0 &&
          list?.map((mp, i) => {
            return (
              <div className="col-12 col-lg-4 " key={i}>
                {mp?.postTitleBn || mp?.postTitleEn || mp?.manpower ? (
                  <p className="mb-0">
                    {numEnToBn(mp?.manpower + " " || 0)} x{" "}
                    {(isEnamCommittee
                      ? mp?.postTitleEn
                      : mp?.postTitleBn) || COMMON_LABELS.NOT_ASSIGN}
                  </p>
                ) : null}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MpNode;
