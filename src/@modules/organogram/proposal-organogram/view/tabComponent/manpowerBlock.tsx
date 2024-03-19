import { COMMON_LABELS } from "@constants/common.constant";
import { numEnToBn } from "@gems/utils";

const MpBlock = ({ nodeData, isEnamCommittee, color }) => {
  const list = nodeData?.manpowerDtoList;
  return (
    <div className="position rounded">
      <div className={"row text-start px-3 py-2 bg-" + color}>
        {list?.length > 0 ? (
          list?.map((mp, i) => {
            return (
              <div
                className={`col-12 col-lg-12 ${
                  mp?.isModified
                    ? "text-underline-color-yellow"
                    : mp?.isAddition
                    ? "text-underline-color-black"
                    : mp?.isDeleted
                    ? "text-line-through-color-red"
                    : ""
                }`}
                key={i}
              >
                {mp?.postTitleBn || mp?.postTitleEn || mp?.manpower ? (
                  <p className="mb-0">
                    {numEnToBn(mp?.manpower + " " || 0)} x{" "}
                    {(isEnamCommittee ? mp?.postTitleEn : mp?.postTitleBn) ||
                      COMMON_LABELS.NOT_ASSIGN}
                  </p>
                ) : null}
              </div>
            );
          })
        ) : (
          <p> - </p>
        )}
      </div>
    </div>
  );
};

export default MpBlock;
