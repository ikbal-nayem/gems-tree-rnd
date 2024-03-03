import { COMMON_LABELS } from "@constants/common.constant";
import { numEnToBn } from "@gems/utils";

const MpNode = ({ officeData }) => {
  const list = officeData?.manpowerList;
  return (
    <div className="position rounded">
      <div className="row bg-light text-start px-3 py-2">
        {list?.length > 0 &&
          list?.map((item, i) => {
            return (
              <div className="col-12 col-lg-4 " key={i}>
                {item?.postNameBn || item?.manpower ? (
                  <p className="mb-0">
                    {numEnToBn(item?.manpower + " " || 0)} x{" "}
                    {" " + item?.postNameBn || COMMON_LABELS.NOT_ASSIGN}
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