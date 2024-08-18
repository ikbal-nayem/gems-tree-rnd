import { COMMON_LABELS, LABELS } from "@constants/common.constant";
import { Separator } from "@gems/components";
import { IObject } from "@gems/utils";
import { isNotEmptyList } from "utility/utils";

interface IAttachedOrgList {
  data: IObject[];
  langEn: boolean;
}

const GroupOrganization = (item, i, langEn) => {
  const COMMON_LABEL = langEn ? COMMON_LABELS.EN : COMMON_LABELS;
  return (
    <div key={i}>
      <p
        className={
          "fs-6 fw-bold mb-0" +
          (item?.orgTypeBn || item?.orgTypeEn ? "" : " fs-3 text-danger")
        }
      >
        {(langEn ? item?.orgTypeEn : item?.orgTypeBn) ||
          COMMON_LABEL.NOT_ASSIGN}
      </p>
      <ol>
        {isNotEmptyList(item?.organizationDTOList) &&
          item?.organizationDTOList?.map((d, idx) => {
            return (
              <li key={idx}>
                {langEn ? d?.organizationNameEn : d?.organizationNameBn}
              </li>
            );
          })}
      </ol>
    </div>
  );
};

const AttachedOrgList = ({ data, langEn }: IAttachedOrgList) => {
  const LABEL = langEn ? LABELS.EN : LABELS.BN;
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABEL.ATTACHED_OFFICE}</h4>
      </div>
      <Separator className="mt-1 mb-2" />
      <div>
        {isNotEmptyList(data) && (
          <div className="row">
            <div className="col-md-6 col-12">
              {data?.map((item, i) => {
                if (i % 2 === 0) {
                  return GroupOrganization(item, i, langEn);
                }
              })}
            </div>
            <div className="col-md-6 col-12">
              {data?.map((item, i) => {
                if (i % 2 !== 0) {
                  return GroupOrganization(item, i, langEn);
                }
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachedOrgList;
