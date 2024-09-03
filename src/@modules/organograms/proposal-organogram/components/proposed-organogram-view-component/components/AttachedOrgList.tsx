import { COMMON_LABELS, LABELS } from "@constants/common.constant";
import { Separator } from "@gems/components";
import { IObject } from "@gems/utils";
import { isNotEmptyList } from "utility/utils";
import "../style.scss";

interface IAttachedOrgList {
  data: IObject[];
  langEn: boolean;
  isTabContent?: boolean;
  title?: string;
}

const GroupOrganization = (item, i, langEn, isTabContent) => {
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
      <ol type="1" className={langEn ? "mb-0" : "bn_ol mb-0"}>
        {isNotEmptyList(item?.organizationDTOList) &&
          item?.organizationDTOList?.map((d, idx) => {
            return (
              <li key={idx}>
                <span
                  className={
                    isTabContent
                      ? d?.isModified
                        ? "text-underline-color-yellow"
                        : d?.isAddition
                        ? "text-underline-color-black"
                        : d?.isDeleted
                        ? "text-line-through-color-red"
                        : ""
                      : ""
                  }
                >
                  {" "}
                  {langEn ? d?.organizationNameEn : d?.organizationNameBn}{" "}
                </span>
              </li>
            );
          })}
      </ol>
    </div>
  );
};

const AttachedOrgList = ({
  data,
  langEn,
  isTabContent,
  title,
}: IAttachedOrgList) => {
  const LABEL = langEn ? LABELS.EN : LABELS.BN;
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className={title ? "m-0 text-primary" : "m-0"}>
          {isTabContent && title ? title : LABEL.MAIN_ACTIVITIES}
        </h4>
      </div>
      <Separator className="mt-1 mb-2" />
      <div>
        {isNotEmptyList(data) && (
          <div className="row">
            <div className="col-md-6 col-12">
              {data?.map((item, i) => {
                if (i % 2 === 0) {
                  return GroupOrganization(item, i, langEn, isTabContent);
                }
              })}
            </div>
            <div className="col-md-6 col-12">
              {data?.map((item, i) => {
                if (i % 2 !== 0) {
                  return GroupOrganization(item, i, langEn, isTabContent);
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
